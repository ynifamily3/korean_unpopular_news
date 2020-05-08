var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "192.168.0.13",
  user: "root",
  password: "root",
  database: "navernews",
});

connection.connect((err) => {
  if (err) {
    console.error("에러!!");
    console.log(err);
    return;
  }
  console.log("연결됨! " + connection.threadId);
});

connection.query("select * from newsdata", function (error, results, fields) {
  if (error) throw error;
  console.log(results.map((x) => x.title));
});

connection.end();
