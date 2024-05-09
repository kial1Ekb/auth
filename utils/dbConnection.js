const mysql = require("mysql2");

const db_connection = mysql.createConnection({
    user: process.env.DB_USER, // имя пользователя
    database: process.env.DB_NAME, // имя базы данных
    password: process.env.DB_PWD, // пароль от базы данных
    port: process.env.DB_PORT, // порт базы данных
});

db_connection.on("connect", (err) => {
    console.log("[LOG] Successfully connected to the database");
});

db_connection.on("error", (err) => {
    console.error("[ERROR] Failed to connect to Database - ", err);
});

module.exports = db_connection;