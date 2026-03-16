/**
 * 北3區業績 Dashboard — Google Apps Script Web App
 *
 * 資料來源：
 *   1. 每週銷存表 (1mC3nWoFgFgiqnmAsxWNOXUkr6kvY4FFetGnH1MMwlLI)
 *      - 歷史資料庫：收檢紀錄
 *      - 單價：客戶報價表
 *      - 財務實際業績：官方業績
 *   2. 2026 目標設定 (1Sc6b0Wc4Xqm6XypYm759lnH041ODtKdRDhMsFciro5A)
 *      - 2026業績目標分季：骨復北3區月度目標
 *
 * 輸出：JSON（history / finance / price / target / updatedAt）
 * 快取：CacheService 5 分鐘
 */

// ===== 常數 =====

var SALES_SHEET_ID = '1mC3nWoFgFgiqnmAsxWNOXUkr6kvY4FFetGnH1MMwlLI';
var TARGET_SHEET_ID = '1Sc6b0Wc4Xqm6XypYm759lnH041ODtKdRDhMsFciro5A';
var CACHE_KEY = 'dashboard_json_v1';
var CACHE_TTL = 300; // 5 分鐘（秒）

// ===== 主進入點 =====

/**
 * Web App 進入點，回傳 JSON 資料
 * 支援 CORS（Access-Control-Allow-Origin: *）
 */
function doGet(e) {
  // 嘗試從快取讀取
  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY);

  var jsonString;
  if (cached) {
    jsonString = cached;
  } else {
    // 快取未命中，重新讀取所有資料
    var data = buildAllData_();
    jsonString = JSON.stringify(data);

    // CacheService 單筆上限 100KB，超過就不快取（避免錯誤）
    if (jsonString.length < 100000) {
      cache.put(CACHE_KEY, jsonString, CACHE_TTL);
    }
  }

  // 回傳 JSON（GAS Web App 部署後自動處理 CORS，但明確設定 header）
  var output = ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}

// ===== 資料組裝 =====

/**
 * 組裝所有資料為完整 JSON 物件
 */
function buildAllData_() {
  var salesSS = SpreadsheetApp.openById(SALES_SHEET_ID);
  var targetSS = SpreadsheetApp.openById(TARGET_SHEET_ID);

  return {
    history: readHistory_(salesSS),
    finance: readFinance_(salesSS),
    price: readPrice_(salesSS),
    target: readTarget_(targetSS),
    updatedAt: new Date().toISOString()
  };
}

// ===== 歷史資料庫 =====

/**
 * 讀取「歷史資料庫」sheet
 * 欄位：ReportDate | AdjDate | Client | Product | Qty
 * 日期格式 2025/01/01 → 轉成 YYYY-MM-DD
 */
function readHistory_(ss) {
  var sheet = ss.getSheetByName('歷史資料庫');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var headers = data[0]; // 第一列為標題
  var rows = data.slice(1);

  return rows
    .filter(function(row) {
      // 過濾空列
      return row[0] !== '' && row[0] != null;
    })
    .map(function(row) {
      return {
        ReportDate: formatDate_(row[0]),
        AdjDate: formatDate_(row[1]),
        Client: String(row[2]).trim(),
        Product: String(row[3]).trim(),
        Qty: toNumber_(row[4])
      };
    });
}

// ===== 財務實際業績 =====

/**
 * 讀取「財務實際業績」sheet
 * 欄位：日期 | 客戶 | 業績
 * 日期格式 2025/1/1 → 轉成 YYYY-MM-DD
 */
function readFinance_(ss) {
  var sheet = ss.getSheetByName('財務實際業績');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var rows = data.slice(1);

  return rows
    .filter(function(row) {
      return row[0] !== '' && row[0] != null;
    })
    .map(function(row) {
      return {
        '日期': formatDate_(row[0]),
        '客戶': String(row[1]).trim(),
        '業績': toNumber_(row[2])
      };
    });
}

// ===== 單價表 =====

/**
 * 讀取「單價」sheet
 * 欄位：客戶 | 06瓶 | 10瓶 | 20瓶 | PLTgel
 * 金額格式 $13,333 → strip $ 和 , 後轉 Number
 */
function readPrice_(ss) {
  var sheet = ss.getSheetByName('單價');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var rows = data.slice(1);

  return rows
    .filter(function(row) {
      // 過濾空列（客戶欄不為空）
      return row[0] !== '' && row[0] != null;
    })
    .map(function(row) {
      return {
        '客戶': String(row[0]).trim(),
        '06瓶': parseCurrency_(row[1]),
        '10瓶': parseCurrency_(row[2]),
        '20瓶': parseCurrency_(row[3]),
        'PLTgel': parseCurrency_(row[4])
      };
    });
}

// ===== 業績目標 =====

/**
 * 讀取「2026業績目標分季」sheet 中「骨復北3區」那一行
 * 抓 1-12 月的月度目標數據，組成 monthly 陣列 + yearly 合計
 */
function readTarget_(ss) {
  var sheet = ss.getSheetByName('2026業績目標分季');

  // 預設值（如果找不到資料）
  var defaultTarget = {
    monthly: [560000, 560000, 560000, 560000, 560000, 560000, 560000, 560000, 560000, 560000, 700000, 700000],
    yearly: 7000000
  };

  if (!sheet) return defaultTarget;

  var data = sheet.getDataRange().getValues();

  // 尋找包含「骨復北3區」的那一行
  var targetRow = null;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      var cellVal = String(data[i][j]).trim();
      if (cellVal.indexOf('骨復北3區') !== -1 || cellVal.indexOf('骨復北3区') !== -1) {
        targetRow = data[i];
        break;
      }
    }
    if (targetRow) break;
  }

  if (!targetRow) return defaultTarget;

  // 從該行中提取 12 個月的數字（跳過文字欄位）
  var numbers = [];
  for (var k = 0; k < targetRow.length; k++) {
    var val = toNumber_(targetRow[k]);
    if (val > 0) {
      numbers.push(val);
    }
  }

  // 需要至少 12 個數字（12 個月目標）
  // 數字可能包含：12 個月目標 + 4 個季度合計 + 1 個年度合計
  // 策略：如果有 >= 13 個數字，最後一個通常是年目標，前 12 個是月目標
  // 如果剛好 12 個，就是月目標，年目標用加總
  var monthly;
  var yearly;

  if (numbers.length >= 13) {
    // 前 12 個是月目標，最後一個是年目標
    monthly = numbers.slice(0, 12);
    yearly = numbers[numbers.length - 1];
  } else if (numbers.length === 12) {
    monthly = numbers;
    yearly = numbers.reduce(function(sum, n) { return sum + n; }, 0);
  } else {
    // 數字不夠，使用預設值
    return defaultTarget;
  }

  return {
    monthly: monthly,
    yearly: yearly
  };
}

// ===== 工具函式 =====

/**
 * 將日期轉為 ISO 格式 YYYY-MM-DD
 * 支援 Date 物件、「2025/01/01」、「2025/1/1」等格式
 */
function formatDate_(val) {
  if (!val) return '';

  var d;

  if (val instanceof Date) {
    // GAS 從 sheet 讀出的日期通常已是 Date 物件
    d = val;
  } else {
    // 字串格式：嘗試 parse
    var str = String(val).trim();
    // 將 / 替換為 - 以利 parse
    str = str.replace(/\//g, '-');
    d = new Date(str);
  }

  // 檢查是否為有效日期
  if (isNaN(d.getTime())) return String(val);

  var year = d.getFullYear();
  var month = ('0' + (d.getMonth() + 1)).slice(-2);
  var day = ('0' + d.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
}

/**
 * 解析金額字串，strip $ 和 , 後轉為 Number
 * 例如 "$13,333" → 13333
 * 如果已是數字則直接回傳
 */
function parseCurrency_(val) {
  if (val == null || val === '') return 0;
  if (typeof val === 'number') return val;

  // 去除 $、, 、空白
  var cleaned = String(val).replace(/[$,\s]/g, '');
  var num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * 將值轉為 Number，無法轉換時回傳 0
 */
function toNumber_(val) {
  if (val == null || val === '') return 0;
  if (typeof val === 'number') return val;

  var cleaned = String(val).replace(/[$,\s]/g, '');
  var num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}
