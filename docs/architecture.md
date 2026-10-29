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

## v1.11 Hero 整合層（2026-10-28，本機預覽）

hero.css / hero.js 在原插畫動畫層之後載入。角色互動使用 SVG 取圖範圍內的透明命中矩形，避免 sprite atlas 原圖邊界影響對話定位；幽靈直接使用透明獨立素材。對話內容以 textContent 寫入。背景與舞台仍共用 1536×1024 座標，招牌依新底圖重新定位。原圖保留，新增 lumens-castle-v5.png 與 friendly-ghost-v5.png。沒有改動後端 API 或正式投票資料。

2026-10-28 第二輪：新增 awakening.js，共用 requestAnimationFrame 時鐘驅動 12 秒演出；不覆寫原有角色 CSS transform，使用內層 SVG 群組疊加動作，飛行使用 updatePlaybackRate 保持路徑連續。動畫暫停或頁籤隱藏時凍結進度；結束清除所有演出狀態並恢復按鈕。燈光位置沿用場景座標。新背景 assets/lumens-castle-v6.png，原素材保留。

2026-10-28 魔女施法版：awakening.js 改成 15 秒、雙階段光球軌跡與專屬可見飛行路徑，結束將原巡航動畫時間對齊至 3.2 秒接回。front 姿態以透明 PNG 交叉淡化；南瓜噴發為共用 PNG 的 30 個 SVG image，依時間計算拋物線與旋轉，沒有圓環。castle-awake 與 --cat-form 保存本頁甦醒狀態，重播重設、重新整理清除。燈光與南瓜圖層置於魔女後方避免遮臉。新增 assets/witch-casting-front.png、assets/evil-pumpkin-lantern.png，原素材保留。靜態建置與本機預覽白名單已涵蓋新素材。

2026-10-28 木牌版：木牌使用 CSS 木紋漸層、破邊裁切與繩索，文字使用 Google Fonts Butcherman（Georgia 備援）。移除 header 與篩選元素時同步移除 app.js、live.js、haunted.js、hero.js 對其依賴；後台改由 Footer 原始 Logo 連結。hero.css 以 castle-awake 分隔幽靈光暈與角色動作；未改動身份驗證及投票 API。

2026-10-28 抓痕銘牌版：assets/castle-title-scratched.png 為標題插畫，實際 h1 使用 sr-only 保留語意，移除 Butcherman 外部字型載入。assets/ghost-dormant.png 與原幽靈成對疊放，用 castle-awake 控制淡化，命中區保留在上層 sprite。新增素材由既有 PNG 白名單建置；預覽白名單同步新增。

2026-10-28 Eater 與回復演出：無字 assets/castle-title-blank.png 搭配真實 HTML h1／Google Fonts Eater、Noto Serif TC。蝙蝠為獨立 SVG 翼部動畫，銘牌容器負責整組漂移。awakening.js 將 20 秒實際時間映射既有角色演出階段，光球獨立採 3+1+3 秒；--wake-level 控制幽靈兩素材交叉淡化、角色光暈與招牌亮度，--cat-form 在收尾降為 0。finish 移除 castle-awake、清空全部演出燈光；暫停／隱藏頁面仍凍結演出，減少動態只顯示對話。

2026-10-28 節奏微調：awakening.js 增加獨立 flightTime，僅加倍 7 秒後的接近路徑時間，到中央塔後夾止至原回程 cue；其他效果沿用原時鐘。hero.css 的 invitation-breathe 僅套用非 hover/focus/disabled 狀態，避免覆寫既有 hover 樣式。

2026-10-28 最終版：前後兩次手心集氣共用 14 顆 SVG 粒子及光球，後段手掌以 witch 的畫面座標矩陣定位；光球以曲線送到塔尖，回程、噴發和收尾各用獨立時間。finish 同步清除粒子、光球縮放與演出狀態。前端 v1.11.0 與 API v1.10.0 分開記錄，本次沒有後端程式變更或 Firebase 部署。

## v1.12 入場與重設（2026-10-28）
首頁以 html.castle-entered 控制 #partyContent 及投票 CTA；lumens-party-entered 僅存 sessionStorage，不是投票權限。10+3 秒使用單一演出時鐘，揭幕不改活動狀態。手動開始另記 startedAt，公告欄顯示實際開始。
POST /admin/reset 沿用主辦 session 與 Firestore 單文件交易，要求 revision、expectedTotalVotes、confirmation=RESET、未來 scheduledAt 及合法 durationMinutes；重設票與狀態、遞增 generation，保留其他內容。publicView 僅新增 generation/startedAt，不洩漏名單或票數；前台發現 generation 改變會解除本頁已投票標記並關閉過期對話。部署不遷移或重設任何資料。

## v1.13（2026-10-28）
publicView 僅在 published 且 clock.status=ended 時回傳真實候選者 name；其他階段以參賽者編號代稱，costume／description／已發布照片維持公開。adminView 保留原始候選者資料。前台標題、alt、確認視窗只使用 costume，姓名另於結果公布顯示。資料庫欄位未改名、無遷移。
演出 actualTime 依各段長度映射原 cue 時間，僅壓縮指定行程與集氣；總計 11300ms。塔尖投射物使用既有南瓜 PNG 與 SVG 短尾光，結束一併清理。正面圖片縮小與手掌定位同步 0.92 倍。

## v1.14 影音與獎項（2026-10-28）
- 主辦登入後以 2 MiB 分塊上傳影片，伺服器驗證片段序號、大小及完整性；Storage video-uploads/ 保存私有暫存。Firestore media-jobs/ 管理上傳／轉檔／就緒／失敗，不對公共事件提供工作資料。
- finalize 在 Functions 執行 ffprobe＋ffmpeg：限 60 秒、最高 8K 來源，限制輸入容器與本機協定，縮放至最長 1080、H.264/yuv420p＋AAC、faststart MP4；擷取 JPEG 封面。成功清除上傳片段；中斷或失敗片段尚未自動回收，需後續維運清理。
- Functions api：2 GiB、540 秒、concurrency 1、maxInstances 3，容納一次影片轉檔。片段每次小於既有請求上限，無公開 Storage 寫入規則。
- 候選人僅能綁定同一候選人的 ready 工作，影音發布仍限活動開始前。公開資料含 video URL/poster/duration，不含上傳片段或工號。舊照片資料向後相容。
- awards 覆寫獨立於 votes；自動獎項依有效名次，手動獎項可獨立指定；RESET 同時清除覆寫。公布後更動需要明確確認。
- 本機伺服器支援 MP4 Range；正式影片由 Firebase Storage 傳送。CI 安裝 functions dependencies 並執行實際 MOV 轉檔測試。

## v1.15（2026-10-29）
- motion.js 在 app.js 後建立 SceneMotion，IntersectionObserver、document visibility、dialog open 與 motion-off 決定運算狀態；CSS 與 Canvas／甦醒 RAF 共同暫停，保留演出時鐘與使用者偏好。
- awakening.js 每幀讀取一次 stage CTM，共用反矩陣；光球以 transform 定位，避免 left/top 帶來布局更新。完整演出、粒子數與發光參數維持。
- live.js 以 candidate ID 與完整顯示狀態簽章快取卡片，只替換改變的節點；refresh 防止重疊請求。圖片 lazy/async，影片仍只在燈箱載入。
- scripts/visual-assets.json 記錄來源及精確裁切；node scripts/optimize-assets.cjs 重建無損 WebP，tests/visual-assets.test.cjs 比較透明度及所有可見像素。原始 PNG 留存以供後續設計。
- 前端 v1.15／API v1.14 分開發布；本次僅 Pages，不部署 Functions 或修改正式資料。

## v1.16（2026-10-29）
index.html 新增 hero-intro 格線容器，桌面文案／操作兩欄、手機單欄；未入場投票 CTA 以 visibility:hidden 保留位置並阻止點擊／焦點。移除 replayCastle DOM 與 awakening.js 綁定，保留 castSpell 及原 sessionStorage 入場邏輯；API 不變。

## v1.17（2026-10-29）
awakening.js 的 castleShowTiming 分離場景點亮與角色時間軸：最後一盞燈於 3100ms 完成，4300ms 才啟動飛入；後續角色 cue 整體延後 2300ms，10300ms 起淡出、11300ms 完成。光球入門淡出與燈光依 lighting 時間，避免等待時殘留光球；中央塔施法、南瓜等依 actor 時間。純時間函式可由 Node 測試，瀏覽器保留原 RAF／可視性暫停。
公告兩側使用靜態 inline SVG 裝飾與既有南瓜 WebP，不加下載依賴；時間用 Asia/Taipei、hour/minute 格式，不改伺服器活動時間。API 維持 1.14.0。

## v1.18（2026-10-29）
hero-assets.js 以 Image.decode 等候完整圖片可用，先背景後三工作者去重隊列；每張 20 秒逾時，失敗可重試，工作者全部 settle 後才允許下一次嘗試。painted.js 與 awakening.js 暫存 SVG 圖片 data-src，準備後填入 href；背景 preload 提前並 high priority，銘牌 low priority，原檔與尺寸不變。根元素 hero-ready 與 SceneMotion 同步，載入期間停止不可見動畫；ready 前 button disabled／visibility hidden 且 startShow 另有守門。
時間軸：全亮 3100ms → 飛入 3900ms → 到位 5400ms → 轉向 5600–5950ms → 集氣 5950–6450ms → 後續南瓜／回程；10450ms 開始淡出，11450ms 完成。照片燈箱用 minmax(0,1fr) grid 分配剩餘高度，名稱與縮圖兩行固定內容，實際影片原生 controls 保留。API 保持 1.14.0。
## v1.19（2026-10-29）
hero-assets.js 使用四工作者去重佇列與並行字型準備，移除背景解碼前置相依。Map 保存同次頁面成功解碼素材供重試使用；全部工作 settle 後才開放重試。百分比分母固定為唯一圖片數＋字型項，成功解碼／字型 ready 才增加，完成後同步填入 SVG href 並設 hero-ready。進度以 CSS 更新，無新圖檔或持續 frame loop。
Luna 飛入 3700ms、到位 5200ms、轉向 5400–5750ms、集氣至 6250ms；最後南瓜於 11700ms 結束才回程，12700ms 起淡出、13700ms 完成。保留 actor 與 lighting 分離及場景暫停。
## v1.20（2026-10-29）
awakening.js 分出 pumpkinSpec／pumpkinPosition 純函式；SVG 後、中景群組置於 witch-flight 前，前景群組置於其後，維持原有 30 顆粒子與素材去重。前景軌跡以 Luna 正面固定位置設計；測試以旋轉外接圓半徑檢查每 5ms 位置，避免與臉部保護矩形相交。既有暫停、清除粒子及演出 cue 保留。Hero CSS 以文字漸層／小幅陰影呈現厚度，無額外下載素材。
2026-10-29 v1.20.1：pumpkinSpec 調整為前景 15／中景 5／後景 10，前景 76–132 單位，左右分流避開原臉部保護矩形；同一全路徑旋轉碰撞檢查通過。
2026-10-29 v1.20.2：前景以序號交錯左右，並分散 vy／gravity／spin；1.4 秒後橫向速度以連續指數衰減，減少直線成束並保留掉落。沿用旋轉外接範圍臉部檢查，新增左右 8／7 及拋物線多樣性驗證。
2026-10-29 v1.20.3：pumpkinPosition 對正位移使用連續飽和函式（210 後漸進至 300），一階速度連續、不硬切落點；新增所有右移粒子旋轉外接範圍小於 x=1445 的全路徑測試，既有避臉測試維持。
## v1.21（2026-10-29）
pumpkinSpec 以低差異序列配置不同落點，pumpkinPosition 使用線性水平速度加有界漂移與原拋物線，不再共用邊緣壓縮。移除避臉驗收（使用者明確取消），保留邊界與落點分散測試。
witchReturnPose 將淡出末秒以二次進度接上巡航 3200–3700ms，結束時 CSS 時間設定 3700ms；桌面／手機沿各自 keyframe 路徑，位置與一階速度連續。SVG attr helper 只寫入變動值；原 show clock、可視性暫停及特效保留。
live.js 以 published AND ended 作得獎顯示條件；頂部 award-header／名次獎牌與增強框線，結果文字依狀態更新及恢復。只改前端，API 相容 1.14.0。

## v1.22（2026-10-29）
pumpkinPosition 改依 Hero 寬高與塔尖螢幕座標計算，前景置於 Hero 獨立 pointer-events:none SVG，後中景轉回場景座標保持 Luna 前後層次。42 顆採低差異落點、錯開色調及發射時刻；CSS hue/saturation 與 SVG 寬高輪廓共用原始無損圖，不增加下載。姓名票數移入 award-header 的 award-identity，結果資料閘門不變。API 維持 1.14.0。

## 連線恢復（2026-10-29，本機）
network.js requestJson 以 AbortController + Promise.race 包住 fetch 和 JSON body；只負責一次請求、逾時中止及區分不確定結果，不自動 retry。live.js 為 event／lookup 加入手動恢復按鈕；pendingVote 捕捉原 payload 與 generation，禁止等待中另開投票，忽略 RESET 前的舊回應。僅在前端記憶體保留待確認票，無新 API 或個資持久化。build 白名單及語法檢查加入 network.js。

## v1.23（2026-10-29）
選票改為每個工號雜湊鍵下的 candidateIds 二元素陣列；同一次 Firestore transaction 完整驗證與保存，generation 阻擋重設前舊請求。統計相容舊 candidateId，但新投票 API 拒絕舊單票請求。admin totalVotes 保留投票人數語意（RESET 樂觀鎖），totalSelections 新增實際選票數。RESET 補齊缺少的第四候選人，不改動既有候選人、影音與資格名單。公開前台以 Set 選擇兩人，確認列與原身份核對視窗一次送出；後台只渲染被選取的編輯表單。

## v1.23.2 · Hero 傳輸修正（2026-10-29）
hero-manifest.js 記錄 12 張公開無損 WebP 的 SHA-256、位元組數與 Firebase Storage 不可變 URL（hero/<sha>/<name>）。下載 token 僅公開既有插畫，非管理憑證。hero-assets.js 四路串流 fetch，15 秒無資料或 180 秒總上限才 abort；自動依序切換 Firebase、Pages 雜湊版本、Firebase recovery URL。每項先檢查大小／雜湊再 decode 成 blob URL，共用於 HTML、SVG 與背景，不發出重複原圖請求。進度包含下載位元組及 decode，100% 才啟用喚醒；已完成素材逐項顯示並保留於頁面快取。字型最多等待 2.5 秒後使用暫時 fallback，原字型繼續載入。

## v1.23.3 · Q90 素材（2026-10-29）
使用者已核准全 Hero Q90 demo。assets/ 下 12 張 WebP 改為核准副本，原檔完整保存 assets/lossless/（原 PNG 同樣保留）。build 既有白名單不遞迴，因此不把無損備份帶入站點；目前 PNG 仍依原規則打包，但 Hero 不載入它們。scripts/optimize-assets.cjs 從無損 WebP 編碼 Q90／compression_level 6；hero-quality.json 記錄來源與核准副本 SHA／尺寸。測試驗證原 PNG 可見像素與無損備份一致、Q90 尺寸／alpha 不變及精確符合核准雜湊。12 張新 CDN 路徑更新 manifest，舊 URL 不刪除，演出程式無變更。
