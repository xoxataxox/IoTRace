-- 創建名為 LoRa_race 的資料庫
CREATE DATABASE `LoRa_race`;

-- 創建名為 LoRawan_packet 的表格，用於儲存 LoRaWAN 封包資訊
CREATE TABLE `LoRa_race`.`LoRawan_packet` (
  `get_time` DATETIME NOT NULL,  -- 封包收到的時間
  `gwip` VARCHAR(15) NOT NULL,    -- 網關 IP 位址
  `rssi` VARCHAR(5) NOT NULL,     -- 接收信號強度指示
  `macAddr` VARCHAR(20) NOT NULL, -- 裝置 MAC 位址
  `auto_number` INT NOT NULL AUTO_INCREMENT, -- 自增主鍵
  PRIMARY KEY (`auto_number`)     -- 主鍵
);

-- 創建名為 racer_info 的表格，用於儲存賽手資訊
CREATE TABLE `LoRa_race`.`racer_info` (
  `racer_name` VARCHAR(50) NOT NULL,    -- 賽手姓名
  `racer_id` INT NOT NULL AUTO_INCREMENT, -- 賽手 ID，自增主鍵
  `macAddr` VARCHAR(20) NOT NULL,       -- 裝置 MAC 位址
  `turns` INT,                           -- 圈數
  `time_avg` TIME,                       -- 平均時間
  `race_id` INT NOT NULL,                -- 賽事 ID
  PRIMARY KEY (`racer_id`)               -- 主鍵
);

-- 創建名為 race_info 的表格，用於儲存賽事資訊
CREATE TABLE `LoRa_race`.`race_info` (
  `race_id` INT NOT NULL AUTO_INCREMENT, -- 賽事 ID，自增主鍵
  `race_name` VARCHAR(50) NOT NULL,      -- 賽事名稱
  PRIMARY KEY (`race_id`),                -- 主鍵
  UNIQUE KEY `unique_race_name` (`race_name`) -- 唯一鍵
);

-- 創建名為 account_info 的表格，用於儲存帳號資訊
CREATE TABLE `LoRa_race`.`account_info` (
  `account_id` INT NOT NULL AUTO_INCREMENT, -- 帳號 ID，自增主鍵
  `username` VARCHAR(50) NOT NULL,         -- 使用者名稱
  `password` VARCHAR(50) NOT NULL,         -- 密碼
  PRIMARY KEY (`account_id`),               -- 主鍵
  UNIQUE KEY `unique_username` (`username`) -- 唯一鍵
);

-- 向 account_info 表格插入初始帳號資訊
INSERT INTO `LoRa_race`.`account_info` (`username`, `password`) VALUES ('user', 'password');
