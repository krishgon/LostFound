// /src/app.js
require("dotenv").config();
const express = require("express");
const { HttpError } = require("./utils/errors");

const app = express();
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth"));
app.use("/items", require("./routes/items"));

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404
app.use((_req, _res, next) => next(new HttpError(404, "Route not found")));

// central error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
