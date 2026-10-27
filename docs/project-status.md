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
