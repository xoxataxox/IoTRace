const express = require("express");
const router = express.Router(); // 創建一個新的路由器實例
const db = require("../db"); // 引入數據庫操作模塊

var RaceName; // 用於存儲賽事名稱的變量

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
  res.render("frontpage1"); // 返回名為 'frontpage1' 的模板
});

// 定義 GET 請求的路由處理函式，處理 '/getRacerMAC' 路由
router.get("/getRacerMAC", (req, res) => {
  const Time = req.query.variable; // 從請求中獲取時間變量
  const allMAC = "SELECT DISTINCT macAddr FROM LoRawan_packet WHERE get_time >= ?";
  
  // 查詢數據庫中符合條件的 MAC 地址
  db.query(allMAC, [Time], (err, result) => {
    if (err) {
      console.error("Error reloading lorawan_packet: " + err.stack);
      return res.status(500).send("Error reloading lorawan_packet");
    }
    // 將結果以 JSON 格式返回
    res.json(result);
  });
});

// 定義 POST 請求的路由處理函式，處理 '/postData' 路由
router.post('/postData', (req, res) => {
  const receivedData = req.body; // 從請求主體中獲取數據
  RaceName = receivedData.RaceName; // 從收到的數據中提取賽事名稱
  var RacerInfo = receivedData.RacerInfo; // 從收到的數據中提取選手信息
  var RacerInfoCount = Object.keys(RacerInfo).length; // 計算選手信息的數量
  
  const race_info = "INSERT INTO race_info (race_name) VALUES (?)"; // 插入賽事信息的 SQL 語句
  const Race_ID = "SELECT race_id FROM race_info WHERE race_name = ?"; // 查詢賽事 ID 的 SQL 語句
  const racer_info = "INSERT INTO racer_info (racer_name, macAddr, race_id) VALUES (?,?,?)"; // 插入選手信息的 SQL 語句
  
  // 執行賽事信息插入操作
  db.query('SELECT * FROM race_info WHERE race_name = ?', [RaceName], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' }); // 如果查詢時出錯，返回錯誤給客戶端
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: 'Duplicate race name' }); // 如果已存在相同的 race_name，返回錯誤給客戶端
      return;
    }
    // 如果資料庫中沒有相同的 race_name，則執行插入操作
    db.query(race_info, [RaceName], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' }); // 如果插入時出錯，返回錯誤給客戶端
        return;
      }
    });

    // 查詢剛插入的賽事的 ID
    db.query(Race_ID, [RaceName], (err, result) => {
      if (err) {
        console.error("Error reloading lorawan_packet: " + err.stack);
        return res.status(500).send("Error reloading lorawan_packet");
      }
      var RaceID = JSON.parse(JSON.stringify(result));
      RaceID = RaceID[RaceID.length - 1].race_id; // 獲取最後一個賽事的 ID
      // 將選手信息逐一插入數據庫
      for (var i = 0; i < RacerInfoCount; i++) {
        var macAddr = RacerInfo[i].MAC;
        var racer_name = RacerInfo[i].Name;
        db.query(racer_info, [racer_name, macAddr, RaceID], (err, result) => {
          if (err) {
            console.error("Error reloading lorawan_packet: " + err.stack);
            return res.status(500).send("Error reloading lorawan_packet");
          }
        });
      }
      res.json({ RaceID: RaceID }); // 返回成功消息給客戶端，包含新建的賽事 ID
    });
  });

});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
