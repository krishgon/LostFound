const { pool } = require("../db");

async function listItems(filters = {}, pagination = {}) {
  const { status, category, location, date } = filters;
  const { limit = 20, offset = 0 } = pagination;

  const clauses = [];
  const values = [];
  let idx = 1;

  if (status)   { clauses.push(`status = $${idx++}`);   values.push(status); }
  if (category) { clauses.push(`category = $${idx++}`); values.push(category); }
  if (location) { clauses.push(`location = $${idx++}`); values.push(location); }
  if (date)     { clauses.push(`DATE("date") = $${idx++}`); values.push(date); }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  values.push(limit, offset);

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

async function getItemById(id) {
  const { rows } = await pool.query(
    `SELECT id, title, description, status, category, location, "date",
            contact_info AS "contactInfo", image_url AS "imageUrl", created_at AS "createdAt", user_id AS "userId"
     FROM items WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

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

async function updateItem(id, data) {
  // Build dynamic SET
  const fields = [];
  const values = [];
  let idx = 1;

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

  const q = `UPDATE items SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(q, values);
  return rows[0] || null;
}

async function deleteItem(id) {
  await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
  return true;
}

module.exports = { listItems, getItemById, createItem, updateItem, deleteItem };
    