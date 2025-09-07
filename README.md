# Campus Lost & Found API

## Setup Instructions

1. **Clone Repository**

   ```bash
   git clone https://github.com/yourusername/campus-lost-found.git
   cd campus-lost-found
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:

   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/lostfound
   JWT_SECRET=supersecretkey
   PORT=3000
   ```

3. **Database Setup**
   Run the following in PostgreSQL:

   ```sql
   CREATE DATABASE lostfound;

   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     password_hash VARCHAR(60) NOT NULL,
     role VARCHAR(10) DEFAULT 'user'
   );

   CREATE TABLE items (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title VARCHAR(100) NOT NULL,
     description TEXT,
     status VARCHAR(10) NOT NULL CHECK (status IN ('lost','found')),
     category VARCHAR(50),
     location VARCHAR(100),
     date DATE,
     contact_info VARCHAR(100),
     image_url TEXT,
     user_id UUID REFERENCES users(id),
     created_at TIMESTAMP DEFAULT now()
   );
   ```

4. **Seed a User**
   Generate a bcrypt hash:

   ```bash
   node -e "require('bcrypt').hash('secret',10).then(h=>console.log(h))"
   ```

   Insert user:

   ```sql
   INSERT INTO users (username, password_hash, role)
   VALUES ('alice', '<HASH_FROM_ABOVE>', 'admin');
   ```

5. **Run Server**

   ```bash
   npm start
   ```

   Access API at `http://localhost:3000`

---

## Usage

* **Login:** `POST /auth/login` with `{ "username": "alice", "password": "secret" }` → returns JWT token.
* **List Items:** `GET /items` → fetch all items. Supports filters: `status`, `category`, `location`, `date`.
* **Get Item:** `GET /items/:id` → details of a single item.
* **Create Item:** `POST /items` → create report (requires login).
* **Update Item:** `PUT /items/:id` → update report (owner or admin).
* **Delete Item:** `DELETE /items/:id` → delete report (admin only).

---

## Challenges & Decisions

* First time implementing JWT authentication; learned token signing and verification.
* Faced bcrypt hash issues (61 characters with newline vs valid 60 char hash) that blocked login; solved by reseeding with correct hashes.
* Started with 1–2 files, then moved to a structured separation of concerns (routes, controllers, models, middleware).
* Learned the difference between Express app port (3000) and PostgreSQL port (5432).
* Improved workflow by testing endpoints in Postman with saved environments and tokens.

---

## Author

* Name: Your Name
* Email: [your@email.com](mailto:your@email.com)
* GitHub: [yourusername](https://github.com/yourusername)
