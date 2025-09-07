// Items routes - CRUD operations for lost and found items
// Handles all item-related endpoints with proper authentication and authorization
const router = require("express").Router();
const ctrl = require("../controllers/itemsController");
const { authRequired, requireAdmin, requireOwnerOrAdmin } = require("../middleware/authMiddleware");

// Public read endpoints - anyone can access these
router.get("/", ctrl.list);           // GET /items - List all items with optional filtering
router.get("/:id", ctrl.getById);    // GET /items/:id - Get specific item by ID

// Create endpoint - requires user to be logged in
router.post("/", authRequired, ctrl.create);  // POST /items - Create new item

// Update endpoint - requires user to be owner of item OR admin
// Note: We preload the item in middleware to check ownership
router.put("/:id",
  authRequired,  // First check if user is authenticated
  async (req, res, next) => { // Preload item to use in requireOwnerOrAdmin
    try {
      const item = await require("../models/itemModel").getItemById(req.params.id);
      if (item) req.item = item;  // Attach item to request for middleware
      next();
    } catch (e) { next(e); }
  },
  requireOwnerOrAdmin,  // Check if user owns item or is admin
  ctrl.update           // Execute update if authorized
);

// Delete endpoint - admin only
router.delete("/:id", authRequired, requireAdmin, ctrl.remove);

module.exports = router;
