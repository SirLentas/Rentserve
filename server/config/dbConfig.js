const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "rentservedb",
    password: "12345",
    port: 5432
});

module.exports = { pool };
