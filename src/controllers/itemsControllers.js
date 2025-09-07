// Items controller
// Handles all business logic for lost and found items (CRUD operations)
const Items = require("../models/itemModel");
const { NotFound, BadRequest } = require("../utils/errors");

/**
 * List all items with optional filtering and pagination
 * Supports query parameters: status, category, location, date, limit, offset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function list(req, res, next) {
  try {
    // Extract filter parameters from query string
    const { status, category, location, date, limit, offset } = req.query;
    
    // Call model to get filtered items with pagination
    const data = await Items.listItems(
      { status, category, location, date },  // Filters
      { limit: Number(limit) || 20, offset: Number(offset) || 0 }  // Pagination
    );
    res.json(data);
  } catch (e) { next(e); }
}

/**
 * Get a specific item by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getById(req, res, next) {
  try {
    const item = await Items.getItemById(req.params.id);
    if (!item) throw NotFound("Item not found");
    
    // Attach item to request for potential use in middleware
    req.item = item;
    res.json(item);
  } catch (e) { next(e); }
}

/**
 * Create a new lost or found item
 * Requires user to be authenticated (handled by authRequired middleware)
 * @param {Object} req - Express request object (req.user.id available from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function create(req, res, next) {
  try {
    // Prepare item data from request body
    const payload = {
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status,             // "lost" | "found"
      category: req.body.category || null,
      location: req.body.location || null,
      date: req.body.date || new Date(),   // Default to current date if not provided
      contactInfo: req.body.contactInfo || null,
      imageUrl: req.body.imageUrl || null,
      userId: req.user.id                  // From authenticated user
    };

    // Validate required fields
    if (!payload.title || !payload.status) throw BadRequest("title and status are required");

    // Create item in database
    const { id } = await Items.createItem(payload);
    
    // Fetch and return the created item
    const created = await Items.getItemById(id);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

/**
 * Update an existing item
 * Requires user to be owner of item OR admin (handled by middleware)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function update(req, res, next) {
  try {
    // Get item from database (should already be loaded by middleware)
    const item = await Items.getItemById(req.params.id);
    if (!item) throw NotFound("Item not found");
    
    // Attach item to request for middleware to check ownership
    req.item = item;

    // Define allowed fields that can be updated
    const allowed = ["title","description","status","category","location","date","contactInfo","imageUrl"];
    
    // Build update object with only allowed fields from request body
    const patch = {};
    for (const k of allowed) {
      if (k in req.body) patch[k] = req.body[k];
    }

    // Update item in database
    const updated = await Items.updateItem(item.id, patch);
    res.json(updated);
  } catch (e) { next(e); }
}

/**
 * Delete an item
 * Requires user to be admin (handled by requireAdmin middleware)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function remove(req, res, next) {
  try {
    // Check if item exists
    const item = await Items.getItemById(req.params.id);
    if (!item) throw NotFound("Item not found");
    
    // Delete item from database
    await Items.deleteItem(item.id);
    
    // Return 204 No Content on successful deletion
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { list, getById, create, update, remove };
