# hackzurich2018

## Installing the Chrome extension
Currently only locally: the extension is not registered in the Chrome Web Store.
* Open extensions at [chrome://extensions/]
* Turn on developer mode (top right corner)
* Click 'load unpacked' (top left corner)
* Open 'chrome_extension' folder
* Turn on extension

It currently only woks for [https://www.bbcgoodfood.com] recipes. Examples are:
* [https://www.bbcgoodfood.com/recipes/333614/red-lentil-chickpea-and-chilli-soup] (eco friendly)
* [https://www.bbcgoodfood.com/recipes/2528636/coffee-and-walnut-cake] (eco OK)
* [https://www.bbcgoodfood.com/recipes/2538/beef-wellington] (eco unfriendly)

## Setting up the Database
For future development, to handle a larger amount and more complex data (e.g. user accounts, accomplishments, different measures) and integrate with the Chrome Extension.

* get the docker image: `docker pull mysql`
* start a mysql server instance: `docker run --name mysql 
  -e MYSQL_ROOT_PASSWORD=123 -d mysql:5.5`
* connect with mysql cli: `docker run -it --link mysql:mysql 
  --rm mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" 
  -P"$MYSQL_PORT_3306_TCP_PORT" -uroot 
  -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"'`
* create and populate the database: execute database/src/CreateDatabase.py
* on the host system: `pip3 install mysql-connector`
* on the host system: `npm install mysql`
