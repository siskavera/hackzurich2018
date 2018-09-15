import mysql.connector
import csv

cnx = mysql.connector.connect(host='172.17.0.3', user='root', password='123')
cursor = cnx.cursor()
cursor.execute('create database food;')
cursor.execute('use food;')
cursor.execute('create table environmental_cost (food_type varchar(50) not null, kg_co2_per_kg decimal(7,3) not null, '
               'primary key (food_type));')

with open('database/resources/rmit_dataset.csv', 'rt') as dataFile:
    csvReader = csv.reader(dataFile, delimiter=',', quotechar='"')
    for row in csvReader:
        key = row[0]
        value = row[1]
        cursor.execute('insert into environmental_cost (food_type, kg_co2_per_kg) values ("{}",{});'.format(key, value))

cursor.execute('commit;')