# Brutalist Signal v2 — 全面重做實作計畫

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 dashboard-pwa 的 index.html 依 Spec v2 全面重寫，採用 Brutalist Signal 設計語言，新增自定義日期區間與目標達成率功能。

**Architecture:** Single-File PWA，所有 HTML/CSS/JS 內嵌在 index.html。CSS 變數控制主題，ECharts v5 CDN 渲染圖表，Vanilla JS 管理 state → filter → render 循環。Google Fonts CDN 載入 Archivo Black + Noto Sans TC。

**Tech Stack:** HTML5 · CSS3（clamp, grid, animation） · Vanilla JS · Apache ECharts v5 CDN · Google Fonts CDN · PWA (Service Worker)

**Spec:** `Spec.md`（v2, 2026-03-16）
**Preview 參考:** `.claude-design/previews/style-a.html`

---

## Chunk 1: 骨架與樣式基礎

### Task 1: HTML 骨架 + CSS 變數 + Google Fonts

**Files:**
- Rewrite: `index.html`（完整覆蓋）

- [ ] **Step 1: 建立 HTML 骨架**

  清空現有 index.html，寫入：
  - `<!DOCTYPE html>` + `<html lang="zh-Hant">`
  - `<head>`：meta charset, viewport, theme-color, apple-mobile-web-app-capable, title
  - Google Fonts `<link>`：Archivo Black + Noto Sans TC (300;400;500;700;900)
  - ECharts CDN `<script>`
  - `<style>` 開頭（下一步填入）
  - `<body>` 留空結構註解

- [ ] **Step 2: 寫入 CSS 變數與 reset**

  ```css
  :root {
    --bg: #0a0a0a;
    --bg-card: #141414;
    --bg-elevated: #1a1a1a;
    --bg-input: #1e1e1e;
    --signal: #FF5722;
    --cyan: #00E5FF;
    --green: #76FF03;
    --amber: #FFD600;
    --text: #f0f0f0;
    --text-dim: #666;
    --text-muted: #444;
    --border: #222;
    --radius: 4px;
    --shadow: 0 4px 12px rgba(0,0,0,.4);
    /* Editorial Type Scale */
    --hero: clamp(4rem, 10vw, 9rem);
    --h1: clamp(2rem, 5vw, 4rem);
    --h2: clamp(1.4rem, 3vw, 2.2rem);
    --h3: clamp(1rem, 2vw, 1.4rem);
    --body: clamp(0.85rem, 1.4vw, 1.1rem);
    --caption: clamp(0.7rem, 1vw, 0.85rem);
    --micro: clamp(0.6rem, 0.8vw, 0.75rem);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Noto Sans TC', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }
  ```

- [ ] **Step 3: 寫入入場動畫 CSS**

  ```css
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    animation: fadeUp 0.7s ease-out forwards;
  }
  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal:nth-child(1) { animation-delay: 0s; }
  .reveal:nth-child(2) { animation-delay: 0.1s; }
  .reveal:nth-child(3) { animation-delay: 0.2s; }
  .reveal:nth-child(4) { animation-delay: 0.3s; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.2s !important;
    }
  }
  ```

- [ ] **Step 4: 用瀏覽器確認**

  Run: `open /Users/yezuhao/Projects/dashboard-pwa/index.html`
  Expected: 黑底頁面，無內容，無 console error

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): HTML 骨架 + Brutalist Signal CSS 變數 + Google Fonts"
  ```

---

### Task 2: Nav（sticky 頂部 + pills + 自定義日期區間）

**Files:**
- Modify: `index.html`（`<style>` 區塊 + `<body>` 區塊）

- [ ] **Step 1: 寫入 Nav CSS**

  包含：
  - `.nav`：sticky top, flex, backdrop-filter blur, border-bottom
  - `.nav-title`：Archivo Black, signal orange, var(--h3)
  - `.nav-meta`：caption size, text-dim
  - `.nav-controls`：flex, gap, align-items center
  - `.pill`：border-radius 100px, caption size, border, hover/active 切 signal
  - `.date-range`：flex, gap, date input 樣式（dark 底 + border）
  - 桌機：`.nav-controls` 顯示
  - 手機：`.nav-controls` 隱藏

- [ ] **Step 2: 寫入 Nav HTML**

  ```html
  <nav class="nav">
    <div>
      <div class="nav-title">北3區 DASHBOARD</div>
      <div class="nav-meta" id="updatedAt"></div>
    </div>
    <div class="nav-controls">
      <div class="nav-pills" id="quickBtns">
        <button class="pill" data-range="1m">1M</button>
        <button class="pill" data-range="3m">3M</button>
        <button class="pill active" data-range="6m">6M</button>
        <button class="pill" data-range="ytd">YTD</button>
      </div>
      <div class="date-range">
        <input type="date" id="dateStart">
        <span style="color:var(--text-muted)">~</span>
        <input type="date" id="dateEnd">
      </div>
    </div>
  </nav>
  ```

- [ ] **Step 3: 確認瀏覽器渲染**

  Expected: 黑底 sticky nav, signal orange 標題, pills 可 hover, date input 可見

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Nav — sticky bar, pills, custom date range inputs"
  ```

---

### Task 3: Hero Zone（大數字 + progress ring）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 寫入 Hero CSS**

  包含：
  - `.hero`：padding, grid 2 欄（auto 1fr），border-bottom
  - `.hero-number`：Archivo Black, var(--hero), line-height 0.9, letter-spacing -0.04em
  - `.hero-unit`：var(--h2), text-dim
  - `.hero-label`：caption, text-muted, uppercase, letter-spacing 0.15em
  - `.progress-ring`：SVG-based 圓環，CSS animation
  - `.progress-ring-value`：Archivo Black, var(--h1), 置中文字

- [ ] **Step 2: 寫入 Hero HTML**

  ```html
  <section class="hero">
    <div class="hero-main reveal">
      <div class="hero-label">期間收檢量</div>
      <div style="display:flex;align-items:baseline;gap:12px;">
        <div class="hero-number" id="heroNumber">—</div>
        <div class="hero-unit">瓶</div>
      </div>
    </div>
    <div class="hero-ring reveal" id="heroRing">
      <!-- JS 動態插入 SVG progress ring -->
    </div>
  </section>
  ```

- [ ] **Step 3: 確認瀏覽器渲染**

  Expected: hero 區域顯示「—」大數字佔位 + ring 佔位，字體為 Archivo Black

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Hero zone — editorial big number + progress ring placeholder"
  ```

---

### Task 4: KPI Row（4 張卡片）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 寫入 KPI CSS**

  包含：
  - `.kpi-row`：grid 4 欄, gap
  - `.kpi-card`：padding, border-radius 4px, bg-card, border
  - `.kpi-card.signal`：bg signal, color #000
  - `.kpi-card-value`：Archivo Black, var(--h1), line-height 1
  - `.kpi-card-label`：caption, uppercase, letter-spacing
  - `.kpi-card-delta`：absolute top-right, caption, green bg pill
  - `.kpi-card-progress`：progress bar（高 4px，bg-elevated 底，signal 填充）
  - 手機：grid 改 1 欄

- [ ] **Step 2: 寫入 KPI HTML**

  ```html
  <div class="kpi-row" id="kpiGrid">
    <!-- JS 動態填入 -->
  </div>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): KPI row — 4 cards with signal accent + progress bar"
  ```

---

### Task 5: 手機篩選器（bottom-sheet）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 寫入 mobile filter CSS**

  包含：
  - `.mobile-filter-trigger`：手機可見, flex, bg-elevated, border-bottom
  - `.bottom-sheet-overlay`：fixed, rgba 黑底, z-index
  - `.bottom-sheet`：fixed bottom, bg-elevated, border-radius 16px top, translateY(100%) → show:translateY(0), 70vh max-height
  - `.bottom-sheet .handle`：居中把手
  - `.bottom-sheet .sheet-body`：padding, filter-section 分組
  - `.chip`：border-radius 20px, border, active state 切 signal
  - 桌機：trigger + sheet 隱藏

- [ ] **Step 2: 寫入 mobile filter HTML**

  觸發列 + overlay + bottom-sheet（期間 pills + 日期區間 + 客戶 chip + 產品 chip + 套用按鈕）

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Mobile bottom-sheet filter with chips and date range"
  ```

---

## Chunk 2: 圖表區域

### Task 6: 主圖表區（週趨勢 + 客戶排行）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 寫入圖表容器 CSS**

  包含：
  - `.charts-section`：grid 2fr 1fr, gap, padding
  - `.chart-block`：bg-card, border, border-radius 4px, padding
  - `.chart-block-header`：flex between, title + subtitle
  - `.chart-block-title`：var(--h3), font-weight 700
  - `.chart-area`：width 100%, height clamp(200px, 30vw, 380px)
  - `.rank-list`：flex column, gap
  - `.rank-item`：flex, bg-elevated, border-left 3px signal, hover translateX(4px)
  - `.rank-pos`：Archivo Black, var(--h2), text-muted
  - `.rank-value`：Archivo Black, var(--h3), signal color

- [ ] **Step 2: 寫入 HTML 容器**

  ```html
  <section class="charts-section">
    <div class="chart-block reveal">
      <div class="chart-block-header">
        <div>
          <div class="chart-block-title">週收檢趨勢</div>
          <div class="chart-block-subtitle">堆疊長條 + 累積折線</div>
        </div>
      </div>
      <div class="chart-area" id="chartWeekly"></div>
    </div>
    <div class="chart-block reveal">
      <div class="chart-block-header">
        <div class="chart-block-title">客戶排行</div>
      </div>
      <div id="clientRankList"></div>
    </div>
  </section>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Main chart section — weekly trend + client rank containers"
  ```

---

### Task 7: 次圖表區（月趨勢 + 甜甜圈）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 寫入 HTML 容器**

  ```html
  <section class="bottom-grid">
    <div class="chart-block reveal">
      <div class="chart-block-header">
        <div>
          <div class="chart-block-title">月銷量趨勢</div>
          <div class="chart-block-subtitle">依規格分組</div>
        </div>
      </div>
      <div class="chart-area" id="chartMonthly"></div>
    </div>
    <div class="chart-block reveal">
      <div class="chart-block-header">
        <div>
          <div class="chart-block-title">規格分佈</div>
          <div class="chart-block-subtitle">佔比 %</div>
        </div>
      </div>
      <div class="chart-area" id="chartProduct"></div>
    </div>
  </section>
  ```

- [ ] **Step 2: 寫入 `.bottom-grid` CSS**

  grid 2 欄, gap, padding，手機改 1 欄

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Secondary chart section — monthly trend + product donut containers"
  ```

---

### Task 8: 全寬區域（明細表 + 年度趨勢）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 寫入 HTML 容器**

  ```html
  <section class="full-width-section">
    <div class="chart-block reveal">
      <div class="chart-block-header">
        <div class="chart-block-title">客戶業績明細</div>
      </div>
      <div class="table-wrap" id="tableWrap"></div>
    </div>
  </section>
  <section class="full-width-section">
    <div class="chart-block reveal">
      <div class="chart-block-header">
        <div>
          <div class="chart-block-title">2026 Pred 業績月趨勢</div>
          <div class="chart-block-subtitle">月 Pred + 累積 + 目標線</div>
        </div>
      </div>
      <div class="chart-area chart-area-tall" id="chartYearPred"></div>
    </div>
  </section>
  ```

- [ ] **Step 2: 寫入表格 + full-width CSS**

  包含：
  - `.full-width-section`：padding horizontal 同 charts-section
  - `.table-wrap`：overflow-x auto
  - `.data-table`：border-collapse, dark 樣式, hover highlight
  - `.chart-area-tall`：height clamp(250px, 35vw, 450px)

- [ ] **Step 3: 確認所有 HTML 容器完成**

  Run: `open index.html`
  Expected: 完整佈局骨架可見（Nav + Hero + KPI + 4 圖表區 + 表格 + 年度圖），內容為空佔位

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Full-width sections — detail table + yearly trend containers"
  ```

---

## Chunk 3: JavaScript 邏輯

### Task 9: 常數 + Mock Data + Helpers

**Files:**
- Modify: `index.html`（`<script>` 區塊）

- [ ] **Step 1: 寫入常數與配色**

  ```javascript
  const ENDPOINT = 'YOUR_APPS_SCRIPT_URL';
  const PRODUCTS = ['06瓶', '10瓶', '20瓶', 'PLTgel'];
  const COLORS = { '06瓶': '#00E5FF', '10瓶': '#76FF03', '20瓶': '#FFD600', 'PLTgel': '#FF5722' };
  const MOCK_TARGET = { monthly: 300000, yearly: 3600000 };
  ```

- [ ] **Step 2: 寫入 generateMockData()**

  沿用 v1 邏輯，新增 `target` 欄位回傳 MOCK_TARGET

- [ ] **Step 3: 寫入 helper functions**

  - `getAccountingMonth(adjDate)` — 月份認列
  - `getISOWeekMonday(dateStr)` — ISO 週一
  - `fmtDate(d)`, `fmtNum(n)`, `fmtMoney(n)`
  - `filterData(raw, state)` — 篩選 history
  - `filterFinance(raw, state)` — 篩選 finance
  - `buildPriceMap(priceArr)` — 價格查詢表
  - `calcPredRevenue(records, priceMap)` — Pred 業績

- [ ] **Step 4: 寫入 Global State**

  ```javascript
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const state = {
    dateRange: { start: fmtDate(sixMonthsAgo), end: fmtDate(today) },
    clients: [],
    products: []
  };
  let rawData = null;
  let allClients = [];
  let charts = {};
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): JS constants, mock data, helpers, global state"
  ```

---

### Task 10: 篩選器邏輯（pills + 日期 + chips + bottom-sheet）

**Files:**
- Modify: `index.html`（`<script>` 區塊）

- [ ] **Step 1: 寫入 initFilters()**

  - 從 rawData 取出 allClients
  - 呼叫 renderChips() 建立桌機 + 手機 chip
  - 綁定 dateStart / dateEnd change → 更新 state + 取消 pill active + render()
  - 呼叫 setupQuickBtns() 綁定 pills
  - 綁定 mobile bottom-sheet 開關邏輯

- [ ] **Step 2: 寫入 renderChips() + syncChips()**

  桌機/手機 chip 雙向同步，click toggle state[field]

- [ ] **Step 3: 寫入 setupQuickBtns()**

  pill click → 計算 start/end → 填入 date input → state.dateRange → render()
  date input change → 清除所有 pill active

- [ ] **Step 4: 寫入 updateFilterSummary()**

  更新手機篩選摘要文字

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Filter logic — pills ↔ date range sync, chips, bottom-sheet"
  ```

---

### Task 11: Hero + KPI 渲染

**Files:**
- Modify: `index.html`（`<script>` 區塊）

- [ ] **Step 1: 寫入 renderHero(filtered)**

  - 計算期間總收檢量 → 填入 #heroNumber
  - 計算 Pred 業績 vs target 達成率
  - 動態生成 SVG progress ring → 插入 #heroRing
  - Ring 中央文字：達成率 %

- [ ] **Step 2: 寫入 renderKPI(filtered)**

  桌機 4 卡 / 手機 3 卡，innerHTML 動態生成
  - Pred 業績（signal 底）
  - 官方業績（dark 底 + delta badge）
  - 差異%（dark 底）
  - 目標達成率（dark 底 + progress bar）— 桌機 only

- [ ] **Step 3: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Hero big number + progress ring + KPI cards rendering"
  ```

---

### Task 12: 圖表初始化 + 週/月/甜甜圈渲染

**Files:**
- Modify: `index.html`（`<script>` 區塊）

- [ ] **Step 1: 寫入 initCharts()**

  - echarts.init 所有圖表容器（dark theme 設 transparent bg）
  - ResizeObserver 自動 resize
  - 綁定 click handlers（週→dateRange, 月→dateRange, 客戶→toggle, 產品→toggle）

- [ ] **Step 2: 寫入 renderWeeklyChart(filtered)**

  桌機：堆疊長條 + 累積折線（雙 Y 軸）
  手機：簡易單色長條
  配色用 v2 COLORS

- [ ] **Step 3: 寫入 renderMonthlyChart(filtered)**

  桌機：分組長條（4 產品並排）
  手機：堆疊長條

- [ ] **Step 4: 寫入 renderProductDonut(filtered)**

  甜甜圈，label 顯示 name + %

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): ECharts init + weekly/monthly/donut rendering with v2 colors"
  ```

---

### Task 13: 客戶排行（卡片列表）+ 明細表 + 年度趨勢

**Files:**
- Modify: `index.html`（`<script>` 區塊）

- [ ] **Step 1: 寫入 renderClientRank(filtered)**

  不用 ECharts，改用 HTML 卡片列表：
  - 排序 by qty desc，取 top N
  - 每項：rank-pos（01-05）+ rank-name + rank-sub（瓶數）+ rank-value（Pred 金額）
  - border-left signal color

- [ ] **Step 2: 寫入 renderTable(filtered)**

  生成 `<table class="data-table">` HTML
  欄位：客戶 | 06瓶 | 10瓶 | 20瓶 | PLTgel | 總量 | Pred | 官方 | 差異%

- [ ] **Step 3: 寫入 renderYearPred()**

  2026 月度 bar + 累積 line + 目標虛線（markLine）
  月目標 = MOCK_TARGET.monthly，年目標線 = 累積對應

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): Client rank cards + detail table + yearly trend with target line"
  ```

---

### Task 14: render() 主函式 + loadData() + SW 註冊

**Files:**
- Modify: `index.html`（`<script>` 區塊）

- [ ] **Step 1: 寫入 render()**

  ```javascript
  function render() {
    if (!rawData) return;
    const filtered = filterData(rawData, state);
    updateFilterSummary();
    renderHero(filtered);
    renderKPI(filtered);
    renderWeeklyChart(filtered);
    renderMonthlyChart(filtered);
    renderProductDonut(filtered);
    renderClientRank(filtered);
    renderTable(filtered);
    renderYearPred();
  }
  ```

- [ ] **Step 2: 寫入 loadData()**

  fetch ENDPOINT → fallback to generateMockData()
  更新 #updatedAt
  呼叫 initFilters() + initCharts() + render()

- [ ] **Step 3: 寫入 resize handler + SW 註冊 + 啟動**

  ```javascript
  window.addEventListener('resize', () => {
    Object.values(charts).forEach(c => c && c.resize());
    render();
  });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW:', err));
  }
  loadData();
  ```

- [ ] **Step 4: 完整測試**

  Run: `open index.html`
  Expected: 所有模組渲染正常，pills 切換更新圖表，date input 連動，chart click 篩選，手機 bottom-sheet 正常

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat(v2): render() main loop, loadData(), SW registration — v2 complete"
  ```

---

## Chunk 4: 收尾

### Task 15: SW cache bump + manifest 更新

**Files:**
- Modify: `sw.js`
- Modify: `manifest.json`

- [ ] **Step 1: sw.js cache 版本 bump**

  `dashboard-pwa-v1` → `dashboard-pwa-v2`
  新增 Google Fonts URL 到 cache list

- [ ] **Step 2: manifest.json 確認**

  theme_color / background_color 改為 #0a0a0a

- [ ] **Step 3: Commit**

  ```bash
  git add sw.js manifest.json
  git commit -m "chore(v2): bump SW cache to v2, update manifest theme color"
  ```

---

### Task 16: 視覺微調 + 瀏覽器驗證

**Files:**
- Modify: `index.html`（CSS 微調）

- [ ] **Step 1: 桌機瀏覽器驗證**

  Run: `python3 -m http.server 8000`（在專案目錄）
  Open: `http://localhost:8000`
  檢查：
  - [ ] Nav sticky 正常
  - [ ] Hero 大數字 Archivo Black 載入
  - [ ] Progress ring 動畫
  - [ ] KPI 卡片 signal 底色
  - [ ] 圖表全部渲染
  - [ ] 排行卡片列表樣式
  - [ ] 表格 hover
  - [ ] 年度趨勢目標虛線
  - [ ] Pills ↔ date input 連動
  - [ ] Chart click 篩選

- [ ] **Step 2: 手機模擬驗證**

  Chrome DevTools → 375px width
  檢查：
  - [ ] Hero 數字仍大
  - [ ] KPI 3 卡
  - [ ] 單欄圖表
  - [ ] Bottom sheet 開關
  - [ ] 篩選摘要文字更新

- [ ] **Step 3: 修正發現的問題**

  記錄並修正所有視覺/功能問題

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "fix(v2): visual polish after browser verification"
  ```

---

### Task 17: 清理 + 推送

- [ ] **Step 1: 清理 preview 檔案**

  ```bash
  rm -rf .claude-design/
  ```

- [ ] **Step 2: 更新 Log.md**

  新增 v2 實作完成記錄

- [ ] **Step 3: Final commit + push**

  ```bash
  git add -A
  git commit -m "feat(v2): Brutalist Signal dashboard — complete rewrite"
  git push
  ```
