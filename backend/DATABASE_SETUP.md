# 🌿 HerbSense – PostgreSQL Database Setup Guide

This guide walks you step-by-step through setting up the PostgreSQL database for the HerbSense Medicinal Plants Identifier project using **pgAdmin 4** or the PostgreSQL command line.

---

## 📋 Prerequisites

- **PostgreSQL** (version 13 or newer) installed on your system.
  - Download from: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- **pgAdmin 4** (included with the standard PostgreSQL installer).
- **Node.js** (v18+ recommended) and **npm**.

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Install PostgreSQL and pgAdmin
1. If you haven't already, download and run the official PostgreSQL installer for your operating system (Windows, macOS, or Linux).
2. During installation, remember the **master password** you set for the default `postgres` superuser.
3. Keep the default port as **`5432`**.
4. Finish installation and launch **pgAdmin 4**.

---

### Step 2: Open pgAdmin and Connect to Your Server
1. Launch **pgAdmin 4** from your Start menu or Applications folder.
2. In the left sidebar tree, click **Servers** > **PostgreSQL [version]**.
3. Enter your PostgreSQL superuser password when prompted to unlock the server.

---

### Step 3: Create the `herbsense_db` Database
1. Right-click on **Databases** under your connected PostgreSQL server.
2. Select **Create** > **Database...**.
3. In the **Database** field, enter exactly:
   ```text
   herbsense_db
   ```
4. Leave the owner as `postgres` (or your chosen user).
5. Click **Save**. You should now see `herbsense_db` listed under Databases.

---

### Step 4: Open the pgAdmin Query Tool
1. In the left sidebar, click to expand **Databases** > **herbsense_db**.
2. With `herbsense_db` selected, click the **Tools** menu at the top, then select **Query Tool** (or click the database icon with a lightning bolt / play symbol).
3. A blank SQL editor tab will open for `herbsense_db`.

---

### Step 5: Run `database.sql` (Create Tables)
1. In pgAdmin's Query Tool, open the file `backend/database.sql`:
   - Click the **Open File** icon (folder symbol) on the Query Tool toolbar.
   - Browse to your project directory: `Medicinal-Plants-Identifier/backend/database.sql`.
   - Alternatively, open `backend/database.sql` in any text editor, select all text, copy, and paste it into the pgAdmin Query Tool.
2. Click the **Execute / Run** button (the Play ▶ icon, or press **F5**).
3. You will see a success message:
   ```text
   Query returned successfully in ... ms.
   ```
   This creates the following 4 core tables:
   - `users` – User profiles with unique usernames and emails
   - `plants` – Master botanical knowledge repository
   - `plant_scans` – Identification history and candidate predictions
   - `saved_plants` – User bookmarks with a unique constraint on `(user_id, plant_id)`

---

### Step 6: Run `seed.sql` (Insert Initial Plants)
1. Clear the Query Tool or open a new Query Tool tab.
2. Open or paste the contents of `backend/seed.sql`.
3. Click the **Execute / Run** button (Play ▶ or **F5**).
4. You will see:
   ```text
   INSERT 0 11
   Query returned successfully in ... ms.
   ```
   This populates the `plants` table with exactly the 11 botanical profiles matching the HerbSense knowledge base.

---

### Step 7: Configure Your `backend/.env`
1. In your project, go to the `backend/` directory.
2. If you do not have a `.env` file yet, copy `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `backend/.env` in your text editor and ensure the database variables match your local PostgreSQL configuration:
   ```env
   # PostgreSQL Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=herbsense_db
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_actual_postgres_password
   ```
   *(Replace `your_actual_postgres_password` with the password you chose during PostgreSQL installation).*

---

### Step 8: Install Backend Dependencies
In your terminal, navigate to the `backend/` directory and install dependencies:
```bash
cd backend
npm install
```
*(This ensures the `pg` driver and all server dependencies are installed).*

---

### Step 9: Start the Backend Server
Start the development server with automatic file reloading:
```bash
npm run dev
```
You should see:
```text
===============================================
🌿 HerbSense Backend running on http://localhost:3001
🔑 Roboflow API key is loaded.
===============================================
```

---

### Step 10: Check `/api/health`
Open your web browser or send a GET request via curl or Postman to:
```http
http://localhost:3001/api/health
```
You should receive a JSON response confirming database connectivity:
```json
{
  "status": "ok",
  "service": "HerbSense Backend",
  "databaseConnected": true,
  "database": "herbsense_db",
  "roboflowConfigured": true,
  "descriptionConfigured": true,
  "timestamp": "2026-09-30T13:50:00.000Z"
}
```
If `"databaseConnected": true`, your backend is fully communicating with PostgreSQL!

---

### Step 11: Verify the Four Tables in pgAdmin
In pgAdmin's left sidebar:
1. Navigate to:
   `Servers` > `PostgreSQL` > `Databases` > `herbsense_db` > `Schemas` > `public` > `Tables`.
2. Confirm that all four tables are present:
   - `users`
   - `plants`
   - `plant_scans`
   - `saved_plants`

---

### Step 12: Verify the 11 Plant Records
In pgAdmin's Query Tool, run:
```sql
SELECT slug, common_name, scientific_name, family FROM plants ORDER BY common_name ASC;
```
You should see exactly **11 rows**:
1. Aloe Vera (`aloe-vera`)
2. Ashwagandha (`ashwagandha`)
3. Brahmi (`brahmi`)
4. Ginger (`ginger`)
5. Gotu Kola (`gotu-kola`)
6. Lemongrass (`lemongrass`)
7. Moringa (`moringa`)
8. Neem (`neem`)
9. Peppermint (`peppermint`)
10. Tulsi (`tulsi`)
11. Turmeric (`turmeric`)

---

## 🛠️ Available API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service and PostgreSQL connection status |
| `POST` | `/api/users/profile` | Create a new user profile (`fullName`, `username`, `email`, `location`, `bio`) |
| `GET` | `/api/users/profile/:username` | Retrieve a user profile by username |
| `PUT` | `/api/users/profile/:username` | Update an existing user profile |
| `GET` | `/api/plants` | Retrieve all 11 medicinal plants from the database |
| `GET` | `/api/plants/:slug` | Retrieve a specific plant by slug (e.g. `aloe-vera`) |
| `POST` | `/api/scans` | Save a plant detection scan result with confidence and predictions |
| `GET` | `/api/scans` | Retrieve scan history (optional filter: `?userId=<uuid>&limit=20`) |
| `POST` | `/api/saved-plants` | Bookmark a plant to a user's collection |
| `GET` | `/api/saved-plants?userId=<uuid>` | List a user's saved plants |
| `DELETE` | `/api/saved-plants/:plantId?userId=<uuid>` | Remove a bookmarked plant |

---

## ❓ Troubleshooting

- **`databaseConnected: false` in `/api/health`**:
  - Verify that PostgreSQL service is running in your OS Services manager.
  - Double check `DATABASE_PASSWORD`, `DATABASE_USER`, `DATABASE_NAME`, and `DATABASE_PORT` in `backend/.env`.
- **`database "herbsense_db" does not exist`**:
  - Ensure you created the database in Step 3 before running the SQL scripts.
- **Port Conflict (Port 5432 already in use)**:
  - If another PostgreSQL version is running on port 5432, specify the correct port in `backend/.env`.
