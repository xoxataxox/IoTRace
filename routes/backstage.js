const express = require("express");
const router = express.Router(); // 創建一個新的路由器實例
const db = require("../db"); // 引入數據庫操作模塊

// 中間件函式，用於檢查用戶是否已登錄
function checkLoggedIn(req, res, next) {
  if (req.session.username) { // 如果存在用戶名（即已登錄）
    next(); // 繼續執行下一個中間件或路由處理函式
  } else {
    res.redirect("/login"); // 如果未登錄，重定向到登錄頁面
  }
}

// 將 checkLoggedIn 中間件應用於所有路由
router.use(checkLoggedIn);

// 定義 GET 請求的路由處理函式，處理根路由 '/'
router.get("/", (req, res) => {
  res.render("backstage"); // 返回名為 'backstage' 的模板
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
