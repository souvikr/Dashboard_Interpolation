#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sqlite3
import requests
import datetime
from requests.auth import HTTPBasicAuth
import io
import pandas as pd
import folium
import time


# In[2]:


#!type nul > pm_database2.db


# In[3]:


conn = sqlite3.connect('pm_database2.db')


# In[4]:


# conn.execute('''CREATE TABLE CAMPUS_PM
#          (TIMESTAMP           TEXT,
#          IMEI            TEXT     NOT NULL,
#          PM25_CONC        INT,
#          PM10_CONC         INT,
#          LAT    TEXT,
#          LONG   TEXT);''')
# print("Table created successfully");


# In[5]:


def live_pm(imei):
    x = datetime.datetime.now() #taking five minutes interval to get current PM
    x2 = datetime.datetime.now() - datetime.timedelta(minutes=5)
    y = str(x)
    y2 = str(x2)
    time = y[:4]+y[5:7]+y[8:10]+y[11:13]+y[14:16]  #extracting yyyymmddhhmm format
    time5minsago = y2[:4]+y2[5:7]+y2[8:10]+y2[11:13]+y2[14:16]
    response = requests.get('http://api.urbansciences.in/devices/raw_api.php?imei='+imei+'&start=201906031730&end=201906031740&interval=1&u=iitgn')
    if response.status_code == 401:
        response = requests.get('http://api.urbansciences.in/devices/raw_api.php?imei='+imei+'&start='+time5minsago+'&end='+time+'&interval=1&u=iitgn', auth=HTTPBasicAuth('atmos', 'urbanData!'))
    urlData = response.content
    rawData = pd.read_csv(io.StringIO(urlData.decode('utf-8'))) #converting to pandas dataframe
    pm25 = rawData[-1:]['pm25conc'].values #displaying the latest PM2.5 value
    pm10 = rawData[-1:]['pm25raw'].values #pm10 values
    if(pm25.size==0):  #if sensor is not sending any data
        return(imei,0,0,0)
    timestamp = str(rawData[-1:].index.values[0])
    pm25 = int(pm25)
    pm10 = int(pm10)
    return(imei,pm25,pm10,timestamp)


# In[6]:


df = pd.read_csv('campus.csv')
df['imei']=df['imei'].astype('str')
df['lat']=df['lat'].astype('str')
df['long']=df['long'].astype('str')


# In[ ]:


while(True):
    values = []
    for i in range(len(df)):
        if(df.iloc[i]['imei']!='868996034800649'):
            im,pm25,pm10,timestamp=live_pm(df.iloc[i]['imei'])
            lat=df.iloc[i]['lat']
            longi=df.iloc[i]['long']
            values.append((timestamp,im,pm25,pm10,lat,longi))
            conn.execute("INSERT INTO CAMPUS_PM                               VALUES (?,?,?,?,?,?)",values[-1])
            print("Row inserted:- "+ str(values[-1]))
    conn.commit()
    time.sleep(600)


# In[ ]:




