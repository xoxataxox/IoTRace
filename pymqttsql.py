# 匯入必要的模組
import paho.mqtt.client as mqtt
import json
import pymysql
import time
from datetime import datetime
import os

# 獲取當前時間
def gettime():
    time1 = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    return time1

# MQTT 連接設置
def on_connect(client, userdata, flags, respons_code, properties=None):
    if respons_code == 0:
        print('Connection Succeed!') # 連接成功
    else:
        print('Connect Error status {0}'.format(respons_code)) # 連接錯誤
    client.subscribe(topic)

# 接收到消息時的處理函數
def on_message(client, userdata, msg):
    global dddd
    jsondata = json.loads(msg.payload)
    sqlsave(jsondata)

# 主函數
def main():
    # 讀取 MQTT 設置
    config = read_config()
    global topic, host, port, username, password
    host = config.get("hostname")
    port = int(config.get("port"))
    username = config.get("username")
    password = config.get("password")
    topic = config.get("Subscribe_topic")
    
    # 初始化 MQTT 客戶端
    client = mqtt.Client(protocol=mqtt.MQTTv311, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message
    client.username_pw_set(username, password) # 設置 MQTT 使用者名和密碼
    client.connect(host, port, keepalive=60)
    client.loop_forever()

# 將收到的消息存儲到 MySQL 資料庫中
def sqlsave(jsonData):
    # 連接到 MySQL 資料庫
    db = pymysql.connect(host="localhost", user="root", password="123456", database="lora_race", charset='utf8')
    cursor = db.cursor()
    try:
        # 將 ISO 8601 時間戳轉換為 datetime 對象
        time_iso = jsonData[0]['time']
        time_datetime = datetime.fromisoformat(time_iso)
        
        # 執行 SQL 插入語句
        sql = "INSERT INTO lorawan_packet (get_time, gwip, rssi, macAddr) VALUES (%s, %s, %s, %s);"
        cursor.execute(sql, (time_datetime, jsonData[0]['gwip'], jsonData[0]['rssi'], jsonData[0]['macAddr']))
        db.commit()
    except Exception as e:
        print("failed")
    finally:
        db.close()

# 讀取 MQTT 設置
def read_config():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'mqttdata.json')
    with open(file_path, 'r') as f:
        config = json.load(f)
    return config

# 程式入口
if __name__ == '__main__':
    main()
