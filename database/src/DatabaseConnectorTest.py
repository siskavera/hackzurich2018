import unittest
from database.src.DatabaseConnector import DatabaseConnector
import mysql.connector

class DatabaseConnectorTest(unittest.TestCase):
    def testConnectivity(self):
        foodType = 'my special flour'
        cost = 2.5

        cnx = mysql.connector.connect(host='172.17.0.2', user='root', password='123')
        cursor = cnx.cursor()
        cursor.execute('use food;')
        cursor.execute('insert into environmental_cost (food_type, kg_co2_per_kg) values ("{}",{});'.format(foodType, cost))
        cursor.execute('commit;')

        costFromDb = DatabaseConnector.get(foodType)
        self.assertEqual(costFromDb,cost)

        cursor.execute('delete from environmental_cost where food_type="{}";'.format(foodType))
        cursor.execute('commit;')


if __name__ == '__main__':
    unittest.main()
