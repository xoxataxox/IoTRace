const http = require('http'); // 引入 HTTP 模塊
const fs = require('fs'); // 引入文件系統模塊
var express = require("express"); // 引入 Express 框架
var router = express.Router(); // 創建一個新的路由器實例
const { exec } = require('child_process'); // 引入子進程模塊
const cors = require('cors'); // 引入跨域請求處理模塊
const restartPythonScript = require('../callpy'); // 引入重新啟動 Python 腳本的自定義模塊

// 身份驗證中間件，檢查用戶是否已登錄，未登錄則重定向到登錄頁面
function checkLoggedIn(req, res, next) {
    if (req.session.username) {
      next();
    } else {
      res.redirect("/login");
    }
}
router.use(checkLoggedIn); // 將中間件應用於路由

// GET 請求路由，用於顯示 mqttpage 頁面
router.get("/", (req, res) => {
    const filePath = 'mqttdata.json'; // 定義 JSON 文件的路徑

    // 讀取 JSON 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('讀取檔案時出錯：', err);
            res.status(500).send('伺服器錯誤');
            return;
        }

        try {
            // 將 JSON 資料解析為 JavaScript 物件
            const jsonData = JSON.parse(data);

            // 渲染 mqttpage.ejs 模板並將資料傳遞給模板
            res.render("mqttpage", { mqttData: jsonData });
        } catch (error) {
            console.error('解析 JSON 時出錯：', error);
            res.status(500).send('伺服器錯誤');
        }
    });
});

// POST 請求路由，用於接收並處理來自客戶端的數據
router.post('/receive_data', cors(), (req, res) => {
    let data = req.body; // 從請求主體中獲取數據

    try {
        //const formData = JSON.parse(data);
        const formData = data;

        // 將數據寫入 JSON 文件
        fs.writeFile('mqttdata.json', JSON.stringify(formData, null, 4), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                res.status(500).send('Error writing JSON file');
            } else {
                console.log('JSON file updated successfully!');
                restartPythonScript(); // 調用重新啟動 Python 腳本的函數
                res.status(200).send('Data received and JSON file updated successfully!');
            }
        });
        //restartPythonScript(); // 重新啟動 Python 腳本
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).send('Error parsing JSON data');
    }
});

module.exports = router; // 導出路由器對象，以便在 Express 應用中使用
