// User model - Database operations for user management
// Handles user authentication and user data operations
const { pool } = require("../db");

/**
 * Find a user by username
 * Used for login authentication
 * @param {string} username - The username to search for
 * @returns {Object|null} User object with id, username, password_hash, role or null if not found
 */
async function findUserByUsername(username) {
  const { rows } = await pool.query(
    `SELECT id, username, password_hash, role FROM users WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

/**
 * Create a new user
 * Used for user registration (if implemented)
 * @param {Object} userData - User data object
 * @param {string} userData.username - Username
 * @param {string} userData.passwordHash - Hashed password
 * @param {string} userData.role - User role (defaults to "user")
 * @returns {Object} Created user object (without password hash)
 */
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
