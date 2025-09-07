// Main Express application setup
// This file configures the Express app with middleware, routes, and error handling
require("dotenv").config();
const express = require("express");
const { HttpError } = require("./utils/errors");

const app = express();

// Middleware: Parse JSON request bodies
app.use(express.json());

// Route handlers
// Authentication routes (login, etc.)
app.use("/auth", require("./routes/auth"));
// Items routes (CRUD operations for lost/found items)
app.use("/items", require("./routes/items"));

// Health check endpoint - useful for monitoring server status
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404 handler - catches any routes that don't match above patterns
app.use((_req, _res, next) => next(new HttpError(404, "Route not found")));

// Central error handler - catches all errors and sends appropriate HTTP responses
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
