# Issues


## v2.2.0

- 全域 client name 精簡化
	- 隱藏 - 龍群 這類的所有後綴，只顯示例如正陽骨科、得安診所

- 全域文字設定：灰色的字體全部改成較鮮艷的灰白色（接近白色，但不純白）

- nav 增加重置篩選的按鈕（樣式同 reset-bar 的按鈕）

- hero: 
	- 3 個卡片分別加入標籤 P1M 官方業績, P2M官方業績, P3M 官方業績
	- 業績達成率 > 100% 時仍然錯誤的顯示 100%

- KPI Grid
	- 4 個 card 的標籤文字統一顯示在 grid 的左上角
	- card value 統一垂直置中對齊所屬的 card
	- card value 金額顯示單位改成 k
	- card value 不要換行
	- 目標達成率卡片 小字顯示當前計算的目標金額

- 客戶排行榜
	- 移除水平與垂直滑桿
	- 縮減每個 rank-item 的高度

- 規格分佈圖
	- 嘗試改成區域圖，在 HTML 給我 preview 確認

- 客戶業績明細
	- 增加明細表內的每個 column 的篩選與排序功能
	- 永遠放在頁面最下面

- 2026 Pred 業績月趨勢 rename 業績月趨勢
	- 移動到客戶業績明細上方
	- 月目標與累積目標統一使用相同的圓點
	- 加入每月官方業績做比較

- 增加官方業績月趨勢表

- 2025 季業績目標（除3得到月目標）
1,260,000｜1,500,000｜1,620,000｜1,620,000




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
