// 引入必要的模組
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

// 引入路由處理程序
var frontpage1Router = require("./routes/frontpage1");
var backStageRouter = require("./routes/backstage");
var usersRouter = require("./routes/users");
var frontpage2Router = require("./routes/frontpage2");
var historydataRouter = require("./routes/historydata");
var loginRouter = require("./routes/login");
var secondRouter = require("./routes/secondPage");
var mqttRouter = require("./routes/mqttpage");

// 建立 Express 應用程式
var app = express();

// 設定視圖引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 從 'public' 目錄提供靜態檔案
app.use("/static", express.static(__dirname + "/public"));

// 中介軟體設置
app.use(logger("dev")); // 日誌中介軟體
app.use(express.json()); // 解析 JSON 主體
app.use(express.urlencoded({ extended: false })); // 解析 URL 編碼的主體
app.use(cookieParser()); // 解析 cookies
app.use(express.static(path.join(__dirname, "public"))); // 提供靜態檔案

// Session 中介軟體設置
app.use(
  session({
    secret: "mySecret", // 用於簽署會話 ID cookie 的密鑰
    name: "user", // 會話 ID cookie 的名稱
    unset: "destroy", // 當會話變為空時取消設定會話
    saveUninitialized: false, // 不保存未初始化的會話
    resave: true, // 強制將會話重新保存到會話存儲中
  })
);

// 路由處理程序
app.use("/", loginRouter);
app.use("/login", loginRouter);
app.use("/secondPage", secondRouter);
app.use("/frontpage1", frontpage1Router);
app.use("/frontpage2", frontpage2Router);
app.use("/historydata", historydataRouter);
app.use("/backstage", backStageRouter);
app.use("/users", usersRouter);
app.use("/mqttpage", mqttRouter);

// 處理 404 錯誤
app.use(function (req, res, next) {
  next(createError(404)); // 將 404 錯誤傳遞給下一個中介軟體
});

// 錯誤處理程序
app.use(function (err, req, res, next) {
  // 在開發模式下僅提供錯誤
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 渲染錯誤頁面
  res.status(err.status || 500);
  res.render("error");
});

// 匯出 Express 應用程式
module.exports = app;
