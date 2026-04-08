# IoTRace

**模擬 IoT 游泳賽事後端專案**

此專案模擬一個游泳比賽系統，使用 IoT 手錶傳送選手資料至中央站點，後端接收資料、儲存至資料庫，並透過 Node.js 建立網頁即時顯示排名和統計。

---

## 功能

- 接收選手手錶資料（時間、心率、站點 IP、MAC 地址） via MQTT
- 將資料處理後存入 MySQL 資料庫
- 網站登入系統，帳號密碼驗證
- 設定賽事資訊與站點 IP、順序、RSSI 限制
- 開始/暫停賽事，計算選手圈數、平均時間及排名
- 顯示歷史賽事資料

---

## 使用技術

- **後端**：Node.js + Express  
- **資料庫**：MySQL  
- **資料處理**：Python  
- **即時通訊**：MQTT（模擬資料）  
- **前端**：EJS

---


## 注意
本專案使用模擬資料，未包含任何真實專案或敏感資訊
MQTT 設定為假值，可自由修改以連接測試環境

## 使用說明
1.請先到根目錄內的db.js修改為自己的DataBase

2.請先到根目錄內的pymqttsql的sqlsave含式內修改為自己的DataBase

3.python需安裝以下兩個函式庫

#pip install paho-mqtt

#pip install pymysql

4.資料庫建立的範例SQL語法在根目錄內的LoRa_race.sql

5.詳細操作手冊pdf在docs裡，包含ER_model
