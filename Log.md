# 開發日誌

## 2026-03-07
- 建立專案目錄與 git 初始化
- 建立 PWA manifest.json（深色主題、zh-Hant）
- 建立 sw.js（cache-first 策略、舊版快取清除）
- 建立 index.html 完整實作：
  - 深色主題 CSS 變數與響應式佈局
  - 手機 bottom-sheet 篩選器（70% 高度、滑入動畫、拉起把手）
  - 桌機頂部常駐篩選列（日期快速選項、客戶/產品 chip）
  - Mock data（6個月、5個客戶、4種產品）
  - JS helper：getAccountingMonth、getISOWeekMonday、filterData
  - globalState 與 render() 方法
  - ECharts 圖表：週收檢趨勢、月銷量趨勢、客戶排行、規格甜甜圈、客戶業績表、2026 Pred 業績
  - 所有圖表 click handler（更新 state → 重繪）
  - ResizeObserver 自動調整圖表大小
  - Service Worker 註冊
- 建立 Spec.md 規格文件
- 建立 Log.md 開發日誌
- 初始 git commit
- 推送至 GitHub 並啟用 GitHub Pages

## 2026-03-16
- **v2 全面重做決策**：原版視覺不符合 Editorial Type Scale 設計規範
- 產出 4 個風格 preview（Brutalist Signal / Warm Botanical / Swiss Precision / Midnight Glass）
- 選定 **Style A — Brutalist Signal**：極深黑底 + 螢光橙 signal + Archivo Black 超大數字
- 更新 Spec.md 至 v2：
  - 設計語言：Brutalist Signal（配色、字體、CSS 規範）
  - 新增：自定義日期區間 filter（date input start~end，與 pills 連動）
  - 新增：業績 vs 目標的進度 ring + 達成率 KPI
  - 佈局重構：Hero 大數字區 + KPI Row + 2 欄圖表 + 全寬表格/趨勢
  - 字體改用 Google Fonts（Archivo Black + Noto Sans TC）
  - 產品色系更新（Cyan / Lime / Amber / Signal Orange）
- 更新 CLAUDE.md 反映 v2 架構
- Preview 檔案存於 .claude-design/previews/
- **v2 index.html 全面重寫完成**（1335 行）：
  - Brutalist Signal 設計語言：#0a0a0a 極深黑 + #FF5722 signal orange
  - Google Fonts：Archivo Black (display) + Noto Sans TC (body)
  - Editorial Type Scale：hero 4-9rem / h1 2-4rem / body 0.85-1.1rem，全部 clamp()
  - 新 Nav：sticky + pills + 自定義日期區間 date input，pills ↔ date 雙向連動
  - Hero Zone：大數字收檢量 + SVG progress ring（Pred vs 目標達成率）
  - KPI Row：4 卡（Pred/官方/差異%/達成率 with progress bar），手機 3 卡
  - 客戶排行改為卡片列表風格（排名數字 + border-left signal）
  - 新產品色系：Cyan/Lime/Amber/Signal Orange
  - 年度趨勢圖新增目標虛線
  - 入場動畫 fadeUp staggered + prefers-reduced-motion
  - SW cache bump v2 + manifest theme color 更新
  - .gitignore 加入 .claude-design/
