# hackzurich2018

## Setting up the Database

* get the docker image: `docker pull mysql`
* start a mysql server instance: `docker run --name mysql 
  -e MYSQL_ROOT_PASSWORD=123 -d mysql:5.5`
* connect with mysql cli: `docker run -it --link mysql:mysql 
  --rm mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" 
  -P"$MYSQL_PORT_3306_TCP_PORT" -uroot 
  -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"'`
* create and populate the database: execute CreateDatabase.py