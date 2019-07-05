import pandas as pd
import sqlite3

conn2 = sqlite3.connect('pm_database2.db')
new_df = pd.read_sql_query("DELETE FROM CAMPUS_PM WHERE TIMESTAMP=0",conn2)


conn2.close()
