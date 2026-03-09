# dashboard-pwa

## 專案定位

北3區業績 Dashboard PWA。追蹤醫療業務的週/月收檢量、Pred 業績（price × qty）與官方業績的差異。Single-File PWA，Vanilla JS，無框架，無後端。

- Remote: `stompsid-lgtm/dashboard-pwa`（private）
- 初始實作完成：2026-03-07

## 目錄結構

```
dashboard-pwa/
├── index.html      # 主應用（HTML + CSS + JS 內嵌，約 1039 行）
├── manifest.json   # PWA Manifest（名稱、圖示、display: standalone）
├── sw.js           # Service Worker（cache-first 策略）
├── Spec.md         # 規格文件
└── Log.md          # 開發日誌
```

## 技術棧

| 項目 | 詳情 |
|------|------|
| 框架 | 無（Vanilla JS） |
| 圖表 | Apache ECharts v5（CDN） |
| PWA | Manifest + Service Worker（cache-first） |
| 字型 | CSS 系統字型（無外部依賴） |
| 資料來源 | Apps Script Web App JSON（`ENDPOINT` 常數，目前為 placeholder） |

## 核心痛點

- **月份認列規則特殊**：AdjDate >= 16 日算下個月，< 16 日算當月
- **ENDPOINT 尚未接上真實資料**：目前跑 Mock data（6 個月、5 個客戶、4 種產品）
- 篩選狀態存 JS 記憶體，重整後清空

## 資料結構

### Apps Script JSON 格式（真實資料來源）
```json
{
  "history": [{ "ReportDate": "", "AdjDate": "", "Client": "", "Product": "", "Qty": 0 }],
  "finance": [{ "日期": "", "客戶": "", "業績": 0 }],
  "price":   [{ "客戶": "", "06瓶": 0, "10瓶": 0, "20瓶": 0, "PLTgel": 0 }],
  "updatedAt": "ISO timestamp"
}
```

### Global State（JS）
```javascript
const state = {
  dateRange: { start, end },  // 預設近 6 個月
  clients: [],                // 空陣列 = 全部客戶
  products: []                // 空陣列 = 全部產品
}
```

### 產品色碼
| 產品 | 色碼 |
|------|------|
| 06瓶 | `#4fc3f7`（淺藍）|
| 10瓶 | `#81c784`（綠）|
| 20瓶 | `#ffb74d`（橙）|
| PLTgel | `#e57373`（紅）|

## 當前進度

- 所有功能以 Mock data 驗證完成（KPI 卡、週/月圖表、客戶排行、規格甜甜圈、明細表、2026 Pred 月趨勢）
- `ENDPOINT` 常數尚未接上真實 Apps Script URL
- 部署方式尚未確定

## 已知技術債

- `ENDPOINT = 'YOUR_APPS_SCRIPT_URL'`：需建立 Apps Script Web App 並填入
- ECharts 依賴 CDN，離線時圖表無法渲染
- Service Worker cache 版本為 `dashboard-pwa-v1`，更新時需 bump 版本號

## 常用指令

```bash
# 本機開啟（直接）
open index.html

# 本機 server（推薦，避免 Service Worker 路徑問題）
python3 -m http.server 8000
# 開啟 http://localhost:8000
```

## 下一步

1. 建立 Google Sheets + Apps Script Web App，輸出上述 JSON 格式
2. 將 `index.html` 中 `ENDPOINT` 常數改為真實 URL
3. 決定並設定部署方式（GitHub Pages 或其他靜態主機）
