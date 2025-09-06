// /src/controllers/itemsController.js
const Items = require("../models/itemModel");
const { NotFound, BadRequest } = require("../utils/errors");

async function list(req, res, next) {
  try {
    const { status, category, location, date, limit, offset } = req.query;
    const data = await Items.listItems(
      { status, category, location, date },
      { limit: Number(limit) || 20, offset: Number(offset) || 0 }
    );
    res.json(data);
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const item = await Items.getItemById(req.params.id);
    if (!item) throw NotFound("Item not found");
    req.item = item; // for middleware if needed
    res.json(item);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status,             // "lost" | "found"
      category: req.body.category || null,
      location: req.body.location || null,
      date: req.body.date || new Date(),
      contactInfo: req.body.contactInfo || null,
      imageUrl: req.body.imageUrl || null,
      userId: req.user.id
    };

    if (!payload.title || !payload.status) throw BadRequest("title and status are required");

    const { id } = await Items.createItem(payload);
    const created = await Items.getItemById(id);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const item = await Items.getItemById(req.params.id);
    if (!item) throw NotFound("Item not found");
    req.item = item; // so middleware can check ownership

    // You can enforce owner/admin in the route chain
    const allowed = ["title","description","status","category","location","date","contactInfo","imageUrl"];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

    const updated = await Items.updateItem(item.id, patch);
    res.json(updated);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const item = await Items.getItemById(req.params.id);
    if (!item) throw NotFound("Item not found");
    await Items.deleteItem(item.id);
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { list, getById, create, update, remove };
