# 🌿 HerbSense – Medicinal Plants Identifier

A full-stack web application for identifying medicinal plants and analyzing their therapeutic properties using computer vision. Built with **React** and **Tailwind CSS** on the frontend, and a secure **Node.js / Express** backend proxy connected to a custom **Roboflow YOLO11n AI Workflow**.

---

## 📌 Answers to Key Architecture Questions

### 1. Do we need to integrate a database?
**No, a database is NOT required for the core AI detection to work.**

- **Why it works without a database:**
  Plant identification is **real-time and stateless**:
  1. A user selects or captures a photo.
  2. The frontend sends the image to the backend server.
  3. The backend forwards the image to the Roboflow serverless inference endpoint.
  4. Roboflow evaluates the model and returns the detected plant class and confidence score.
  5. The backend parses the result and the frontend immediately displays the plant and its medicinal properties.
  Nothing needs to be saved to disk or a database for this cycle to function.

- **When would you need a database?**
  You only need to add a database (e.g. SQLite, PostgreSQL, or MongoDB) if you want:
  - **Scan History / Diary**: Allowing users to see their previous plant scans.
  - **User Accounts**: Login, saved favorites, or custom notes.
  - **Custom CMS**: Editing plant descriptions and remedies from an admin dashboard instead of the built-in botanical knowledge base.

---

### 2. What other things do you need to make the AI model work in the app?

To make the AI model actively identify plants, you need:

1. **Your Roboflow API Key**:
   - Get your Private API key from [app.roboflow.com/settings/api](https://app.roboflow.com/settings/api).
   - Paste it into `backend/.env` as `ROBOFLOW_API_KEY=your_key_here`.
2. **The Deployed Workflow Endpoint**:
   - The workflow is already configured in `backend/src/routes/detect.js`:
     - **Workspace**: `vimukthi-kavinda`
     - **Workflow ID**: `medicinal-plants-vmedicinal-plants-ls8os-5toge-1-yolo11n-t1-logic`
     - **Serverless URL**: `https://serverless.roboflow.com/infer/workflows/vimukthi-kavinda/medicinal-plants-vmedicinal-plants-ls8os-5toge-1-yolo11n-t1-logic`
3. **Backend Server Running**:
   - The backend acts as a **secure proxy**. It sends `Authorization: Bearer <API_KEY>` to Roboflow, so your API key is **never exposed in the user's browser**.
4. **Camera Permissions**:
   - When running locally, modern browsers permit camera access on `http://localhost:5173`. When deployed to production, your site must be served over `https://`.

---

## 📁 Project Structure

```
Medicinal Plants Identifier/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── detect.js          # Roboflow inference proxy with retries & defensive parser
│   │   └── server.js              # Express app, CORS, rate-limiting, health check
│   ├── .env                       # Your private API key (never committed to git)
│   ├── .env.example               # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # Sticky navigation with YOLO11n badge
│   │   │   ├── Hero.jsx           # Value proposition with herbal green gradient
│   │   │   ├── ImageUploadZone.jsx# Drag & drop upload and image preview
│   │   │   ├── CameraModal.jsx    # Live camera viewfinder with frame crosshair
│   │   │   ├── ResultsPanel.jsx   # Top detection, confidence bar, secondary candidates
│   │   │   ├── PlantInfoCard.jsx  # Botanical data, active compounds, precautions
│   │   │   ├── HowItWorks.jsx     # 3-step guide
│   │   │   ├── About.jsx          # Educational disclaimer and model overview
│   │   │   ├── Footer.jsx
│   │   │   └── Toast.jsx          # Notification toasts
│   │   ├── hooks/
│   │   │   ├── useCamera.js       # WebRTC camera capture hook (mobile rear camera)
│   │   │   └── useDetection.js    # AI identification state hook
│   │   ├── lib/
│   │   │   ├── api.js             # Calls /api/detect and /api/health
│   │   │   └── plantKnowledge.js  # Botanical profiles (Tulsi, Neem, Aloe Vera, etc.)
│   │   ├── App.jsx                # Main application component
│   │   ├── index.css              # Tailwind CSS directives
│   │   └── main.jsx
│   ├── index.html                 # Mobile-first viewport settings
│   ├── tailwind.config.js         # Organic green and muted blue color tokens (no neon)
│   ├── vite.config.js             # Dev server with /api proxy to port 3001
│   └── package.json
│
└── README.md
```

---

## 🚀 Step-by-Step Run Guide

### Step 1: Add Your Roboflow API Key
Open `backend/.env` in any text editor and add your key:
```env
ROBOFLOW_API_KEY=your_private_roboflow_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Step 2: Install and Start the Backend
Open a terminal in the root directory:
```bash
cd backend
npm install
npm run dev
```
You will see:
```
🌿 HerbSense Backend running on http://localhost:3001
🔑 Roboflow API key is loaded.
```

### Step 3: Install and Start the Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
You will see:
```
  VITE v5.3.4  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open and Test
1. Open **http://localhost:5173** in your browser.
2. Click **"Choose from Gallery"** or **"Open Camera"** to take a photo of a medicinal plant.
3. Click **"Identify Medicinal Plant"**.
4. View the identified plant name, confidence percentage bar, other candidate matches, and complete botanical & medicinal profile.

