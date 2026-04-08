var express = require("express"); // 引入 Express 框架
var router = express.Router(); // 創建一個新的路由器實例

// 身份驗證中間件，檢查用戶是否已登錄，未登錄則重定向到登錄頁面
function checkLoggedIn(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
}
router.use(checkLoggedIn); // 將中間件應用於路由

// GET 請求路由，用於顯示 secondPage 頁面
router.get("/", function (req, res, next) {
  res.render("secondPage", { title: "Second Page" }); // 渲染 secondPage.ejs 模板
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
