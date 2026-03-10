# dashboard-pwa | lang:zh-TW | for-AI-parsing | optimize=compliance

<meta>
repo: stompsid-lgtm/dashboard-pwa（private）
purpose: 北3區業績 Dashboard PWA — 週/月收檢量、Pred 業績（price × qty）vs 官方業績
tech: Single-File PWA | Vanilla JS | Apache ECharts v5 CDN | 無框架無後端
initial: 2026-03-07
</meta>

<conn label="精確保留 | 禁壓縮">

DIRECTORY:
  ```
  dashboard-pwa/
  ├── index.html      # 主應用（HTML + CSS + JS 內嵌，約 1039 行）
  ├── manifest.json   # PWA Manifest（standalone）
  ├── sw.js           # Service Worker（cache-first）
  ├── Spec.md         # 規格文件
  └── Log.md          # 開發日誌
  ```

TECH-STACK:
  framework: 無（Vanilla JS）
  charts: Apache ECharts v5（CDN）
  pwa: Manifest + Service Worker（cache-first）
  font: CSS 系統字型（無外部依賴）
  data-source: Apps Script Web App JSON（ENDPOINT 常數，目前為 placeholder）

DATA-SCHEMA:
  history[]: ReportDate | AdjDate | Client | Product | Qty
  finance[]: 日期 | 客戶 | 業績
  price[]: 客戶 | 06瓶 | 10瓶 | 20瓶 | PLTgel
  updatedAt: ISO timestamp

MONTH-RULE:
  AdjDate >= 16 日 → 算下個月
  AdjDate < 16 日 → 算當月

GLOBAL-STATE:
  dateRange: { start, end }（預設近 6 個月）
  clients: []（空 = 全部）
  products: []（空 = 全部）

PRODUCT-COLORS:
  06瓶=#4fc3f7（淺藍）| 10瓶=#81c784（綠）| 20瓶=#ffb74d（橙）| PLTgel=#e57373（紅）

</conn>

<debt>
endpoint: ENDPOINT = 'YOUR_APPS_SCRIPT_URL'（需建立 Apps Script Web App 並填入）
echarts-cdn: 離線時圖表無法渲染
sw-version: cache 版本 dashboard-pwa-v1，更新需 bump
</debt>

<ref label="on-demand | Read when needed">

Spec.md → 規格文件
Log.md → 開發日誌

COMMANDS:
  open index.html
  python3 -m http.server 8000  # 推薦，避免 SW 路徑問題

NEXT-STEPS:
  1. 建立 Google Sheets + Apps Script Web App，輸出 JSON
  2. index.html 中 ENDPOINT 改為真實 URL
  3. 決定部署方式（GitHub Pages 或其他）

</ref>
