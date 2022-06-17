const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});

module.exports = connection;
