import pandas as pd
import sqlite3

conn2 = sqlite3.connect('pm_database2.db')
new_df = pd.read_sql_query("SELECT * FROM CAMPUS_PM",conn2)

print(new_df['TIMESTAMP','PM25_CONC'].tail(10))

conn2.close()
