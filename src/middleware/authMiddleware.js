// Authentication middleware
// Handles JWT token validation and role-based authorization
const jwt = require("jsonwebtoken");
const { Unauthorized, Forbidden } = require("../utils/errors");

/**
 * Middleware to require authentication
 * Validates JWT token and attaches user info to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function authRequired(req, _res, next) {
  // Extract token from Authorization header (format: "Bearer <token>")
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  
  if (!token) return next(Unauthorized("Missing token"));

  try {
    // Verify and decode JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request for use in subsequent middleware/controllers
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    // Token is invalid or expired
    next(Unauthorized("Invalid or expired token"));
  }
}

/**
 * Middleware to require admin role
 * Must be used after authRequired middleware
 * @param {Object} req - Express request object (req.user must exist)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") return next(Forbidden("Admin only"));
  next();
}

/**
 * Middleware to require ownership of item OR admin role
 * Must be used after authRequired middleware and item loading
 * @param {Object} req - Express request object (req.user and req.item must exist)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function requireOwnerOrAdmin(req, _res, next) {
  // Check if user owns the item
  const isOwner = req.item?.userId && String(req.item.userId) === String(req.user?.id);
  // Check if user is admin
  const isAdmin = req.user?.role === "admin";
  
  // Allow access if user is owner OR admin
  if (!isOwner && !isAdmin) return next(Forbidden("Not allowed"));
  next();
}

module.exports = { authRequired, requireAdmin, requireOwnerOrAdmin };
