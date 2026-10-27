# 正式上線接續

日期：2026-10-27。來源：使用者核准公開 repository、30 分鐘與暫停凍結。

- 路徑：D:/Codex-Projects/lumens-halloween；main；Local，無額外 worktree。
- 本文件隨第一個功能提交保存；以 git log 確認實際 commit。
- 完成：古堡動畫、公開展示、三位參賽者後台、照片上傳處理、工號一票、活動控制、人工公布；GitHub repository 與 Firebase / Firestore 已建立。
- 驗證：10 項 Node 測試、語法與建置通過；瀏覽器登入、活動時間儲存成功。HTTP 私有路徑回傳 404，未登入後台 API 回傳 401，公開活動不回傳票數或工號。照片選擇器、Firestore 併發及雲端完整流程尚未實測。
- 私有設定與名單僅在忽略的 private/，不能提交、記錄值或自動複製到公開網站。
- 下一步：使用者完成 Firebase Blaze 計費連結後，按 [部署文件](../deployment.md) 設定 Storage、Secrets、Functions 與 Pages；隔離測試後匯入正式資格與三位正式參賽者。
- 待提供：三位參賽者公開名稱、造型名稱、照片、可選介紹。
- 限制：工號不能證明本人；本機資料不自動同步雲端；結束不可重新開始，正式活動不能拿來做結束測試。
