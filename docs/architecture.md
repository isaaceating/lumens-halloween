# Architecture

更新：2026-10-27。來源：使用者本次初始化要求。

## 已確認

- 產品範圍：Lumens Halloween Cos 比賽網站。
- 本機專案根目錄：`D:\Codex-Projects\lumens-halloween`。
- 以 Git 管理，使用 Local checkout；已實作靜態視覺 demo，沒有部署環境或正式資料服務。

## 目前基線（2026-10-27）

- 使用者暫定 GitHub Pages + Firebase；工號投票、不加投票碼。下方比較為選型過程。
- Demo 入口：index.html、styles.css、app.js；V2 由 magic.css、magic.js 增強，結合本機古堡插畫、SVG 角色、CSS 動畫、滑鼠／捲動視差及 Canvas 星塵。
- 無前端框架或建置依賴；scripts/preview.cjs 提供只綁定 loopback、只允許明列的網站檔案及兩張 PNG 素材的本機預覽。
- 投票狀態僅記憶體，不保存工號；本機照片以 object URL 預覽，無對外上傳。正式 Firebase、管理員權限、投票 API 均未實作。
- 粒子上限 160、畫布像素倍率上限 2；頁籤隱藏或暫停時停止粒子迴圈，支援減少動態效果。
- Logo 原檔保留於 assets 並呈現在頁首；主視覺以使用者 Logo 為參考生成。
- 字型使用 Google Fonts 並有系統備援；圖片與插畫不依賴外部素材服務。

## 待確認

- 前端、後端、資料庫、身份驗證與部署平台。
- 活動參與對象、角色權限、資料保存及照片使用方式。
- 已確認排除報名系統，由主辦人上傳照片，公司同仁一人一票，隱藏票數並由主辦人在截止後公布；身份識別與公布管道待確認。
- 資料流及外部整合：需求確認後再設計。

需求見 [Features](features.md)，已確認的工作方式見 [Decisions](decisions.md)。

## 初始技術提案（2026-10-27，歷史提案，已由下方比較取代）

- Next.js App Router + TypeScript：同一專案承載活動頁、主辦後台與伺服器端操作。
- CSS + Motion for React：分層插畫、漂浮與互動動畫，尊重減少動態效果偏好；第一版不需 3D 引擎。
- Supabase PostgreSQL、Auth、Storage：分別處理活動與票券資料、登入、照片。照片建議使用私人儲存空間，依角色授權讀寫；展示範圍待確認。
- 若公司使用 Microsoft 365，優先評估 Microsoft Entra ID 登入並限定公司 tenant，加上員工群組或資格名單以排除訪客；替代方案是公司信箱驗證加員工資格名單。須確認一位員工對應一個投票身分，不能單靠網域、IP 或瀏覽器紀錄判定。
- 資料概念：活動、參賽者、照片、員工投票資格、投票紀錄、主辦人權限、公布狀態。
- 投票經伺服器及資料庫原子操作驗證資格、活動開放時間和參賽者有效性；以活動與員工唯一身分的唯一約束保障一票，資料庫政策限制直接存取。是否允許改票仍待確認。
- 截止時間以伺服器為準；結果公布獨立於投票截止。一般使用者的 API 不回傳未公布統計，避免只在畫面隱藏；主辦人統計功能需角色驗證。
- 部署平台與費用待確認；目前維持 D 槽 Local 開發，尚未建立任何雲端服務。

查核來源（2026-10-27）：[Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components)、[Motion](https://motion.dev/docs/react)、[Microsoft 登入](https://supabase.com/docs/guides/auth/social-sign-in/auth-azure)、[Storage 存取控制](https://supabase.com/docs/guides/storage/security/access-control)。

## 參考既有專案後的架構比較（2026-10-27，待選定）

來源：使用者希望若採 Next.js 則沿用 Lumens Portal 架構，並提出 GitHub Pages 及既有工號投票作為參考。

- Portal 本機 README、package.json、docs/architecture.md 確認：Next.js 16 App Router、React 19、TypeScript 5、Tailwind CSS 4、Firebase Auth、Firestore、Admin SDK 與 Vercel。只讀取文件與套件宣告，未驗證其正式服務。
- GitHub `isaaceating/my-lumens-star-2026` 的 app.js 是 Google 登入、每日投票。
- GitHub `isaaceating/2026-my-lumens-star-final` 的 final-vote.js 才是工號參考：Firebase 匿名登入、讀取 employees 並檢查 isActive，紅毯投票透過 Firestore transaction 以工號為文件 ID；決賽觀眾另有三票規則。匿名登入不代表已驗證員工本人。倉庫未找到 Firestore Rules，尚未驗證部署權限或線上行為。
- 方案 A（偏向目前活動規模與 Pages 偏好）：模組化 HTML/CSS/JavaScript + Firebase，GitHub Pages 放前端；照片放獨立 Firebase Storage，投票 API 放 Cloud Functions，由服務端核對工號、截止時間、重複票並寫入交易。員工資料與未公布票數不放靜態檔案。管理員使用獨立登入與角色授權。
- 方案 B（若選 Next.js）：沿用 Portal 的 Next.js/React/TypeScript/Tailwind/Firebase 組合，伺服器端投票走 Route Handler + Admin SDK；採支援 Next.js 伺服器的主機，與 Portal 的帳號及資料資源隔離。
- Next.js 可靜態匯出至 GitHub Pages，但不能保留 Portal 的執行期伺服器 API；仍須另外放後端，不能宣稱完整架構相同。
- 動畫能力取決於 CSS、JavaScript、SVG/Canvas/WebGL 與動畫函式庫，兩種方案皆可實現目標效果，框架本身不決定效果上限。
- 工號已確認；只有工號名單核對可限制每工號一票，但不能證明輸入者本人。個人投票碼為可選提案，尚未要求使用者採用；若僅採工號，須明確保留此驗證限制。
- 建議 Firebase 另建活動專用資源，不沿用參考專案的正式資料；尚未建立任何服務或部署。

參考：[工號投票程式](https://github.com/isaaceating/2026-my-lumens-star-final/blob/85e74c5e441dca1fa60f5b85bd8178e5188ea841/final-vote.js)、[原版投票](https://github.com/isaaceating/my-lumens-star-2026/blob/ab7c1012778a9295aaeab663eac3a98476f6d413/app.js)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[Next.js 靜態匯出](https://nextjs.org/docs/app/guides/static-exports)。


## V3 動畫圖層（2026-10-27）

haunted.css、haunted.js 在既有 demo 上增加獨立 SVG 角色與 CSS 關鍵影格動畫；assets/lumens-castle-v3.png 是以 V2 編修生成的無角色背景。背景及角色 SVG 使用相同 1536×1024 構圖與置中裁切，隨原場景視差一起移動，角色本身仍有各自動畫。原始 Logo 及 V2 圖保留。導覽使用活動專用字樣，不再顯示企業藍 Logo。預覽伺服器白名單納入新增檔案。


## V4 插畫素材與對齊（2026-10-27）

painted.js、painted.css 在原動畫基礎上替換角色層。assets/castle-characters-v4.png 是透明 PNG 插畫圖集，透過明確取圖矩形與 SVG clipPath 隔離相鄰角色；不改寫圖片像素。黑貓有睜眼／閉眼素材。古堡與角色層共同使用 1536×1024 座標，背景 contain，角色 SVG meet，避免裁切造成招牌偏移。發光招牌採6 秒 CSS 節奏循環：快速抖閃、兩次獨立單閃、再次快速抖閃、熄滅停頓。抖閃亮度及脈衝長度不一；並非每次隨機。減少動態效果時停止角色動畫，招牌固定低亮度。

2026-10-27：魔女繞城以 CSS 多段位置、縮放及內層朝向動畫實作，後方段透過透明度模擬遮擋，非 3D 深度遮擋。黑貓以腳底為縮放中心，保留原插畫並以眼部光效及整體亮度轉換氛圍，循環 15 秒；僅首頁黑貓變身，小怪區保持原互動。

2026-10-27：魔女動畫改為 moonlit-pass 24 秒高空單向路徑；移除 orbit-heading 鏡像，取代上一版 26 秒繞城效果。保持同一朝向，僅小幅傾斜與縮放。


2026-10-27：assets/slender-cat.png 為本次 imagegen 依既有角色生成的透明瘦長貓（原檔保留）。首頁貓使用兩層素材、共用腳底縮放中心及 15 秒交叉淡化；不直接拉伸毛髮。魔女 moonlit-pass 與 witch-return-facing 共用 16 秒週期，43–50% 與96–100%隱藏，50%及100%瞬間換向。取代先前24秒單向路徑。

## 正式實作基線（2026-10-27，取代前述 demo-only 現況）

- GitHub Pages 前端透過 HTTPS API 存取 Firebase Functions，無前端直讀 Firestore；Rules 拒絕所有客戶端存取。
- 共用 core.cjs 管理活動狀態；api.cjs提供public event、vote及admin端點。Firestore events/halloween-2026單文件交易同時核對時間、參賽者、工號資格及重複票。
- 原始工號只在匯入與請求中使用；持久化HMAC鍵，APP_SECRET僅後端可見。密碼以scrypt hash保存在秘密管理服務（本機 private/config.json），不在前端。
- 登入發放隨機bearer session，僅主辦sessionStorage保存、8小時過期，登出撤銷；登入及投票按IP限流。名單及未公布票數只在私有資料內；公開回應為欄位白名單。
- 照片需主辦授權，上傳限制JPEG/PNG與3MB後端大小；瀏覽器先縮圖至1600px，Storage以隨機檔名與公開下載token提供已發布照片。未發布URL不經公開API揭露。
- 本機LocalStore以串行交易和原子檔案替換持久化，與雲端adapter共用業務邏輯。Firestore emulator／雲端端到端尚未驗證。
- 靜態dist使用明確白名單，private、functions、員工名單與秘密不進公開產物。GitHub Actions只自動檢查，Pages需手動觸發。
- 預設時區Asia/Taipei，開始2026-10-30T07:00:00Z、時長1800000ms。暫停存剩餘時長；恢復以伺服器現在時間重算截止。公布獨立於截止。

## 2026-10-27 正式部署補充

Functions API 已部署 asia-east1；Storage bucket 同區；Pages 使用已確認的 HTTPS API URL。POST /employee 按工號 HMAC 查單筆 employeeProfiles，僅回傳 name、department，按 IP 限流，不回傳投票狀態或全名單。個資僅放 Firebase 私有活動文件與忽略的本機 private/。publicView 白名單排除 employeeProfiles。工號仍不是身份驗證，知道他人工號可查到對應姓名。

參賽者 photos 最多 3 個受驗證圖片 URL，photo 保留為第一張封面以相容舊版。未發布資料不回傳相簿。Cloud Run 部署映像保留 7 天；不影響活動資料與參賽照片。隔離本機驗證可用 LUMENS_PORT、LUMENS_DATA_DIR，與正式狀態完全分開。

## v1.10 名單匯入（2026-10-27）

functions/employees.cjs 處理交易內新增／更新與取代。POST /admin/employees 的 mode 預設 merge，replace 需要確認旗標與精確 revision。合併讀取最新交易快照，避免並行新增互相覆蓋；更新只影響提供的身份欄位，回應 importSummary 不含工號及姓名。apiVersion 回傳套件版本 1.10.0；介面與 Git tag 顯示 v1.10。
