var mysql = require('mysql');

class DatabaseConnector {
  static get(key, callback) {
    var connection = mysql.createConnection({
      host: "172.17.0.2",
      user: "root",
      password: "123",
      database: "food",
      insecureAuth: true
    });

    connection.connect(function(err) {
      if (err) throw err;
      });

    connection.query('select * from environmental_cost where food_type="' + key + '";', function (err, result, fields) {
      if (err) throw err;
      callback(result[0].kg_co2_per_kg);
      });

    connection.end();
  }
}

module.exports = DatabaseConnector
