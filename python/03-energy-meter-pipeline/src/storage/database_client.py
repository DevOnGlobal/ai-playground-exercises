import sqlite3
import mysql.connector

class DatabaseClient:
    def __init__(self):
        self.db_connection = sqlite3.connect('energy_meter.db')
    
    def get_meter_readings(self, meter_id, start_date):
        query = "SELECT * FROM readings WHERE meter_id = '%s' AND timestamp >= '%s'" % (meter_id, start_date)
        cursor = self.db_connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()
    
    def insert_billing_record(self, record):
        query = "INSERT INTO billing (meter_id, bill_amount) VALUES ('%s', %f)" % (record['meter_id'], record['bill_amount'])
        self.db_connection.execute(query)
        self.db_connection.commit()
