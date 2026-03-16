# 北3區業績 Dashboard PWA — 規格文件 v2

## 概述
業務用個人 Dashboard PWA，查看北3區骨科/復健科客戶銷售數據。
v2 全面重做視覺與佈局，採用 **Brutalist Signal** 設計語言。

## 設計語言：Brutalist Signal

### 核心美學
- 極深黑底（#0a0a0a）+ 螢光橙色塊（#FF5722）作為 signal color
- Editorial Type Scale：hero 數字 4–9rem、body 0.85–1.1rem、落差 ≥ 6x
- 報紙頭版感：大數字一眼可見，不需閱讀就能「感受」數據

### 字體
- Display / 數字：`Archivo Black`（Google Fonts, weight 900）
- 中文 / Body：`Noto Sans TC`（Google Fonts, weight 300–900）
- Fallback：PingFang TC → Microsoft JhengHei

### 配色
```css
--bg: #0a0a0a;
--bg-card: #141414;
--bg-elevated: #1a1a1a;
--signal: #FF5722;          /* 主強調 — 橙 */
--cyan: #00E5FF;            /* 06瓶 */
--green: #76FF03;           /* 10瓶 / 正向指標 */
--amber: #FFD600;           /* 20瓶 */
--signal-red: #FF5722;      /* PLTgel / signal */
--text: #f0f0f0;
--text-dim: #666;
--text-muted: #444;
--border: #222;
```

### 產品色系（v2）
| 產品 | 色碼 | 色名 |
|------|------|------|
| 06瓶 | #00E5FF | Cyan |
| 10瓶 | #76FF03 | Lime |
| 20瓶 | #FFD600 | Amber |
| PLTgel | #FF5722 | Signal Orange |

### CSS 規範
- 所有 font-size 使用 `clamp(min, preferred, max)`
- Body text minimum ≥ 13px
- 充分利用 viewport 空間，不縮在頁面中央
- 入場動畫：fadeUp 0.7s staggered

## 資料來源
Apps Script Web App 輸出 JSON，包含：
- `history[]`：收檢紀錄（ReportDate, AdjDate, Client, Product, Qty）
- `finance[]`：官方業績（日期, 客戶, 業績）
- `price[]`：客戶報價表（客戶, 06瓶, 10瓶, 20瓶, PLTgel）
- `target`：業績目標（月目標或年目標，mock 先用常數）
- `updatedAt`：ISO timestamp

## 業務規則

### 月份認列
- AdjDate >= 16日 → 算下個月
- AdjDate < 16日 → 算當月

### 週定義
- ISO 週 Mon–Sun
- X 軸顯示週一日期

### Pred 業績計算
`Σ(price[client][product] × qty)`，price 為稅前價

### 目標達成率（v2 新增）
- `達成率 = Pred 業績 / 目標 × 100%`
- 目標值來源：data source `target` 欄位，mock 時用常數
- Hero 區顯示 progress ring，KPI 卡片顯示達成率 %
- 年度趨勢圖加目標虛線

## 技術規格
- 單一 `index.html`（HTML + CSS + JS 內嵌）
- Apache ECharts v5 CDN
- Vanilla JS，無框架
- Google Fonts CDN（Archivo Black + Noto Sans TC）
- PWA + Service Worker（cache-first）
- 響應式：768px breakpoint

## Global State
```javascript
const state = {
  dateRange: { start, end },  // 預設近6個月
  clients: [],                 // 空 = 全部
  products: []                 // 空 = 全部
}
```
- 所有圖表點擊 → 更新 state → filterData → 重繪所有圖表

## 佈局結構（由上而下）

### Nav（sticky 頂部）
- 左：品牌 `北3區 DASHBOARD`（Archivo Black, signal orange）+ 更新時間
- 右：期間 pills（1M / 3M / 6M / YTD）+ 自定義日期區間（date input start ~ end）
- Pills 與日期連動：選 pill → 自動填日期；手動改日期 → pill 取消 active

### Hero Zone
- 左：期間收檢量大數字（Archivo Black, ~10rem）+ 單位 + label
- 右：業績 vs 目標 progress ring（達成率 %）

### KPI Row（4 張卡片）
| 卡片 | 底色 | 內容 |
|------|------|------|
| Pred 業績 | signal orange | 金額 |
| 官方業績 | dark + border | 金額 + delta badge（vs Pred %） |
| 差異 | dark + border | Pred vs 官方 % |
| 目標達成率 | dark + border | 達成率 % + progress bar |

### 主圖表區（2 欄）
- 左（2fr）：週收檢趨勢 — 堆疊長條 + 累積折線
- 右（1fr）：客戶排行 — 卡片列表風格（排名數字 01–05、名稱、瓶數、金額）

### 次圖表區（2 欄）
- 左：月銷量趨勢 — 分組長條
- 右：規格分佈 — 甜甜圈

### 全寬：客戶業績明細表
- 欄位：客戶 | 06瓶 | 10瓶 | 20瓶 | PLTgel | 總量 | Pred業績 | 官方業績 | 差異%
- 深色表格，hover highlight

### 全寬：2026 Pred 年度趨勢
- 月 Pred bar + 累積折線 + 目標虛線

## 篩選器

### 桌機（>= 768px）
Nav 內常駐：
- 期間 pills（1M / 3M / 6M / YTD）
- 自定義日期區間（date input start ~ end）
- 客戶多選 chip
- 產品 chip

### 手機（< 768px）
- 觸發列：顯示篩選摘要文字 + 箭頭
- Bottom sheet（70% 高度、把手列、滑入動畫）：
  - 期間 pills + 日期區間
  - 客戶 chip
  - 產品 chip
  - 套用按鈕

## 圖表點擊行為
| 圖表 | 點擊目標 | 行為 |
|------|----------|------|
| 週長條圖 | 某週 | dateRange 設為該週 Mon–Sun |
| 月趨勢圖 | 某月 | dateRange 設為該月 |
| 客戶排行 | 某客戶 | clients toggle |
| 規格甜甜圈 | 某規格 | products toggle |

## 手機模塊（< 768px）
- Hero 大數字（仍超大）
- KPI 卡片 × 3：本週收檢量 / 本月收檢量 / 本月 Pred 業績
- 週收檢長條圖（簡易）
- 月銷量堆疊長條圖
- 底部 bottom-sheet 篩選器
