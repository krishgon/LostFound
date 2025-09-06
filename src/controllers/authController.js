// /src/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByUsername } = require("../models/userModel");
const { BadRequest, Unauthorized } = require("../utils/errors");

async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) throw BadRequest("username and password are required");

    const user = await findUserByUsername(username);
    if (!user) throw Unauthorized("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw Unauthorized("Invalid credentials");

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) { next(e); }
}

module.exports = { login };
