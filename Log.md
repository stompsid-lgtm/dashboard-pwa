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
