import sqlite3
import pandas as pd
from flask import Flask
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# @app.route('/')
# def output():
# 	# serve index template
# 	return render_template('index.html')
xy = [
    {
        "lat": 23.21258170523464,
        "long": 72.69130825996399,
        "pm": "23"
    },
     {
        "lat": 23.205122161891754,
        "long": 72.68438816070555,
        "pm": "23"
    },
     {
        "lat": 23.213193043925088,
        "long": 72.68391609191895,
        "pm": "23"
    },
     {
        "lat": 23.214824910115947,
        "long": 72.68479585647583,
        "pm": "23"
    },
    {
        "lat": 23.21034832317748,
        "long": 72.69041776657104,
        "pm": "23"
    }
    ]






@app.route("/")
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
	

# @app.route("/",methods=['GET', 'POST'])
# def send():
# 	send_me = live_pm(df.iloc[i]['imei']) #popup that is being updated

if __name__ == "__main__":
	app.run()