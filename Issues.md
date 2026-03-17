# Issues


## v2.4.0 — 已修復（2026-03-18）

- [x] 業績月趨勢 & 官方業績月趨勢跟隨全域日期區間篩選（原本硬編碼 2026 / 全年不篩選）
- [x] 新增 `monthsInRange()` 工具函數
- [x] 兩張圖同步套用 clients / products 篩選


## v2.3.0 — 已修復（2026-03-17）

- [x] 全域 client name 精簡化（隱藏「- 龍群」等後綴）
- [x] 全域灰色字體改為較鮮艷的灰白色
- [x] nav 增加重置篩選按鈕
- [x] hero 3 卡片加入 P1M/P2M/P3M 官方業績標籤
- [x] hero 業績達成率 > 100% 顯示修正
- [x] KPI Grid 標籤左上角、value 置中、金額 k 單位、不換行、目標金額小字
- [x] 客戶排行榜移除滑桿、縮減高度
- [x] 業績月趨勢（原 2026 Pred）rename + 移至明細上方 + 加入官方業績比較
- [x] 新增官方業績月趨勢表
- [x] 客戶業績明細增加欄位篩選與排序、永遠置底
- [x] 2025 季業績目標常數


## v2.2.0 — 已修復（2026-03-17）

- [x] nav 改為下拉選單（期間 + 年度/季度）+ dateEnd 自動校正
- [x] hero 新增最近三個月官方業績圓圈圖
- [x] KPI 官方業績 card 顯示 cutoff date
- [x] KPI PRED VS 官方 → 改為「本月收檢」
- [x] 週收檢 & 月銷量移除底部 dataZoom 滑桿、修正日期標籤被切
- [x] 客戶業績明細新增「客單價」欄




## v2.1.0 — 已修復（2026-03-17）

- [x] nav-controls：1M/3M/6M/YTD → 下拉選單 + 年度/季度選單 + dateEnd 自動校正
- [x] hero：新增最近三個月官方業績圓圈圖（N-2, N-1, dateEnd 月）
- [x] KPI - 官方業績 card：顯示資料 cutoff date
- [x] KPI - PRED VS 官方 card → 改為「本月收檢」（消除重複的 vs%）
- [x] 週收檢趨勢 & 月銷量趨勢：移除底部 dataZoom 滑桿，修正日期標籤被切
- [x] 客戶業績明細表：新增「客單價」欄（= 官方業績 / 收檢量）



## 2026-03-17 v2 Review — 已修復

- [x] 1. YTD 篩選日期 timezone bug — `fmtDate()` 改用台北本地時間，不走 `toISOString()` UTC
- [x] 2. 頁面篩選改月份制 — `<input type="month">`，state 存 YYYY-MM，filterData/filterFinance 比對月份
- [x] 3. 週收檢 X 軸改用 ReportDate（不算 Monday）
- [x] 4. 週收檢顯示資料標籤
- [x] 5. 週收檢水平滑動 dataZoom（預設 6 週）
- [x] 6. 客戶排行金額改用財務實際業績（非 Pred）
- [x] 7. 客戶排行限高 + overflow-y scroll
- [x] 8. 月銷量移除 double getAccountingMonth — AdjDate 已調整，直接取月份
- [x] 9. 月銷量水平滑動 dataZoom（預設 3 月）+ 資料標籤
- [x] 10. 規格甜甜圈新增右上角圖例，顯示各產品數量合計
- [x] 11. 客戶業績明細表字體 +20%
- [x] 12. 客戶業績明細表 差異% → 佔比%
