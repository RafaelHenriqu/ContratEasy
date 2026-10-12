const MySQL = require("mysql2/promise")
require("dotenv").config()
const Connection = MySQL.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionLimit: 10
})
module.exports = Connection