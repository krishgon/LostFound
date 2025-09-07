🏫 Campus Lost & Found API

A backend service for managing lost and found items on campus.
Built with Node.js, Express, PostgreSQL, and JWT authentication.

🚀 Features

Authentication

JWT-based login system

Role-based access (user vs admin)

Item Management

GET /items → list all items (filter by status, category, location, date)

GET /items/:id → fetch details of one item

POST /items → create new lost/found report (requires login)

PUT /items/:id → update item (only owner or admin)

DELETE /items/:id → delete item (admin only)

Security

Passwords stored with bcrypt hashing

Middleware for protecting routes

Error handling with clear status codes

Database

PostgreSQL with tables: users, items

UUID primary keys

Timestamps (created_at)

🛠️ Tech Stack

Backend: Node.js (Express)

Database: PostgreSQL

Auth: JWT + bcrypt

Environment Variables: managed with dotenv

⚙️ Setup Instructions
1. Clone & Install
git clone https://github.com/yourusername/campus-lost-found.git
cd campus-lost-found
npm install

2. Environment Variables

Create .env in the root:

DATABASE_URL=postgres://postgres:password@localhost:5432/lostfound
JWT_SECRET=supersecretkey
PORT=3000

3. Database Schema

In psql:

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

4. Seed an Admin

Generate bcrypt hash:

node -e "require('bcrypt').hash('secret',10).then(h=>console.log(h))"


Insert into DB:

INSERT INTO users (username, password_hash, role)
VALUES ('alice', '<HASH_FROM_ABOVE>', 'admin');

5. Run the Server
npm start


Server will run at:
👉 http://localhost:3000

📖 Usage (with Postman)
Login

POST /auth/login

{ "username": "alice", "password": "secret" }


Returns JWT token.

Use Token

In Postman → Authorization tab → Bearer Token → paste token.

Create Item

POST /items

{
  "title": "Blue Umbrella",
  "status": "lost",
  "category": "accessories",
  "location": "Library",
  "date": "2025-09-07",
  "contactInfo": "9876543210",
  "description": "Left in reading hall"
}

List Items

GET /items?status=lost&category=electronics

🧩 Challenges Faced

Authentication for the first time
I had never implemented JWT before. I learned how tokens are signed, verified, and used in headers for protected routes.

Password hashing issues
Initially, my login kept failing (Invalid credentials). I discovered bcrypt hashes must be exactly 60 characters. I had accidentally stored 61-character strings with hidden newlines. Fixing this taught me about data integrity in DB fields.

Separation of concerns
At first, I used only 1–2 files for all routes. Moving to a structured MVC-like setup (routes, controllers, models, middleware) felt confusing at first, but it made the code far more maintainable.

Connecting to PostgreSQL
I had to clearly understand the difference between:

5432 → Postgres port

3000 → Express server port
This helped me configure .env correctly.

Testing in Postman
I learned how to set up environments, save tokens, and reuse them across requests. This improved my API testing workflow.

📌 Improvements / Next Steps

Add image upload support (e.g., with Multer + cloud storage).

Add pagination in GET /items.

Implement request rate limiting for security.

Deploy with Docker + NGINX.

👨‍💻 Author

Your Name

Email: your@email.com

GitHub: yourusername