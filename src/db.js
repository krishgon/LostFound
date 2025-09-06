const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g. postgres://user:pass@localhost:5432/lostfound
  // ssl: { rejectUnauthorized: false } // enable if you deploy with managed PG
});

module.exports = { pool };
