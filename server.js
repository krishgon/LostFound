// server.js
// Entry point for the Lost & Found API server
// This file starts the Express server and listens on the specified port
const app = require("./src/app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
