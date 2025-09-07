// Database connection configuration
// Uses PostgreSQL connection pool for efficient database connections
const { Pool } = require("pg");

// Create a connection pool to manage database connections
// DATABASE_URL should be set in environment variables (e.g., postgres://user:pass@localhost:5432/lostfound)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g. postgres://user:pass@localhost:5432/lostfound
  // ssl: { rejectUnauthorized: false } // enable if you deploy with managed PG
});

module.exports = { pool };
