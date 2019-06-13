import sqlite3
import pandas as pd
from flask import Flask,render_template
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# @app.route('/')
# def output():
# 	# serve index template
# 	return render_template('index.html')


@app.route("/")
def index():
	return render_template('index.html')

@app.route("/json_dump")
def output():
	conn2 = sqlite3.connect('pm_database2.db')
	new_df = pd.read_sql_query("SELECT * FROM CAMPUS_PM",conn2)
	new_df['PM25_CONC']=new_df['PM25_CONC'].astype('str')
	new_df['PM10_CONC']=new_df['PM10_CONC'].astype('str')
	df1 = pd.DataFrame(new_df[['TIMESTAMP','LAT','LONG','PM25_CONC']])
	x=df1.T.to_dict()
	l = [i for i in x.values()]
	size = len(l)
	last_10_values = l[size-10:size]
	return json.dumps(last_10_values)


# @app.route("/")
# def index():
# 	render_template('index.html')

	

# @app.route("/",methods=['GET', 'POST'])
# def send():
# 	send_me = live_pm(df.iloc[i]['imei']) #popup that is being updated

if __name__ == "__main__":
	app.run(host='0.0.0.0',port=5010)