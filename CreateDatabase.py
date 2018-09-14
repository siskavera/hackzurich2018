from __future__ import print_function

import mysql.connector

cnx = mysql.connector.connect(host='172.17.0.2', user='root', password='123')
cursor = cnx.cursor()
cursor.execute('create database food;')
cursor.execute('use food;')
cursor.execute('create table environmental_cost (food_type varchar(14), kg_co2_per_kg decimal(7,3));')
cursor.execute('insert into environmental_cost (food_type, kg_co2_per_kg) values ("beef",27.76);')
cursor.execute('commit;')