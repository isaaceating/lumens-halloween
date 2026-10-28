# Lumens Halloween · v1.18

Whimsical Halloween 變裝展示與公司工號投票網站。靜態前端搭配 Firebase 後端；正式功能已接上 Firebase，GitHub Pages 已上線。

## 目前狀態

- 本機路徑：D:/Codex-Projects/lumens-halloween；Local checkout。
- GitHub：https://github.com/isaaceating/lumens-halloween
- Firebase Project ID：lumens-halloween-2026；Firestore 位於 asia-east1。
- 已實作主辦密碼登入、三位參賽者編輯與影音上傳、工號資格核對、一人一票、暫停凍結倒數、手動結束與公布結果。
- Functions／Storage 已部署並驗證；GitHub Pages 正式網址：https://isaaceating.github.io/lumens-halloween/ 。發布狀態以 docs/project-status.md 為準。

## 本機開發

需要 Node.js 22 或更新版本。正式 Firebase Functions runtime 為 Node.js 22。

先執行 `npm ci --prefix functions` 安裝後端與影片轉檔工具。

1. 新 checkout 執行 npm run setup-local 建立本機主辦密碼設定（輸入可見）；本專案目前已設定，請勿覆寫。
2. 員工名單僅保存在 Git 忽略的 private/employee-import.json，格式可為工號字串陣列；身份顯示需要 private/employee-profiles.json 的 id、department、name 物件陣列，可在後台匯入。
3. npm run dev 啟動 http://127.0.0.1:4173；後台為 /admin.html。
4. npm run check 檢查語法；npm test 驗證活動規則與權限；npm run build 產生 dist 公開前端。
5. 視覺示意模式可加 ?demo=1，與正式資料模式區分；不會寫入正式投票。

本機狀態與照片保存在 private/，重新啟動仍保留。它們不會自動上傳至 Firebase。不可把 private/、密碼、秘密金鑰或員工名單提交至 Git。

版本標記：Git tag `v1.18`，前端 `1.18.0`、相容 API `1.14.0`；發布紀錄見 [CHANGELOG](CHANGELOG.md)。

## 功能規則

- 預設 2026/10/30 15:00（台灣時間），30 分鐘，截止自動計算。
- 主辦可提前開始、暫停、恢復及結束；暫停會凍結剩餘時間。
- 工號資格核對，不加額外投票碼；每工號最多一票，不能改票。工號本身無法證明投票者本人。
- 每位支援 1 支影片（60 秒／200 MB 內）與 2 張照片，影片預設為封面；既有純照片最多 3 張會保留。後台轉成 H.264/AAC MP4 並產生封面，也可手動更換封面。
- 輸入工號後由後端帶出該筆部門與中文姓名，確認本人後投票；不提供名單列表。
- 公布前以變裝名稱及介紹展示，選手姓名在公布結果後顯示；主辦後台仍可管理完整姓名。
- 參賽照片發布後公開瀏覽；未發布的照片與文字僅主辦可見。
- 票數在後端保密，截止後也不自動公布；由主辦按公布結果。
- 資格名單預設新增／更新，保留未出現在檔案中的同仁；整份取代需確認提醒。
- 測試後可 RESET：清除票數與公布狀態，保留名單、參賽者與照片；需輸入 RESET 並設定未來開始時間。
- 同分頁喚醒一次後保留投票內容；演出 10.45 秒加 1 秒淡出。
- 主辦共享密碼採伺服器驗證，session 最長 8 小時。

## 程式與素材

index.html 保留古堡視覺，live.js 接上活動 API；admin.html 是主辦後台。functions/ 為 Firebase 後端及共用規則，scripts/server.cjs 為持久化本機開發伺服器。靜態建置使用公開檔案白名單，不會整個目錄上傳。

assets/ 包含使用者提供的原始 Lumens Logo，以及以它和古堡風格生成的插畫；CSS/SVG 負責角色動畫。Google Fonts 有系統字型備援。

## 文件

- [協作規則](AGENTS.md)
- [文件索引](docs/README.md)
- [功能與驗收](docs/features.md)
- [架構](docs/architecture.md)
- [決策](docs/decisions.md)
- [現況](docs/project-status.md)
- [部署與活動操作](docs/deployment.md)
- [交接](docs/handoffs/README.md)
