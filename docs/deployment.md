# 部署與上線檢查

更新：2026-10-27。來源：使用者核准公開 repository、獨立 Firebase、共享主辦密碼及工號投票。

## 已建立的資源

- GitHub：<https://github.com/isaaceating/lumens-halloween>
- Firebase Project ID：`lumens-halloween-2026`。
- Firestore：`(default)`、`asia-east1`。一般瀏覽器不得直接讀寫資料庫。
- Functions、Storage 與 GitHub Pages 正式站尚未上線。

## 部署順序

1. 在 Firebase Console 由專案擁有者確認並連結 Blaze 計費方案。Functions 與新的 Storage bucket 需要此方案；本輪未自動升級或連結付費帳戶。
2. 在同一專案建立 Storage default bucket，名稱應為 `lumens-halloween-2026.firebasestorage.app`。選擇與活動使用者相近區域。
3. 以 Firebase CLI 設定 `ADMIN_PASSWORD_HASH` 與 `APP_SECRET`。前者是 `functions/core.cjs` 的 scrypt hash 格式，後者是隨機至少 32 bytes。不要把秘密貼進版本庫。既有本機秘密在 Git 忽略的 `private/config.json`，由維護者以暫存檔傳入 `firebase functions:secrets:set --data-file`，操作後移除暫存檔。不要將主辦密碼寫入 site-config.js。
4. `npm ci --prefix functions`，執行 `npm run check`、`npm test`。
5. `firebase deploy --only firestore:rules,storage,functions --project lumens-halloween-2026`。部署回傳的 API URL 才是權威；將 site-config.js 非本機的 apiBase 更新為已驗證的 HTTPS URL。
6. GitHub repository Settings → Pages 選 GitHub Actions，手動執行 Publish GitHub Pages。公開產物僅來自 scripts/build.cjs 的白名單；不發布 private、functions、docs 或員工檔案。
7. 從 Pages 網址登入雲端後台匯入工號快照，再上傳三位參賽者照片與文字；本機資料不會自動上傳至 Firebase。正式 API 的來源限制不包含本機網址。
8. 完整雲端投票驗收須使用隔離的測試專案與假工號，再初始化正式活動；目前固定單一活動且沒有重設入口，不可用正式活動做結束／公布測試。沒有後端設定時網頁明確顯示服務尚未開通，不得顯示模擬投票成功。

## 活動操作

- 預設台灣時間 2026/10/30 15:00，30 分鐘。開始時間與時長在活動開始前可改。
- 立即開始以伺服器時間重新起算完整時長；暫停凍結剩餘時間，恢復後順延截止。
- 結束不可重新開啟；公布為獨立動作，只有公布後公開 API 才回傳票數。
- 投票以工號資格＋原子交易控制一票，不能驗證輸入者就是該員工本人。
- 共享密碼可取得相同管理權限，不區分管理者個人。session 有效 8 小時，可登出撤銷。登入及投票設每 IP 分鐘限制，現場多人共用出口需留意負載測試。
- 限制：單一活動最多 2,000 筆資格；目前固定三位參賽者。Firestore 以單文件交易確保活動狀態與投票一致，適合本次規模，上線前須驗證同時投票負載。

官方依據：[Functions 部署](https://firebase.google.com/docs/functions/get-started)、[Storage 計費要求](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)。

## 2026-10-27 本輪部署更新

取代上方「尚未上線」現況：Blaze 已由使用者啟用並查證；Functions、Storage、秘密與規則均已部署；Pages 已啟用，發布驗證見 project-status.md。正式 API：https://asia-east1-lumens-halloween-2026.cloudfunctions.net/api 。正式名單含單筆身份欄位，已匯入私有 Firestore，沒有測試票。後台網址為 https://isaaceating.github.io/lumens-halloween/admin.html 。

測試活動採本機隔離資料夾；雲端僅執行登入、單筆查詢、照片服務與公開回應檢查，尚未在隔離 Firestore 專案測試完整投票／結束。不得將正式活動作破壞性流程驗收。後台上傳照片後必須按儲存參賽者；取消發布會停止於前台顯示，不會刪除儲存物件。

## v1.10 版本與名單操作

使用 Git tag v1.10 對應 npm/API 1.10.0；Pages 環境僅允許 main；發布前確認 main 與該 tag 相同，再從 main 發布。預設「新增／更新」可只匯入新增同仁；提供身份物件可更新姓名部門，只有工號不清空既有身份。若確定要移除檔案以外同仁才選「整份取代」，核對提醒後確認。部署只更新程式，不重匯或取代正式名單。

## v1.11 發布（2026-10-28）
本次為前端視覺更新，套件／site-config／Git tag 為 1.11.0／v1.11；API 仍為 1.10.0。僅從 main 手動觸發 Publish GitHub Pages，不部署 Firebase、不重匯名單。Footer 顯示主辦文字，前端版本可由後台標題與 site-config 辨識。發布結果以 project-status.md 為準。

## v1.12 操作更新（2026-10-28）
取代先前「沒有重設入口」：後台新增重設活動，可在測試公布後重新準備。先匯出統計，設定未來開始時間及時長，再輸入 RESET；不可復原。保留員工與照片。正式資料不可作自動驗收用途。
前端與 API 皆 1.12.0；本次需部署 functions，再從 main 觸發 Pages。部署指令不包含資料初始化、名單重匯與重設。

## v1.13 發布（2026-10-28）
前後端均 1.13.0，需先更新 Functions 的公布前姓名遮罩，再發布 Pages。不遷移或重設正式資料；姓名僅由公開 API 投影隱藏，主辦原始資料保留。
