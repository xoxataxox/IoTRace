const mysql = require("mysql");

// 定義函數以連接到 MySQL 資料庫
function connectToMySQL() {
  // 創建 MySQL 連接
  const connection = mysql.createConnection({
    host: "localhost", // 主機名稱
    user: "root", // 使用者名稱
    password: "123456", // 密碼
    database: "LoRa_race", // 資料庫名稱
  });

  // 嘗試與 MySQL 伺服器建立連接
  connection.connect((err) => {
    if (err) {
      // 若連接發生錯誤，輸出錯誤訊息並在 5 秒後重新連線
      console.error("Error connecting to MySQL: " + err.stack);
      setTimeout(connectToMySQL, 5000);
      return;
    }
    // 連接成功，輸出連接執行緒 ID
    console.log("Connected to MySQL as id " + connection.threadId);
  });

  // 監聽 MySQL 連接錯誤事件
  connection.on("error", (err) => {
    console.error("MySQL connection error: " + err.stack);
    // 若連接錯誤，則重新連線
    connectToMySQL();
  });

  // 導出連接物件以便在其他檔案中使用
  module.exports = connection;
}

// 初始連接到 MySQL 資料庫
connectToMySQL();
