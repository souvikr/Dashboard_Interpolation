import pandas as pd
import sqlite3

conn2 = sqlite3.connect('pm_database2.db')
new_df = pd.read_sql_query("SELECT * FROM CAMPUS_PM",conn2)

df = pd.DataFrame(new_df['TIMESTAMP'],new_df['PM25_CONC'])
print(df.tail(10))


conn2.close()
