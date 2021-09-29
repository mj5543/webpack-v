require('dotenv').config();
const mysql = require('mysql');
let db;
if (process.env.NODE_ENV === "production") {
  // db = mysql.createPool({
  //   host : process.env.DATABASE_HOST,
  //   user : process.env.DATABASE_USER,
  //   password : process.env.DATABASE_PASSWORD,
  //   database : process.env.DATABASE
  // });
  db = mysql.createPool({
    // connectionLimit : 1000,
    // connectTimeout  : 60 * 60 * 1000,
    // acquireTimeout  : 60 * 60 * 1000,
    // timeout         : 60 * 60 * 1000,
    host : process.env.AWS_DATABASE_HOST,
    user : process.env.AWS_DATABASE_USER,
    password : process.env.AWS_DATABASE_PASSWORD,
    database : process.env.AWS_DATABASE
    // host : process.env.LOCAL_DATABASE_HOST,
    // user : process.env.LOCAL_DATABASE_USER,
    // password : process.env.LOCAL_DATABASE_PASSWORD,
    // database : process.env.LOCAL_DATABASE
  });

} else {
  db = mysql.createPool({
    // connectionLimit : 1000,
    // connectTimeout  : 60 * 60 * 1000,
    // acquireTimeout  : 60 * 60 * 1000,
    // timeout         : 60 * 60 * 1000,
    host : process.env.LOCAL_DATABASE_HOST,
    user : process.env.LOCAL_DATABASE_USER,
    password : process.env.LOCAL_DATABASE_PASSWORD,
    database : process.env.LOCAL_DATABASE
  });
}

module.exports = db;