// /src/routes/items.js
const router = require("express").Router();
const ctrl = require("../controllers/itemsController");
const { authRequired, requireAdmin, requireOwnerOrAdmin } = require("../middleware/authMiddleware");

// Public read
router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

// Create (logged-in users)
router.post("/", authRequired, ctrl.create);

// Update (owner or admin) — chain: load item in controller, then check
router.put("/:id",
  authRequired,
  async (req, res, next) => { // preload item to use in requireOwnerOrAdmin
    try {
      const item = await require("../models/itemModel").getItemById(req.params.id);
      if (item) req.item = item;
      next();
    } catch (e) { next(e); }
  },
  requireOwnerOrAdmin,
  ctrl.update
);

// Delete (admin only)
router.delete("/:id", authRequired, requireAdmin, ctrl.remove);

module.exports = router;
