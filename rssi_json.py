import sqlite3
import pandas as pd
from flask import Flask
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route("/")
def output():
        new_df = pd.read_csv("RSSI.csv",index_col=0)
        new_df['LAT']=new_df['LAT'].astype('float64')
        new_df['LONG']=new_df['LONG'].astype('float64')
        new_df['RSSI']=new_df['RSSI'].astype('int64')
        x=new_df.T.to_dict()
        l = [i for i in x.values()]
        return json.dumps(l)


# @app.route("/",methods=['GET', 'POST'])
# def send():
# 	send_me = live_pm(df.iloc[i]['imei']) #popup that is being updated

if __name__ == "__main__":
	app.run()