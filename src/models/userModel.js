const { pool } = require("../db");

async function findUserByUsername(username) {
  const { rows } = await pool.query(
    `SELECT id, username, password_hash, role FROM users WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

async function createUser({ username, passwordHash, role = "user" }) {
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash, role)
     VALUES ($1,$2,$3)
     RETURNING id, username, role`,
    [username, passwordHash, role]
  );
  return rows[0];
}

module.exports = { findUserByUsername, createUser };
