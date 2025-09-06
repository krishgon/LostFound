// /src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { Unauthorized, Forbidden } = require("../utils/errors");

function authRequired(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(Unauthorized("Missing token"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(Unauthorized("Invalid or expired token"));
  }
}

function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") return next(Forbidden("Admin only"));
  next();
}

// Use after loading the item (in controller) and set req.item.userId
function requireOwnerOrAdmin(req, _res, next) {
  const isOwner = req.item?.userId && String(req.item.userId) === String(req.user?.id);
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) return next(Forbidden("Not allowed"));
  next();
}

module.exports = { authRequired, requireAdmin, requireOwnerOrAdmin };
