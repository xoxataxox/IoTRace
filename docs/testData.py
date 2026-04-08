import paho.mqtt.client as mqtt
import json
import pymysql
import time
from datetime import datetime
import json

def gettime():
    time1=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
    return time1

def main():
    rssi1=-40
    rssi2=-110
    rssi1_D=-10
    rssi2_D=-10

    rssi1_2=-70
    rssi2_2=-80
    rssi1_2_D=-10
    rssi2_2_D=10
    ip=["192.168.0.21","192.168.0.22"]
    while(1):
        if (rssi1==-110):
            rssi1_D=10
        if (rssi1==-40):
            rssi1_D=-10
        if (rssi2==-110):
            rssi2_D=10
        if (rssi2==-40):
            rssi2_D=-10

        if (rssi1_2==-110):
            rssi1_2_D=10
        if (rssi1_2==-40):
            rssi1_2_D=-10
        if (rssi2_2==-110):
            rssi2_2_D=10
        if (rssi2_2==-40):
            rssi2_2_D=-10

        rssi1=rssi1+rssi1_D
        rssi2=rssi2+rssi2_D

        rssi1_2=rssi1_2+rssi1_2_D
        rssi2_2=rssi2_2+rssi2_2_D
        print("裝置A的rssi數值:",rssi1)
        sqlsave(gettime(),ip[0],rssi1,"00000000a0000001")
        sqlsave(gettime(),ip[0],rssi1_2,"00000000a0000002")
        time.sleep(1)
        print("裝置B的rssi數值:",rssi2)
        sqlsave(gettime(),ip[1],rssi2,"00000000a0000001")
        sqlsave(gettime(),ip[1],rssi2_2,"00000000a0000002")
        time.sleep(1)
        #print(gettime(),ip[0],rssi1,"00000000a0000001")
        #time.sleep(1)
        #print(gettime(),ip[1],rssi2,"00000000a0000001")
        #time.sleep(1)

def sqlsave(time,ip,rssi,macaddr):
    db = pymysql.connect(host="localhost", user="root", password="123456", database="lora_race", charset='utf8')
    cursor = db.cursor()
    try:
        # Convert ISO 8601 timestamp to datetime object
        
        sql = "INSERT INTO lorawan_packet (get_time, gwip, rssi, macAddr) VALUES (%s, %s, %s, %s);"
        cursor.execute(sql, (time, ip, rssi, macaddr))
        db.commit()
        print("Save success")
    except Exception as e:
        print("failed:", e)
    finally:
        db.close()

if __name__ == '__main__':
    main()