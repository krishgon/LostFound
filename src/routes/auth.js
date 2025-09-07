// Authentication routes
// Handles user login and authentication-related endpoints
const router = require("express").Router();
const { login } = require("../controllers/authController");

// POST /auth/login - User login endpoint
// Expects: { username, password }
// Returns: { token, user: { id, username, role } }
router.post("/login", login);

module.exports = router;
