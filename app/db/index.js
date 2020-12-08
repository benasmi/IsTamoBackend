var mysql = require('mysql2');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../config/.env')});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    port: process.env.DB_PORT,
    insecureAuth: true
});

module.exports = pool.promise()