import pandas as pd
import sqlite3

conn2 = sqlite3.connect('pm_database2.db')
new_df = pd.read_sql_query("SELECT * FROM CAMPUS_PM",conn2)


# df = new_df['TIMESTAMP','PM25_CONC']
print(new_df.columns[0:5])

conn2.close()