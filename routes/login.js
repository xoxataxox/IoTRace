var express = require("express"); // 引入 Express 框架
var router = express.Router(); // 創建一個新的路由器實例
var db = require("../db"); // 引入數據庫操作模塊

// GET 請求路由，用於顯示登錄頁面
router.get("/", function (req, res, next) {
  res.render("login", { title: "Login", error: null }); // 渲染 'login' 模板，並將 title 和 error 傳遞給模板
});

// POST 請求路由，用於處理登錄表單提交
router.post("/", function (req, res, next) {
  var username = req.body.username; // 從請求主體中獲取用戶名
  var password = req.body.password; // 從請求主體中獲取密碼

  // 查詢數據庫，驗證用戶名和密碼是否匹配
  db.query(
    "SELECT * FROM account_info WHERE username = ? AND password = ?",
    [username, password],
    function (error, results, fields) {
      if (error) {
        console.error("Error querying database: " + error.stack);
        return res.render("login", {
          title: "Login",
          error: "failed to login", // 如果查詢時出錯，顯示錯誤消息
        });
      }

      if (results.length === 0) {
        return res.render("login", {
          title: "Login",
          error: "failed to login", // 如果用戶名和密碼不匹配，顯示錯誤消息
        });
      }

      req.session.username = username; // 如果驗證成功，設置會話中的用戶名
      res.redirect("/secondPage"); // 重定向到第二個頁面
    }
  );
});

// GET 請求路由，用於用戶登出
router.get("/logout", function (req, res, next) {
  // 銷毀會話數據，實現用戶登出
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    }
    // 重定向到登錄頁面
    res.redirect("/login");
  });
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
