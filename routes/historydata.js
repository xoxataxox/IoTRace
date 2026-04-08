const express = require("express"); // 引入 Express 框架
const router = express.Router(); // 創建一個新的路由器實例
const db = require("../db"); // 引入數據庫操作模塊

// 中間件函式，用於檢查用戶是否已登錄
function checkLoggedIn(req, res, next) {
  if (req.session.username) { // 如果已登錄
    next(); // 繼續執行下一個中間件或路由處理函式
  } else {
    res.redirect("/login"); // 如果未登錄，重定向到登錄頁面
  }
}

// 將 checkLoggedIn 中間件應用於所有路由
router.use(checkLoggedIn);

// 定義 GET 請求的路由處理函式，處理根路由 '/'
router.get("/", (req, res) => {
  res.render("historydata"); // 渲染 'historydata' 模板
});

// 定義 GET 請求的路由處理函式，處理 '/getraceInfo' 路由
router.get("/getraceInfo", (req, res) => {
  const race_info = "SELECT * FROM race_info ORDER BY race_id";

  // 查詢所有賽事信息
  db.query(race_info, (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      return res.status(500).send("Error querying database");
    }

    res.json(result); // 將結果以 JSON 格式返回給客戶端
  });
});

// 定義 GET 請求的路由處理函式，處理 '/getracerData' 路由
router.get("/getracerData", (req, res) => {
  const variable = req.query.variable;
  const racer_info = "SELECT macAddr,racer_name,turns,time_avg FROM racer_info where race_id=?";

  // 查詢指定賽事的選手信息
  db.query(racer_info, [variable], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      return res.status(500).send("Error querying database");
    }

    res.json(result); // 將結果以 JSON 格式返回給客戶端
  });
});

// 定義 GET 請求的路由處理函式，處理 '/deleteRacerData' 路由
router.get("/deleteRacerData", (req, res) => {
  const variable = req.query.variable;
  const variable2 = req.query.variable2;

  const delete_racer_info = "DELETE FROM racer_info WHERE macaddr=? AND race_id=?";

  // 刪除指定選手的賽事信息
  db.query(delete_racer_info, [variable, variable2], (err, result) => {
    if (err) {
      console.error("Error querying database: " + err.stack);
      return res.status(500).send("Error querying database");
    }

    res.json(result); // 將結果以 JSON 格式返回給客戶端
  });
});

// 定義 POST 請求的路由處理函式，處理 '/postData' 路由
router.post("/postData", (req, res) => {
  const receivedData = req.body; // 從請求主體中獲取數據
  var RacerCount = Object.keys(receivedData).length; // 計算收到的數據中的選手數量
  const sql = "UPDATE racer_info SET turns=?, time_avg=?, racer_name=? WHERE macAddr=? AND race_id=?";

  // 遍歷收到的數據，進行更新操作
  for (var i = 0; i < RacerCount; i++) {
    var macAddr = receivedData[i].macAddr;
    var racer_name = receivedData[i].Name;
    var Turns = receivedData[i].Turns;
    var Time_avg = receivedData[i].Time_avg;
    var race_id = receivedData[i].race_id;

    // 執行 SQL 更新操作
    db.query(sql, [Turns, Time_avg, racer_name, macAddr, race_id], (err, result) => {
      if (err) {
        console.error("Error reloading lorawan_packet: " + err.stack);
        return res.status(500).send("Error reloading lorawan_packet");
      }
      // 在這裡處理 racer_info 的回調
    });
  }
  res.sendStatus(200); // 返回成功狀態碼給客戶端
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
