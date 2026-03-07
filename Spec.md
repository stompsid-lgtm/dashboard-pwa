# 北3區業績 Dashboard PWA — 規格文件

## 概述
業務用個人 Dashboard PWA，查看北3區骨科/復健科客戶銷售數據。

## 資料來源
Apps Script Web App 輸出 JSON，包含四個欄位：
- `history`：收檢紀錄（ReportDate, AdjDate, Client, Product, Qty）
- `finance`：官方業績（日期, 客戶, 業績）
- `price`：客戶報價表（客戶, 06瓶, 10瓶, 20瓶, PLTgel）
- `updatedAt`：資料更新時間

## 月份認列規則
- AdjDate >= 16日 → 算下個月
- AdjDate < 16日 → 算當月

## 週定義
- ISO 週 Mon–Sun
- X 軸顯示週一日期

## Pred 業績計算
`Σ(price[client][product] × qty)`，price 為稅前價

## 技術規格
- 單一 `index.html`（HTML + CSS + JS 內嵌）
- Apache ECharts CDN（最新穩定版 v5）
- Vanilla JS，無框架
- PWA + Service Worker（cache-first，離線顯示快取資料）
- 深色主題（CSS 變數）
- 響應式：768px breakpoint

## Global State
```javascript
const state = { dateRange: {start, end}, clients: [], products: [] }
```
- 預設近6個月
- 空陣列 = 全部
- 所有圖表點擊 → 更新 state → filterData → 重繪所有圖表

## 手機模塊（< 768px）
- KPI 卡片×3：本週收檢量 / 本月收檢量 / 本月 Pred 業績
- 週收檢長條圖（簡易）
- 月銷量堆疊長條圖
- 底部 bottom-sheet 篩選器（70% 高度，拉起把手，動畫）

## 桌機模塊（>= 768px）
- KPI 卡片×4：期間收檢 / Pred 業績 / 官方業績 / 差異%
- 週堆疊長條 + 累積折線
- 月分組長條
- 客戶水平排行
- 規格甜甜圈
- 客戶業績明細表
- 2026 Pred 業績月趨勢

## 圖表點擊行為
| 圖表 | 點擊目標 | 行為 |
|------|----------|------|
| 週長條圖 | 某週 | dateRange 設為該週 Mon–Sun |
| 月趨勢圖 | 某月 | dateRange 設為該月 |
| 客戶排行 | 某客戶 | clients toggle |
| 規格甜甜圈 | 某規格 | products toggle |

## 篩選器
- 桌機：頂部常駐篩選列（日期快速選項 + 客戶多選 chip + 產品 chip）
- 手機：底部 bottom-sheet（把手列 + 篩選摘要文字 + 展開後完整篩選器）
