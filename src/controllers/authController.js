// Authentication controller
// Handles user login and JWT token generation
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByUsername } = require("../models/userModel");
const { BadRequest, Unauthorized } = require("../utils/errors");

/**
 * User login endpoint
 * Validates credentials and returns JWT token if successful
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function login(req, res, next) {
  try {
    // Extract username and password from request body
    const { username, password } = req.body || {};
    if (!username || !password) throw BadRequest("username and password are required");

    // Find user in database by username
    const user = await findUserByUsername(username);
    if (!user) throw Unauthorized("Invalid credentials");

    // Compare provided password with hashed password in database
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw Unauthorized("Invalid credentials");

    // Generate JWT token with user info and expiration
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    // Return token and user info (excluding password hash)
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) { next(e); }
}

module.exports = { login };
