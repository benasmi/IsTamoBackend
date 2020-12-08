var mysql = require('mysql');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../config/.env')});

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    port: process.env.DB_PORT,
    insecureAuth: true
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;