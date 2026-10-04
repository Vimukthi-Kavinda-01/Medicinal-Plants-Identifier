# 🌿 HerbSense – Cloud Database Guide (Supabase PostgreSQL)

HerbSense uses a **cloud-hosted PostgreSQL database on Supabase**. Anyone who clones the repository does **not** need to install PostgreSQL locally or run pgAdmin.

---

## 📋 Overview

- **Host:** [Supabase](https://supabase.com) (free cloud PostgreSQL)
- **Tables:**
  - `users` — user registration and profile management with bcrypt password hashing
  - `plants` — master botanical knowledge repository (37+ medicinal species)
  - `plant_scans` — scan history, predictions, confidence scores, and AI descriptions
  - `saved_plants` — user bookmarks and personal collection

---

## 🚀 Setup & Configuration

### 1. Using the Pre-Configured Database (Default)

The project `.env` is already configured with the cloud database:
```env
# Supabase Cloud Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
JWT_SECRET=your_secret_key_here
```

Just start the backend server:
```bash
cd backend
npm install
npm run dev
```

Check the health endpoint:
```http
GET http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "service": "HerbSense Backend",
  "databaseConnected": true,
  "database": "postgres",
  "roboflowConfigured": true,
  "descriptionConfigured": true
}
```

---

### 2. Setting Up Your Own Supabase Project (Optional)

If you wish to host your own separate database:

1. Sign up for free at [supabase.com](https://supabase.com).
2. Create a new project (e.g. `herbsense`).
3. In your project dashboard, open the **SQL Editor**.
4. Copy and execute [`backend/database.sql`](./database.sql) to create the schema and indexes.
5. Copy and execute [`backend/seed.sql`](./seed.sql) to populate all 37+ verified medicinal plant profiles.
6. Go to **Project Settings** > **Database** > **Connection string** > **URI**.
7. Copy the URI and set it as `DATABASE_URL` in `backend/.env`.

---

## 🛠️ Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service and Supabase database connection health |
| `POST` | `/api/auth/register` | Register new account (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Sign in with email or username + password |
| `GET` | `/api/auth/me` | Verify JWT and return current user session |
| `POST` | `/api/scans` | Save plant detection scan with AI description |
| `GET` | `/api/scans/my` | Retrieve logged-in user's scan history |
| `GET` | `/api/plants` | Retrieve all medicinal plants from database |
| `GET` | `/api/plants/:slug` | Retrieve specific plant by slug |
| `POST` | `/api/saved-plants` | Bookmark a plant to user's saved collection |
| `GET` | `/api/saved-plants` | List user's bookmarked plants |
| `DELETE` | `/api/saved-plants/:plantId` | Remove a bookmarked plant |
