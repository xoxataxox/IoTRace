const express = require("express");
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
    const variable = req.query.variableName;
    // 查詢指定賽事的選手信息
    const sql = "SELECT macAddr,racer_name FROM racer_info WHERE race_id=?";
    // 查詢指定賽事的賽事名稱
    const sql2 = "SELECT race_name FROM race_info WHERE race_id=?";
    // 執行 SQL 查詢操作
    db.query(sql, [variable], (err, racerInfoResult) => {
        if (err) {
            console.error("Error querying racer_info: " + err.stack);
            return res.status(500).send("Error querying racer_info");
        }
        // 執行 SQL 查詢操作
        db.query(sql2, [variable], (err, raceNameResult) => {
            if (err) {
                return res.status(500).send("Error querying racer_info");
            }
            // 將選手信息和賽事名稱作為數據傳遞到前端模板 'frontpage2'
            res.render("frontpage2", { data: racerInfoResult, data2: raceNameResult });
        });
    });
});

// 定義 GET 請求的路由處理函式，處理 '/reloadMqttData' 路由
router.get("/reloadMqttData", (req, res) => {
    const Time = req.query.Time;
    const mqtt = "SELECT * FROM lorawan_packet WHERE get_time >= ?";
    // 查詢指定時間之後的 MQTT 數據
    db.query(mqtt, [Time], (err, result) => {
        if (err) {
            console.error("Error reloading lorawan_packet: " + err.stack);
            return res.status(500).send("Error reloading lorawan_packet");
        }
        // 將結果以 JSON 格式返回給客戶端
        res.json(result);
    });
});

// 定義 GET 請求的路由處理函式，處理 '/reloadRacerData' 路由
router.get("/reloadRacerData", (req, res) => {
    const variable = req.query.variable;
    const mqtt = "SELECT * FROM racer_info WHERE race_id=?";
    // 查詢指定賽事的選手信息
    db.query(mqtt, [variable], (err, result) => {
        if (err) {
            console.error("Error reloading racer_info: " + err.stack);
            return res.status(500).send("Error reloading racer_info");
        }
        // 將結果以 JSON 格式返回給客戶端
        res.json(result);
    });
});

// 定義 POST 請求的路由處理函式，處理 '/postData' 路由
router.post('/postData', (req, res) => {
    const receivedData = req.body; // 從請求主體中獲取數據
    var RacerCount = Object.keys(receivedData).length; // 計算收到的數據中的選手數量
    const sql = "UPDATE racer_info SET turns=?, time_avg=? WHERE macAddr=? AND Race_id=?";
    // 更新選手信息的 SQL 語句

    // 遍歷收到的數據，進行更新操作
    for (var i = 0; i < RacerCount; i++) {
        var macAddr = receivedData[i].MAC;
        var racer_name = receivedData[i].Name;
        var Race_ID = receivedData[i].Race_ID;
        var Turns = receivedData[i].Turns;
        if (Turns === undefined || Turns === null || Turns === '') Turns = 0;
        var Time = receivedData[i].Time;
        if (Time === undefined || Time === null || Time === '') Time = "00:00:00";
        // 執行 SQL 更新操作
        db.query(sql, [Turns, Time, macAddr, Race_ID], (err, result) => {
            if (err) {
                console.error("Error reloading lorawan_packet: " + err.stack);
                return res.status(500).send("Error reloading lorawan_packet");
            }
        });
    }
    // 返回成功消息給客戶端
    res.status(200).send("成功");
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
