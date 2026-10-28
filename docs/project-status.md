# Project Status

日期：2026-10-27。來源：使用者本次專案初始化要求與本機檢查。

## 目前目標

提供可操作的 Whimsical Halloween 本機視覺 demo，待使用者確認風格後接續正式功能。

## 現況

- 專案路徑：`D:\Codex-Projects\lumens-halloween`。
- 模式：Local；已初始化分支 `main`，無首次 commit，無遠端。
- 已建立 README、AGENTS.md、.gitignore 及文件索引與基本知識文件。
- 驗證結果：Git root 為 D:/Codex-Projects/lumens-halloween；worktree 清單只有本機 main；remote 清單為空；19 個相對文件連結均可解析。目錄不是符號連結或 junction，實際位於 D 槽。

## 未完成

- 活動需求與驗收細化、技術選型、網站實作、測試與部署。
- 未建立首次提交或遠端 repository。

目前可啟動本機視覺 demo，尚未上線；下方保留前期討論紀錄。

## 2026-10-27 需求討論

- 來源：使用者本對話最新要求；已確認不需要報名系統，需要照片上傳及投票，允許動畫、特效與圖片。
- 視覺提案與待確認流程集中記錄於 [Features](features.md)。
- 本次重新檢查 Git：實際工作路徑與 Git root 均為 D:/Codex-Projects/lumens-halloween，main 尚無 commit，只有單一本機 worktree；初始化文件仍未追蹤，未覆蓋其他程式變更。
- 此次僅更新需求文件，未進行網站實作或應用程式測試。

### 投票規則確認與技術提案

- 使用者已確認主辦人上傳、公司同仁一人一票、隱藏票數及主辦人截止後公布；Whimsical Halloween 方向確認。
- 已將驗收要求更新至 Features，並在 Architecture 記錄 Next.js、Motion 與 Supabase 提案及官方來源；技術尚未核准、未安裝依賴或建立雲端服務。
- 下一步確認公司登入方式、改票規則及公布管道；此次為文件更新，未執行應用程式測試。

### 既有架構比較與工號投票

- 使用者確認改用工號，不依賴 365；若選 Next.js 希望對齊 Portal，亦希望評估 GitHub Pages。
- 已讀取 Portal 本機文件及兩個 my-lumens-star 倉庫，確認 final 版本的工號流程；未存取員工名單或正式資料，未測試舊站線上投票／Rules。
- 最新架構建議與比較見 Architecture；先前 Supabase 建議已標為歷史提案。尚未選定框架或建立雲端資源。

### 視覺 Demo 交付（2026-10-27）

- 使用者暫定 GitHub Pages + Firebase，工號投票不加投票碼。
- 完成靜態首頁、SVG 動態插畫、四張示意角色卡、分類、詳情、模擬投票、照片本機替換與動態減量設定。
- 驗證：JavaScript 語法通過；本機 HTTP 200；瀏覽器實測詳情、分類、DEMO001 模擬投票成功及後續按鈕鎖定；桌面與 390px 手機版截圖檢查；瀏覽器擷取的 error log 為空。
- 本機圖片替換已實作，但本輪未以檔案選擇器實測；未驗證正式身份、持久投票、管理員或雲端服務。
- 預覽位址 http://127.0.0.1:4173；啟動指令見 README。畫面截圖在 outputs/halloween-demo.png。
- 仍是 main、無 commit／remote、無額外 worktree，沒有推送或部署。


### Lumens 古堡 V2（2026-10-27）

- 來源：使用者要求加強滑鼠、捲動、粒子與角色，並提供 Logo。
- 完成：古堡生成插畫、原始 Logo 頁首、星塵／光暈、捲動視差、喚醒魔法按鈕及四位互動小怪。
- 驗證：npm run check 通過；瀏覽器實測魔法按鈕、黑貓及蘑菇精靈台詞、捲動後視差參數更新、動畫開關切換；桌面與 390px 手機畫面檢查，無橫向溢位；擷取的 error log 為空。
- 本輪未重測照片選擇器與模擬投票；Firebase 仍未連接，正式功能未完成。
- 截圖：outputs/halloween-demo-v2.png；預覽：http://127.0.0.1:4173。
- 維持 D 槽 Local、main、無 commit／remote；未推送或部署。


### 活的魔法世界 V3（2026-10-27）

- 已完成 F003，素材與分層方式見 Architecture。路徑仍 D:/Codex-Projects/lumens-halloween；Local main、無 commit、單一 worktree，既有未追蹤檔案保留。
- 驗證：npm run check 通過；瀏覽器檢查飛行與拍翅等 CSS 動畫執行，暫停後魔女、翅膀、黑貓及招牌 computed animationPlayState 均為 paused，重新開啟後 running。南瓜點擊台詞通過；桌面及 390px 手機檢視，無橫向溢位。
- 限制：系統 reduced-motion 樣式已加入但本輪未切換 OS 設定實測；照片與投票未於本輪重測，仍為前輪 demo，沒有正式服務。
- 預覽 http://127.0.0.1:4173；畫面 outputs/halloween-demo-v3.png。


### V4 插畫整合（2026-10-27）

- 完成 F004；保留 D 槽 Local main、無 commit／remote，未部署。
- 驗證：npm run check 通過；桌面與 390px 手機確認完整背景比例、角色透明邊界及無橫向溢位；小魔女點擊台詞成功。動畫暫停時魔女、黑貓兩個眼睛狀態、招牌 computed animationPlayState 均為 paused。
- 修正 SVG meet 留白區顯示相鄰角色的問題，以 clipPath 明確限制各角色取圖區域。
- 系統 reduced-motion 未切換 OS 設定實測；本輪未重測投票／照片流程，Firebase 仍未接入。
- 預覽 http://127.0.0.1:4173；截圖 outputs/halloween-demo-v4.png。

### 招牌閃爍節奏修正（2026-10-27）

依使用者澄清，僅調整招牌 CSS 為 6 秒的「抖閃 → 單閃兩次 → 抖閃 → 暗停頓」。保留暫停與 reduced-motion 規則；核對關鍵影格順序與持續時間。其餘功能未變更、未重測。

### 繞城飛行與角色表現（2026-10-27）

完成魔女 26 秒繞城、中右幽靈鏡像、首頁黑貓 15 秒變大與發光眼睛循環，以及南瓜／骷髏放大與骷髏左移。npm run check 通過；瀏覽器核對兩隻幽靈 scale(-1 1)、魔女及黑貓新增動畫暫停狀態，手機 390px 無橫向溢位。桌面及手機構圖已檢視；OS 減少動態設定未另行實測。原招牌閃爍節奏保留；無部署或提交。

### 魔女高空單向飛行（2026-10-27）

依使用者要求先修正魔女：取消左右翻面、路徑上移至月亮與塔尖，24 秒單向飛行並隱藏重置。npm run check 通過；瀏覽器確認 moonlit-pass／24s、witch-heading transform 為 none。正式功能尚未開始，待確認活動時間、改票規則、照片可見範圍及後端／主辦帳號資料。



### 雙向魔女與瘦長貓（2026-10-27）

依使用者核准方案，放大魔女並改為16秒雙向，隱藏時換向；新增瘦長貓透明素材，首頁小貓為先前2/3、最大貓為先前1/2，交叉淡化變換輪廓。npm run check 通過，仍為 D 槽 Local main、無 commit／remote，未部署。正式功能仍未開始。
瀏覽器驗證：魔女位移及朝向均為16秒，黑貓兩素材及縮放均為15秒；暫停後全部為 paused。已檢視桌面畫面與返回方向，瀏覽器 error log 為空。本次未重測手機及投票流程。

### 魔女臉部辨識度（2026-10-27）

依使用者要求再放大魔女約70%，同步調整高空路徑的邊界空間及 reduced-motion 靜態位置。僅 CSS 與文件修改，雙向16秒節奏及其他角色保持不變。

## 第一版功能實作（2026-10-27，目前現況）

已建立公開 GitHub repository、Firebase Project ID lumens-halloween-2026、台灣區Firestore及deny-all客戶端規則。本機後台與API已實作，主辦密碼採hash，員工資格快照僅本機private資料。正式參賽照片未提供，保持三位未發布佔位。

驗證：10項Node測試通過（時間邊界、暫停凍結、資格、併發一票、票數保密、登入session、限流、匯入與上傳驗證）；npm run check、build通過；Firestore Rules已成功編譯並發布。瀏覽器已驗證首頁三名額與未開放狀態、後台登入、預設時間與儲存。照片選擇器和完整雲端流程尚未實測。

未完成：Functions／Storage／Pages正式上線、計費連結、雲端名單匯入、照片及完整負載驗收。local state與照片不會自動同步到Firebase。部署要求見deployment.md。

## 正式部署進行中（2026-10-27）

Local main，路徑 D:/Codex-Projects/lumens-halloween，基底 edc53f5，無 worktree。Blaze 已確認；Functions API、Storage 與保密規則部署成功，部署映像清理策略已補設 7 天。正式資格快照已匯入，0 票、等待開始、三位未發布。Pages 已啟用，待本次提交後觸發發布與線上驗證。

新增身份帶入與最多三張相簿；12 項測試、語法、build 通過；隔離瀏覽器完成三張上傳／保存／相簿切換／測試身份帶入／成功投票。雲端登入、名單匯入、單筆身份比對、跨網域、照片上傳下載及公開資料保密已驗證。沒有在正式活動投測試票；Firestore 大量同時投票尚未負載測試。

## 正式上線驗證完成（2026-10-27，最新現況）

正式網址：https://isaaceating.github.io/lumens-halloween/ ；後台：admin.html。發布程式版本 752b7c1，GitHub Pages run 40480067770 與 Validate run 40480049154 均 success。正式瀏覽器首頁取得雲端活動狀態、後台登入成功，預定 10/30 15:00、30 分鐘、0 票、三位未發布；瀏覽器 error log 為空。後台 390px viewport 檢查無橫向溢位。

保留限制：尚無正式參賽照片及名稱；完整投票在隔離本機以虛構身份驗證，雲端採非破壞性驗證，未做大量同時投票負載測試。使用者可於後台補資料。工作仍在 D 槽 Local main，無額外 worktree。

## v1.10 待部署（2026-10-27）

基底 7dad002；D:/Codex-Projects/lumens-halloween，main，Local，無 worktree。名單合併／取代及版本顯示已實作。18 項 Node 測試、語法與 build 通過。隔離瀏覽器驗證新增保留舊名單、取代提醒、取消無修改、確認取代及重設預設模式，error log 空。正式名單未作測試修改。待 commit/tag/push、Functions 與 Pages 部署回讀。

## v1.10 正式驗證完成（2026-10-27，最新）

發布程式提交 1c27e4040267b2028570ebd76e67859199a47f6d，固定 tag v1.10，Release：https://github.com/isaaceating/lumens-halloween/releases/tag/v1.10 。Functions 部署成功，正式 API 回讀 apiVersion=1.10.0；未確認取代請求回傳 400，revision 與名單數未變。Pages run 40533825514 成功，headSha 與 tag 相同。

直接從 tag 的首次 Pages run 40533628996 被既有 main-only 環境保護拒絕；未修改保護規則，改從相同提交的 main 部署成功。正式瀏覽器登入、v1.10 標示、預設新增／更新及完整名單均已核對。沒有重匯正式名單或送出測試票。18 項測試與隔離瀏覽器流程已通過。後續文件提交不變更此發布 tag 或已部署程式。

## v1.11 本機視覺預覽（2026-10-28）

路徑 D:\Codex-Projects\lumens-halloween，Local main，基底 0e61404。本輪未 commit、push、tag 或部署。正式站維持 v1.10。需求見 F008。

完成：新增完整古堡與可愛幽靈素材、Hero 角色互動、首屏比例、導覽移位、跑馬燈連續循環。hero.js/hero.css 為本輪整合層；移除 magic.js 舊小怪區依賴及 live.js 頂列依賴。

驗證：npm run check、18 項 Node 測試、npm run build 通過；瀏覽器桌面 1280×720、iframe 390×844 與 375×667 視覺檢查；角色鍵盤對話、暫停按鈕及無 console error 已檢查。窄螢幕為瀏覽器模擬，尚未實機手機驗證。

預覽 http://127.0.0.1:4173/?demo=1 ，使用示意角色與模擬投票。待使用者確認視覺，之後再統一版本資訊、提交、部署與正式驗證。

### 2026-10-28 第二輪預覽

已完成乾淨夜空、角色右移、黑貓最小再減半與延後換形、12 秒喚醒演出。維持 Local main / 基底 0e61404，沿用未提交 v1.11 工作，未推送與部署。新版伺服器：http://127.0.0.1:4176/?demo=1 。

驗證：語法檢查、18 項既有測試、靜態建置通過；瀏覽器 1280×720 與 390×844 構圖、演出開始禁用重複點擊、暫停進度固定在 5816ms、恢復與完成按鈕重置、console 無錯誤。實機手機與系統 reduced-motion 尚未實際驗證。等待使用者本機視覺確認，正式站仍維持 v1.10。

2026-10-28 第三輪：依使用者「效果太小」回饋放大甦醒演出。新增 SVG 光柱、地面光環、42 顆星芒，強化角色幅度與整體場景亮度，仍沿用單一 12 秒時鐘及原有暫停、清理機制。npm run check、npm run build 通過；桌面瀏覽器實測啟動、暫停／恢復與放大亮燈畫面，console 無錯誤。本輪僅視覺變更，未重跑後端測試；未 commit/push/deploy。預覽仍為 http://127.0.0.1:4176/?demo=1 。

### 2026-10-28 魔女施法整合版驗收

Local main / 0e61404，沿用本輪未提交變更。已完成 15 秒劇情、正面魔女素材、邪惡南瓜燈噴發、持續角色動作與甦醒後保留狀態。本機預覽更新為 http://127.0.0.1:4177/?demo=1 。未 commit、push 或部署，正式站仍為 v1.10。

驗證：npm run check、18 項測試、npm run build 通過。瀏覽器 1280×720 與 390×844 預覽；約 10.8 秒暫停可見正面魔女與南瓜噴發；恢復後 running=false、awake=true、貓瘦長 opacity=1、招牌 warm-sign-breathe、按鈕可重播。手機重播驗證貓回到初始、魔女在左端且 opacity=1。console 無錯誤。尚未實機手機或系統減少動態模式驗證。截圖存 outputs/v1.11-witch-pumpkins.png（忽略於 Git）。

### 2026-10-28 木牌與比賽文案版驗收
Local main / 0e61404，沿用既有未提交變更。完成 Butcherman 骨白木牌、比賽文案、露娜命名、三位卡片與取消分類／導覽、Footer 原 Logo 後台入口、幽靈喚醒前不發光、平日角色小動作與加亮招牌。本機預覽改為 http://127.0.0.1:4178/?demo=1 （4177 無法正常連線）。未 commit/push/deploy，正式版保持 v1.10。
驗證：npm run check、18 項既有測試、npm run build 通過。瀏覽器桌面與 390×844 手機構圖檢查、Butcherman 載入、三隻幽靈未喚醒 filter=none、喚醒後持續光暈、動作週期切換、演出結束按鈕恢復可用、Footer 點擊進入登入頁、正常模式活動與三位卡片載入通過；console 無錯誤。沒有輸入主辦密碼或送出正式投票。實機手機與 reduced-motion 本輪未驗證。

### 2026-10-28 抓痕銘牌與休眠素材版驗收
Local main / 0e61404，未提交 v1.11 變更持續保留；未 commit/push/deploy。新預覽 http://127.0.0.1:4179/?demo=1 ，使用新啟動伺服器載入新增素材白名單。完成七項修訂：尖銳抓痕插畫字銘牌、無繩索、寬螢幕文案右移、右側門牌喚醒按鈕、角色更慢更小、幽靈休眠素材、甦醒角色光暈。
驗證：npm run check、18 項測試、npm run build 通過。瀏覽器 1440×900 確認文案左邊界約 143px；390×844 手機按鈕無溢出、素材可見；休眠時三張發光幽靈 opacity=0，動作週期 7.8s/9.6s；演出結束發光素材 opacity=1，南瓜與骷髏光暈存在且按鈕恢復可用。console 無錯誤。截圖 outputs/v1.11-scratched-plaque.png。實機手機與 reduced-motion 本輪未實測。

### 2026-10-28 Eater、蝙蝠銘牌與 20 秒回復版
Local main / 0e61404，保留既有未提交 v1.11 工作，未 commit/push/deploy。預覽 http://127.0.0.1:4180/?demo=1 。完成 Eater＋思源宋體、蝙蝠攜牌動畫、加亮 20 秒演出與收尾還原。
驗證：npm run check、18 項測試、npm run build 通過。1440×900／390×844 瀏覽器檢查字型、構圖與按鈕；字型載入檢查 Eater / Noto Serif TC 通過。演出約 4937ms 暫停時光球仍可見且未亮燈，9470ms 已亮燈；恢復並結束後 awake=false、running=false、cat=0、三隻發光素材 opacity=0、南瓜／骷髏週期回到 7.8s／9.6s、按鈕可再次操作。暫停時銘牌 animationPlayState=paused。console 無錯誤。截圖 outputs/v1.11-eater-awakening.png。本輪未實機手機與系統 reduced-motion 測試。

2026-10-28 按鈕呼吸／Luna 加速：Local main / 0e61404，未 commit/push/deploy；預覽沿用 http://127.0.0.1:4180/?demo=1 。npm run check、npm run build 通過。瀏覽器確認呼吸為 1s、演出中 animation=none；11103ms 時 Luna 已在 x1050 中央塔且正面 opacity=1；完成後 awake=false、按鈕可用且 invitation-breathe 恢復，console 無錯誤。本輪僅動畫修改，未重跑後端測試。截圖 outputs/v1.11-luna-fast-arrival.png。

### 2026-10-28 v1.11 發布準備
來源：使用者授權測試後提交、推送、部署。Local main / 基底 0e61404；本輪全部 v1.11 視覺調整納入發布。Footer 更新為「2026 捷揚福委會 Presented」。18 秒演出加入前後共用的手心集氣，12.5 秒送光完成後回程／噴發，18 秒還原。
驗證：npm run check、18 項測試、npm run build 通過。瀏覽器約 10967ms 有 14 顆集氣粒子及手掌光球；13689ms 正面已淡出且 24 顆南瓜可見；完成 ready=true、awake=false、集氣粒子全隱藏，console 無錯誤。本次前端 1.11.0，API 保持 1.10.0；不寫入正式投票或名單。正式部署待 GitHub Actions 完成後補驗證紀錄。

### 2026-10-28 v1.11 正式發布完成
發布 commit：2e53135d06bc5e157d774e857e35bc375bf9dbad；Git tag v1.11 已推送。GitHub Pages run 40572575099 成功（含遠端語法檢查、18 項測試、建置），https://github.com/isaaceating/lumens-halloween/actions/runs/40572575099 。正式網址 https://isaaceating.github.io/lumens-halloween/ 。
正式驗證：首頁與 site-config 內容完全一致；awakening.js、hero.css 排除 Git 換行格式後與發布來源一致。瀏覽器顯示活動「即將開放」、三位參賽者、Footer「2026 捷揚福委會 Presented」，圖片無載入失敗；手心集氣演出可用，console 無錯誤。前端 v1.11／API v1.10.0；本次沒有 Firebase 部署、名單匯入或正式投票寫入。

### 2026-10-28 v1.12 發布準備
Local D:/Codex-Projects/lumens-halloween，main，基底 db56105；無 worktree。已完成 F009。21 項自動測試通過（含隔離完整活動、重設後再次投票、錯誤／過期／並行重設）；語法檢查與白名單建置通過。
本機隔離站 4182 瀏覽器驗收：3.5 秒後展開、13 秒後 wake-level/cat-form 為 0、重播保持展開、刷新／後台返回保持入場、390×844 無水平溢出、RESET 未輸入時禁用／輸入後啟用／取消。未在正式站投票或重設；未測實機手機。部署完成後補發布證據。

### 2026-10-28 v1.12 正式發布完成
發布 commit edf8ff3d2315a69f4c70f4b845166d873359fb27、tag v1.12 已推送。Firebase Functions 更新成功，原 API 網址回應 apiVersion 1.12.0；正式活動 scheduled、published=false、generation=0（未執行重設）。Pages run 40659922842 成功，含遠端 21 項測試與建置：https://github.com/isaaceating/lumens-halloween/actions/runs/40659922842 。
正式首頁、site-config、awakening、live、admin 檔案與發布來源比對一致（正規化換行）。正式瀏覽器驗證初始隱藏、喚醒後入場、10/30 15:00／30 分鐘公告與三位候補、演出收尾按鈕恢復；console 無錯誤。截圖 outputs/v1.12-production.png（不納入 Git）。本機暫停驗證時鐘固定 155ms，恢復正常。未操作正式投票、公布、RESET 或名單。

### 2026-10-28 v1.13 發布準備
Local main，D:/Codex-Projects/lumens-halloween，基底 891f5b8；F010 已完成。22 項自動測試、語法與白名單建置通過。隔離站 4183 使用假名稱／照片，瀏覽器確認公布前卡片與相簿隱藏選手名、公布後兩處顯示。390×844 無水平溢出、兩按鈕完整；桌面按鈕字 15／17px，Footer 高度 52px。4568ms 可見飛向塔尖南瓜，front width=340.4（原370），11.3 秒後還原；console 無錯誤。未操作正式活動資料，未測實體手機。

### 2026-10-28 v1.13 正式發布完成
發布 commit e33fac0cbd0e4497a16ff47ebe85a0a5d9b17695，tag v1.13 已推送。Functions 更新成功，正式 API 1.13.0，活動 scheduled／published=false／generation=0。Pages run 40667091437 成功：https://github.com/isaaceating/lumens-halloween/actions/runs/40667091437 。首頁、site-config、awakening、hero.css、live.css、live.js、admin.js 與發布來源比對一致。
正式瀏覽器確認喚醒、收尾、入場、集中公告／倒數及三位候補變裝標題，console 無錯誤。截圖 outputs/v1.13-production.png（不入 Git）。正式活動資料未重設、未投票或公布；完整公布前後姓名測試於隔離假資料環境完成。

## 2026-10-28 · v1.14 實作與本機驗收
- Local：D:/Codex-Projects/lumens-halloween，main，基底 6f5aabc，無新增 worktree。
- 已完成 v1.14 功能，詳細需求見 features.md，影音架構見 architecture.md。
- 已通過 26 項測試，包含實際 MOV→H.264/AAC MP4、封面產生、超長影片拒絕、影片資格綁定、同票及獎項覆寫、既有投票隱私與 RESET。
- 隔離本機 4184 假資料完成瀏覽器上傳、轉檔、儲存、實際播放、照片切換、本人確認及工號變更清除、投票、獎項修改與公布。390px／1440px 排版檢查，修正影片固有高度溢出及燈箱文字對比。9 秒演出完成回復且互動呼吸燈停止。未操作正式活動投票／重設／公布。
- 正式部署尚待完成；iPhone 真機錄影檔與真機 Safari 未實測，現有測試為合成 MOV 與桌面瀏覽器響應式模式。

### v1.14 正式部署驗證（2026-10-28）
- 功能 commit a9b1d5b，tag v1.14，已推送 main。GitHub Validate application 40709402687、40709402562 success；Pages 40710072390 success。
- Firebase Functions 部署成功；正式公開 API HTTP 200、apiVersion 1.14.0。正式活動保持 ended／published=false，公開結果仍隱藏；未重設、改票或公布。
- 七個正式前端檔案逐檔與本機版本比對一致（site-config、live、admin、awakening、hero.css、live.css、index）。正式活動已結束，因此沒有為驗證而重新開啟上傳；雲端轉檔實際上傳留待下一次主辦準備，轉檔程式已在本機與 Linux CI 通過。

- 正式站瀏覽器驗證：完整載入、9 秒演出結束復原、入場按鈕顯示且互動按鈕不再呼吸；活動公告與原有三張照片正常，未公布結果不顯示姓名與票數。瀏覽器無 console error。截圖保存於 Git 忽略的 outputs/v114/production.png。
- 首次瀏覽器載入曾出現角色圖失敗；重新載入後魔女、幽靈與居民均正常顯示，無程式例外。

## 2026-10-28 · v1.14 效能診斷（未修改或重新部署網站）
來源：使用者要求檢查載入、動畫及影片流暢性。Local main 基底 0b564d7；測試儀表與合成影片均在 Git 忽略的 tmp/performance-audit/。正式站只讀，未操作投票、名單或活動狀態。

### 測得與確認
- 首頁程式引用的 9 個 PNG 合計 17,737,169 bytes（17.74 MB／16.92 MiB）；HTML/JS/CSS 所檢查檔案合計 128,291 bytes，不含外部字型或參賽照片。古堡 2.82 MB、正面 Luna 2.78 MB、角色圖集 2.77 MB、銘牌 2.18 MB。這是引用檔案盤點，不是瀏覽器冷快取傳輸總量。
- 正式 HTTP 單次抽樣：首頁回應完成 392 ms；古堡 PNG 809 ms；幽靈 PNG 776 ms；API 244 ms，皆 200。不可視為完整頁面 LCP 或所有網路的平均值。Pages cache-control max-age=600；API no-store。
- 隔離本機、前景內建瀏覽器、1280×720、只保留單一測試頁：待機初段 11.2 fps／暫停動畫 83 fps；甦醒樣本 9 fps、p95 幀間隔 166.6 ms。空白儀表頁 81.4 fps。捲到選手區仍有 65 個 CSS/Web Animations 運作，初段約 20.3 fps。僅停用 Hero 濾鏡／陰影的對照約 12.9 fps，不能將瓶頸完全歸因於光暈。單次環境測試，不等同 Chrome／Safari 真機數字。
- 程式確認：magic.js 離開 Hero 後仍排程清畫布／讀位置；awakening.js 同一幀多次矩陣讀取並交錯寫入；live.js 每 10 秒無條件重建全部選手卡片。燈箱 DOM 不在該重建範圍，不能誤稱此輪詢會重置播放影片。
- 正式公開資料沒有影片，故未測正式影片起播、Storage 影片頻寬或 iPhone 真機。合成 12 秒／60 fps 來源經現有轉檔輸出 H.264、1080×608、約 1.16 MB／0.77 Mbps，保留 60 fps。測試不含音軌，不代表手機聲音／HDR／直式錄影已驗證。
- 內建瀏覽器合成片掉格：古堡動畫開啟時 401/536（播放到 8.83 秒）；暫停背景後 393/720；獨立無古堡播放器仍 462/724；30 fps 對照 156/360。時間窗口不同且獨立基線也差，不能用這些比例斷言正式播放器缺陷或推算改善幅度。需要一般 Chrome／iPhone Safari 交叉驗收。

### 建議優先順序（提案，尚未實作）
1. 圖片依實際顯示尺寸重製 WebP/AVIF、保留透明邊緣；Hero 核心資源優先，其餘分批載入；參賽圖使用縮圖及延後載入。
2. 離開 Hero、打開影片燈箱時暫停背景動畫與粒子；進入視野再恢復，尊重使用者原有暫停狀態。
3. 快取每幀共同座標矩陣、批次讀寫；檢查大型 SVG 圖集裁切與反覆重繪，光暈層盡量用透明度變化，低效能裝置降低粒子量。
4. 僅更新實際變動的活動／卡片欄位，避免 10 秒整批重建。
5. 影片沿用已具備的 H.264/AAC、faststart、按需建立播放器；評估展示用 30 fps 與位元率上限，再以實際錄影及目標瀏覽器驗收。暫不需要因三位選手就直接引入串流服務。

參考：[MDN 圖片格式](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)、[web.dev 動畫效能](https://web.dev/articles/animations-and-performance?hl=en)。

## 2026-10-29 · v1.15 效能優化（待發布）
- Local：D:/Codex-Projects/lumens-halloween，main，起點 0b564d7；未建立 worktree。前端 1.15.0，API 保持 1.14.0。
- 12 張無損 WebP（含五個角色裁切）替代八張 runtime PNG；17,722,271 → 11,801,436 bytes（-33.4%）。每張 alpha 與所有可見像素逐一比對相同；原圖未改，原 Logo 未改。
- 新增可視性排程、光球 transform／座標讀取共用、卡片增量更新及 lazy/async 照片；所有光暈、粒子數及影片編碼參數保留。
- 本機 check、29 項測試（含真實 MOV 轉檔、像素比對、可視性與手動暫停）及 build 通過。
- 單一 IAB、1280×720、前景、本機合成資料：idle 約 22.6 fps，甦醒約 24.9 fps；投票區約 62–82 fps。不同觀測時長／桌面負載，僅診斷參考，不能當標準 benchmark。畫面外運作動畫降為 1，影片燈箱背後 0。
- 12 秒 60 fps 合成影片完整播放：720 frames／376 dropped／0 corrupted；UI RAF 約 57.7 fps。對照前次暫停背景 393 dropped，環境仍有大量掉幀，不宣稱消除影片掉幀或實機 60 fps。
- 瀏覽器確認媒體切換、定時更新保留照片 2、手動暫停跨離開 Hero／開關燈箱後仍保留，返回可恢復；390×844 手機 Hero 範圍正常；未發現前端 console 錯誤。
- 正式活動未重設、未試投、未變更參賽者；部署紀錄待補。

### v1.15 發布完成（2026-10-29）
- 功能 commit／tag：6a95588／v1.15；已推送 main 與 tag。
- GitHub Validate application：40727594538、40727594656 成功；Pages：40727644547 成功。
- 正式站 8 個程式檔及 12 張 WebP 共 20 檔與本機逐檔相符；API HTTP 200、1.14.0。未部署或修改 Firebase。
- 正式瀏覽器完整甦醒後回復 hero 未喚醒 class、入場內容維持展開，無缺圖及 console error；截圖 outputs/v115/production.png（本機忽略）。
- 補測演出中途手動暫停：時間固定 355ms，恢復後接續 454ms，沒有把暫停時間算入演出。
- 已完成發布；實際參賽影片與現場設備尚未提供，仍待實機播放驗收，不能宣稱所有裝置無掉幀。

## 2026-10-29 · v1.16 Hero 按鈕調整（待發布）
- 來源：使用者核准副標右側喚醒、下方投票、手機說明下方排列，以及移除底部重播連結；明確授權測試後提交／推送／上線。
- Local main，D:/Codex-Projects/lumens-halloween，起點 81c3c54；無 worktree、初始工作目錄乾淨。前端 1.16.0／API 1.14.0。
- 桌面以 hero-intro 兩欄對齊，預留投票位置；文案組上移避免遮住南瓜。手機單欄，保留原呼吸燈與動畫內容。
- 移除 replayCastle 連結與事件綁定；Hero 可重播，演出結束回到未喚醒狀態，投票內容仍展開；重新整理保留入場。
- check、29 項測試與 build 通過；瀏覽器檢查 1440×900、1280×720、1280×600、390×844，手機無水平溢出，console 無 error。未更動正式活動資料。

### v1.16 發布完成（2026-10-29）
- commit b4bd6a3／tag v1.16 已推送；Pages 40733873839 成功，兩次 CI 40733848390／40733848079 均成功。
- 正式 index.html、hero.css、awakening.js、site-config.js 與本機相符；首次喚醒前後文案區高度同為 457.25px（1440×900），投票入口從隱藏變為可見，無版面跳動。
- 僅 Pages 前端更新，API 保持 1.14.0；未操作正式名單、票數或活動設定。

## 2026-10-29 · v1.17 公告與演出調整（待發布）
- Local main，D:/Codex-Projects/lumens-halloween，起點 53aa89e；初始乾淨，無 worktree。
- 公告左右加入靜態 SVG 枯枝／蛛網／蝙蝠及既有南瓜，古銅雙框；倒數亮南瓜橘，開始時間改台灣時區上午／下午時分。
- 第 3100ms 全亮，4300ms Luna 飛入；後段保持原速，10300ms 開始淡出，11300ms 完成。光球、燈光與角色使用分離時鐘，保留所有粒子、光暈及可視性暫停。
- 呼吸峰值光環加至 4px，外部柔光擴散 8px；入場後仍停止呼吸，hover／減少動態與暫停規則不變。
- check、31 項測試及 build 通過；測試包含全亮後 1200ms 停留、角色後段時間與 1000ms 淡出。瀏覽器確認完整演出收尾回復、入場保留；桌面公告及手機無水平溢出，無 console error。
- 前端 1.17.0，API 保持 1.14.0；未操作正式資料。

### v1.17.1 使用者補充圖層（2026-10-29）
- v1.17 提交後使用者補充「魔女在前景、黑貓在後」；painted.js 將 Luna 移至角色 SVG 最後繪製，awakening 保留此順序。
- 前端追加 1.17.1，不改寫既有 v1.17 tag。31 項測試、check、build 再次通過；瀏覽器巡航與施法時 cat layer 6／Luna layer 14，Luna 在前。

### v1.17.1 發布完成（2026-10-29）
- 公告／節奏 commit ed9ec2e（v1.17），前景補充 commit a2f3551（v1.17.1），皆已推送；最終前端版本 1.17.1。
- Pages 40736570022 成功，CI 40736568499／40736568388 成功；正式六個修改檔與本機相符。
- 正式站完整演出收尾回復，公告顯示「開始：下午 3:00 · 投票 30 分鐘」且倒數正常。純前端部署，未變更正式活動資料或 Firebase。

## 2026-10-29 · v1.18 載入／Luna／放大視窗（待發布）
- Local main，D:/Codex-Projects/lumens-halloween，起點 bde8f6b；初始乾淨，無 worktree。前端 1.18.0／API 1.14.0。
- 背景 preload 提前、高優先，角色等待背景解碼再以去重三工作者處理；下方公告圖片 lazy。原有無損素材未更動，不能宣稱減少圖片 bytes 或所有網路都加快。
- Hero 全部必要圖片與字型完成前顯示準備中，按鈕隱藏且 disabled，程式另有守門；圖片 20 秒逾時可重試，載入中停止動畫運算。
- 隔離本機故意令 sprite-witch 回傳 503：顯示失敗重試、沒有喚醒入口；恢復素材並按重試後，hero-ready=true、pending data-src=0、按鈕啟用。無正式資料操作。
- 全亮後 800ms 才飛入；到位 5400ms、停穩 200ms、轉正面 350ms、5950ms 開始集氣。總長 10450ms＋1000ms 淡出，仍保留前景層級。
- 燈箱只有變裝名稱及縮圖／切換，移除介紹、序號、額外姓名；照片完整比例。1280×720 桌面／390×844 手機驗收、影片播放前進及下一張正常；手機媒體區約 710.93px，extra description/count=0。
- check、35 項測試、build 通過（含背景優先／去重／並行限制、實際 decode 等候、失敗與逾時、到位後轉向／集氣順序、0.8 秒等待、1 秒淡出、像素一致性與原投票規則）。正式部署待補。

### v1.18 發布完成（2026-10-29）
- commit 93fd630／tag v1.18 已推送；Pages 40739884867 成功，CI 40739884792／40739884663 成功。
- 正式九個主要檔案逐檔與本機相符；瀏覽器首次呈現「古堡準備中…」，完成後 hero-ready=true、pending image=0、按鈕啟用，再成功啟動演出。
- 本次純前端發布，API 仍為 1.14.0；未操作正式名單、票數、活動設定或影片轉檔品質。
- 正式演出完成後按鈕恢復可用；公告已為「由福委會統一公布」。實際選手照片燈箱僅有變裝名稱與切換縮圖，無介紹／媒體序號，console 無 error；截圖 outputs/v118/lightbox.png（本機忽略）。
## v1.19 本機驗收（2026-10-29）
來源：本次使用者載入進度／效能優化授權與 Luna 追加調整。Local main，D:/Codex-Projects/lumens-halloween；基底 7299dbf。
- 已完成真實素材完成進度、四工作者／字型並行、保留成功素材重試；原素材完全未改。
- 全亮等待 0.6 秒；Luna 正面保持到最後南瓜結束，演出 12.7 秒＋1 秒淡出。
- npm run check、npm test（36/36）、npm run build 與 git diff --check 通過，含原圖可見像素／透明度比對。
- 隔離本機瀏覽器首次準備 488ms、再次開啟 380ms；圖片 transferSize 從 11,820,234 bytes 降為 0，為本機單次驗證，非正式網路效能保證。
- 控制素材 503：進度停留 92%，重試後接續 100% 且按鈕可用；延遲 9 秒素材確認真實等待。手機寬度 375px 無水平溢出。演出完成回復正常；第 10 秒 Luna 仍固定正面於塔前。
- 部署待本次提交推送後驗證；API 維持 1.14.0，無後端或正式資料操作。

### v1.19 正式部署驗證（2026-10-29）
- 發布 commit de8de05，tag v1.19；Pages workflow 40742840023 成功，CI 40742814492／40742814115 成功。
- 正式 index、hero-assets、hero.css、motion、awakening、painted、live、live.css、site-config 與本機發布內容一致。
- 正式瀏覽器看到 7% 載入進度，完成至 100% 後喚醒按鈕可用；重新整理同樣完成至 100%。未提交任何票或修改正式活動資料。
- 截圖 outputs/v119/production.png、outputs/v119/mobile-progress.png（後者實際為桌面慢速載入圖）為 Git 忽略的本機驗證輸出。
## v1.20 本機驗收（2026-10-29）
來源：本次使用者 Hero 文案配色、立體陰影與南瓜前後景授權。Local main，D:/Codex-Projects/lumens-halloween；基底 167f2b8。
- 副標橘金漸層、說明淡薰衣草紫及立體深色陰影完成；南瓜前中後景共 30 顆，前景 6 顆，未增加下載素材。
- npm run check、npm test（38/38）、npm run build、git diff --check 通過；含旋轉前景南瓜全路徑臉部保護區碰撞檢查與無損素材比對。
- 本機桌面／375px 手機版視覺驗收，無水平溢出；9.72 秒定格確認 Luna 臉部清楚、前景南瓜掠過披風附近。暫停後可繼續演出，演出長度仍 12.7＋1 秒。
- 截圖 outputs/v120/pumpkin-depth.png 為忽略的本機驗證產物；正式部署待本次推送後驗證。API 1.14.0 不變，未修改正式資料。

### v1.20 正式部署驗證（2026-10-29）
- 發布 commit 13c55b5、tag v1.20；Pages 40745816095 成功，CI 40745814398／40745813702 成功。
- 正式前端九個核對檔案與本機一致；瀏覽器確認新文字配色、準備完成才顯示按鈕，以及後景 12／中景 12／前景 6 顆分層。
- 本機演出結束後所有粒子 opacity 歸零、Luna 恢復巡航、按鈕解除停用。未更動正式資料或後端。
## v1.20.1 前景加強驗收（2026-10-29）
來源：使用者延續 v1.20 要求前景更明顯；沿用測試後提交推送部署授權。Local main，基底 0b639d7。
- 前景 15／中景 5／後景 10；前景尺寸 76–132，原素材、總量、時長不變。
- npm run check、npm test（38/38）、npm run build、git diff --check 通過；含每 5ms 旋轉外接範圍避臉檢查。
- 本機 9.714 秒定格確認較多大南瓜出現在披風／掃帚前方，Luna 臉部清楚；截圖 outputs/v1201/depth.png。待推送後核對正式部署。
