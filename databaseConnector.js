var mysql = require('mysql');

var con = mysql.createConnection({
  host: "172.17.0.3",
  user: "root",
  password: "123",
  database: "food",
  insecureAuth: true,
});

function get(key) {
  con.connect(function(err) {
    if (err) throw err;
    con.query('select * from environmental_cost where food_type="' + key + '";', function (err, result, fields) {
      if (err) throw err;
      return result[0].kg_co2_per_kg;
    });
  });
}

var result = get("Peas");
console.log("result: " + result);