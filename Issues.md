# Issues


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
