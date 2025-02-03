const mysql = require("mysql2");
require("dotenv").config();
console.log("connected");

const pool = mysql.createPool({
  host: "LAPTOP-DBMCIJU1", 
  user: "root",
  password: "harsh#8804",
  database: "mydb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
