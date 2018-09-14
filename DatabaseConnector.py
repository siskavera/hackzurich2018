import mysql.connector

class DatabaseConnector:
    _cnx = mysql.connector.connect(host='172.17.0.2', user='root', password='123')
    _cursor = _cnx.cursor()
    _cursor.execute("use food;")

    def get(key):
        DatabaseConnector._cursor.execute('select * from environmental_cost where food_type="{}";'.format(key))
        rows = DatabaseConnector._cursor.fetchall()
        return float(rows[0][1])