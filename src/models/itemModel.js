// Item model - Database operations for lost and found items
// Handles all CRUD operations for items with filtering and pagination
const { pool } = require("../db");

/**
 * List items with optional filtering and pagination
 * @param {Object} filters - Filter criteria
 * @param {string} filters.status - Item status (lost/found)
 * @param {string} filters.category - Item category
 * @param {string} filters.location - Item location
 * @param {string} filters.date - Item date (YYYY-MM-DD format)
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.limit - Number of items per page (default: 20)
 * @param {number} pagination.offset - Number of items to skip (default: 0)
 * @returns {Array} Array of item objects
 */
async function listItems(filters = {}, pagination = {}) {
  const { status, category, location, date } = filters;
  const { limit = 20, offset = 0 } = pagination;

  // Build dynamic WHERE clause based on provided filters
  const clauses = [];
  const values = [];
  let idx = 1;

  // Add filter conditions if provided
  if (status)   { clauses.push(`status = $${idx++}`);   values.push(status); }
  if (category) { clauses.push(`category = $${idx++}`); values.push(category); }
  if (location) { clauses.push(`location = $${idx++}`); values.push(location); }
  if (date)     { clauses.push(`DATE("date") = $${idx++}`); values.push(date); }

  // Construct WHERE clause
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  values.push(limit, offset);

  // Build and execute query
  const q = `
    SELECT id, title, description, status, category, location, "date",
           contact_info AS "contactInfo", image_url AS "imageUrl", created_at AS "createdAt", user_id AS "userId"
    FROM items
    ${where}
    ORDER BY created_at DESC
    LIMIT $${idx++} OFFSET $${idx++}`;

  const { rows } = await pool.query(q, values);
  return rows;
}

/**
 * Get a single item by its ID
 * @param {string|number} id - Item ID
 * @returns {Object|null} Item object or null if not found
 */
async function getItemById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, description, status, category, location, "date",
            contact_info AS "contactInfo", image_url AS "imageUrl", created_at AS "createdAt", user_id AS "userId"
     FROM items WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Create a new item
 * @param {Object} data - Item data
 * @param {string} data.title - Item title
 * @param {string} data.description - Item description
 * @param {string} data.status - Item status (lost/found)
 * @param {string} data.category - Item category
 * @param {string} data.location - Item location
 * @param {Date} data.date - Item date
 * @param {string} data.contactInfo - Contact information
 * @param {string} data.imageUrl - Image URL
 * @param {number} data.userId - ID of user who created the item
 * @returns {Object} Created item with ID
 */
async function createItem(data) {
  const { title, description, status, category, location, date, contactInfo, imageUrl, userId } = data;
  const { rows } = await pool.query(
    `INSERT INTO items
     (title, description, status, category, location, "date", contact_info, image_url, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id`,
    [title, description, status, category, location, date, contactInfo, imageUrl, userId]
  );
  return rows[0];
}

/**
 * Update an existing item
 * @param {string|number} id - Item ID to update
 * @param {Object} data - Fields to update (only provided fields will be updated)
 * @returns {Object|null} Updated item object or null if not found
 */
async function updateItem(id, data) {
  // Build dynamic SET clause for only provided fields
  const fields = [];
  const values = [];
  let idx = 1;

  // Map JavaScript field names to database column names
  for (const [key, val] of Object.entries(data)) {
    const col = ({
      contactInfo: "contact_info",
      imageUrl: "image_url",
      date: '"date"',
    }[key] || key);
    fields.push(`${col} = $${idx++}`);
    values.push(val);
  }
  values.push(id);

  // Execute update query
  const q = `UPDATE items SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(q, values);
  return rows[0] || null;
}

/**
 * Delete an item
 * @param {string|number} id - Item ID to delete
 * @returns {boolean} True if deletion was successful
 */
async function deleteItem(id) {
  await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
  return true;
}

module.exports = { listItems, getItemById, createItem, updateItem, deleteItem };
    