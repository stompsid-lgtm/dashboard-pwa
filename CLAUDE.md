# dashboard-pwa | lang:zh-TW | for-AI-parsing | optimize=compliance

<meta>
repo: stompsid-lgtm/dashboard-pwa（private）
purpose: 北3區業績 Dashboard PWA — 週/月收檢量、Pred 業績（price × qty）vs 官方業績
tech: Single-File PWA | Vanilla JS | Apache ECharts v5 CDN | 無框架無後端
design: Brutalist Signal（v2, 2026-03-16 定案）
initial: 2026-03-07
</meta>

<conn label="精確保留 | 禁壓縮">

DIRECTORY:
  ```
  dashboard-pwa/
  ├── index.html      # 主應用（HTML + CSS + JS 內嵌）
  ├── manifest.json   # PWA Manifest（standalone）
  ├── sw.js           # Service Worker（cache-first）
  ├── Spec.md         # 規格文件（v2）
  └── Log.md          # 開發日誌
  ```

TECH-STACK:
  framework: 無（Vanilla JS）
  charts: Apache ECharts v5（CDN）
  pwa: Manifest + Service Worker（cache-first）
  font: Archivo Black + Noto Sans TC（Google Fonts CDN）
  data-source: Apps Script Web App JSON（ENDPOINT 常數，目前為 placeholder）

DESIGN-SYSTEM:
  style: Brutalist Signal
  bg: #0a0a0a（極深黑）
  signal: #FF5722（螢光橙）
  display-font: Archivo Black（900）
  body-font: Noto Sans TC（300–900）
  type-scale: Editorial（hero 4–9rem, body 0.85–1.1rem, 落差 ≥6x）
  css-rule: 所有 font-size 用 clamp()

PRODUCT-COLORS:
  06瓶=#00E5FF（Cyan）| 10瓶=#76FF03（Lime）| 20瓶=#FFD600（Amber）| PLTgel=#FF5722（Signal）

DATA-SCHEMA:
  history[]: ReportDate | AdjDate | Client | Product | Qty
  finance[]: 日期 | 客戶 | 業績
  price[]: 客戶 | 06瓶 | 10瓶 | 20瓶 | PLTgel
  target: 業績目標（月/年，mock 先用常數）
  updatedAt: ISO timestamp

MONTH-RULE:
  AdjDate >= 16 日 → 算下個月
  AdjDate < 16 日 → 算當月

GLOBAL-STATE:
  dateRange: { start, end }（預設近 6 個月）
  clients: []（空 = 全部）
  products: []（空 = 全部）

</conn>

<debt>
endpoint: ENDPOINT = 'YOUR_APPS_SCRIPT_URL'（需建立 Apps Script Web App 並填入）
echarts-cdn: 離線時圖表無法渲染
sw-version: cache 版本 dashboard-pwa-v1，更新需 bump
target-source: 目標值目前為 mock 常數，待接 data source
</debt>

<ref label="on-demand | Read when needed">

Spec.md → 規格文件 v2（Brutalist Signal 設計語言 + 完整佈局定義）
Log.md → 開發日誌

COMMANDS:
  open index.html
  python3 -m http.server 8000  # 推薦，避免 SW 路徑問題

NEXT-STEPS:
  1. 依 Spec v2 全面重做 index.html（Brutalist Signal）
  2. 建立 Google Sheets + Apps Script Web App，輸出 JSON
  3. index.html 中 ENDPOINT 改為真實 URL
  4. 決定部署方式（GitHub Pages 或其他）

</ref>
