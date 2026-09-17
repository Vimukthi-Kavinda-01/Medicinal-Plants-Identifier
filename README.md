# 🌿 HerbSense – Medicinal Plants Identifier

A full-stack web application for identifying medicinal plants and analyzing their therapeutic properties using computer vision. Built with **React** and **Tailwind CSS** on the frontend, and a secure **Node.js / Express** backend proxy connected to a custom **Roboflow YOLO11n AI Workflow**.

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
DESCRIPTION_API_KEY=your_description_model_key
DESCRIPTION_API_URL=https://api.openai.com/v1/chat/completions
DESCRIPTION_MODEL=gpt-4o-mini
PORT=3001
FRONTEND_URL=http://localhost:5173
```

The description request uses the OpenAI-compatible Chat Completions format. OpenAI works with the defaults above; other compatible providers only need their endpoint and model name changed. Keep both keys in `backend/.env` only.

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

After identification, HerbSense sends the top plant name to the second model and displays its plain-language field description. If that model is unavailable, the identification result still loads and the description can be retried from the result card.

