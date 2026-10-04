# 🌿 HerbSense – Medicinal Plants Identifier

A full-stack web application for identifying medicinal plants and analyzing their therapeutic properties using computer vision. Built with **React** and **Tailwind CSS** on the frontend, and a secure **Node.js / Express** backend proxy connected to a custom **Roboflow YOLO11n AI Workflow**.

Instead of trusting a single raw prediction, HerbSense follows a **guided identification pipeline**: it shows the top three predictions, asks plant-feature questions when the model is unsure, verifies or adjusts the answer, and finishes with herbarium information, similar plants and a safety warning.

> ⚠️ **Educational use only.** HerbSense is not medical advice. Never eat, brew or apply a plant based on an app identification alone.

---

## 🧭 Guided Identification Pipeline

1. The photo is sent to the Roboflow model (`POST /api/identify`).
2. The **top three predictions** and their **confidence scores** are generated.
3. **High confidence (75 % or more)** → the final result is shown straight away.
4. **Low or medium confidence (below 75 %)** → the **rule-based system** asks plant-feature questions (leaf arrangement, leaf shape, crushed-leaf scent, growth form). Only questions that tell the current candidates apart are asked.
5. The prediction is **verified or adjusted** (`POST /api/verify`). The combined score is `0.6 × image score + 0.4 × feature-match score`.
6. Related information is retrieved from the **digital herbarium** (`backend/src/data/plants.js`).
7. **Similar plants** are displayed, with tips for telling them apart.
8. The final result shows the **confidence score, plant information and a safety warning**.

| Confidence | Score | What happens |
|---|---|---|
| High | 75 % or more | Final result immediately |
| Medium | 45 % – 74 % | Feature questions, then a caution warning |
| Low | below 45 % | Feature questions, then a "do not use" warning |

---

## 📁 Project Structure

```
Medicinal Plants Identifier/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── plants.js            # Digital herbarium (12 plants, uses, precautions, look-alikes)
│   │   │   └── questions.js         # Rule-based feature questions
│   │   ├── routes/
│   │   │   ├── detect.js            # Original single-step Roboflow proxy
│   │   │   ├── describe.js          # AI field-notes description
│   │   │   ├── identify.js          # POST /api/identify and POST /api/verify
│   │   │   └── herbarium.js         # GET /api/herbarium and /api/herbarium/:name
│   │   ├── services/
│   │   │   ├── roboflow.js          # Roboflow workflow client with retries
│   │   │   ├── confidence.js        # Top-3 selection and high / medium / low levels
│   │   │   ├── ruleEngine.js        # Question selection and answer scoring
│   │   │   ├── herbarium.js         # Herbarium lookup and similar-plant matching
│   │   │   └── resultBuilder.js     # Final result payload and safety warning
│   │   ├── utils/
│   │   │   ├── text.js              # Label cleaning helpers
│   │   │   └── image.js             # Base64 image helper
│   │   └── server.js                # Express app, CORS, rate-limiting, health check
│   ├── test/
│   │   ├── pipeline.test.js         # Offline tests for the guided pipeline
│   │   └── smoke.test.js            # Smoke test
│   ├── .env                         # Your private keys (never committed to git)
│   ├── .env.example                 # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Sticky navigation
│   │   │   ├── Hero.jsx             # Value proposition
│   │   │   ├── ImageUploadZone.jsx  # Drag & drop upload and preview
│   │   │   ├── CameraModal.jsx      # Live camera viewfinder
│   │   │   ├── Top3Predictions.jsx  # Top-3 predictions with confidence bars
│   │   │   ├── VerificationQuestions.jsx  # Plant-feature question form
│   │   │   ├── VerificationSummary.jsx    # Verified / adjusted / skipped outcome
│   │   │   ├── ResultsPanel.jsx     # Final result, candidates, AI notes
│   │   │   ├── PlantInfoCard.jsx    # Botanical data, compounds, precautions
│   │   │   ├── SimilarPlants.jsx    # Look-alike plants and how to tell them apart
│   │   │   ├── WarningBanner.jsx    # Safety warning
│   │   │   ├── HowItWorks.jsx       # 3-step guide
│   │   │   ├── About.jsx            # Educational disclaimer
│   │   │   ├── Footer.jsx
│   │   │   └── Toast.jsx            # Notification toasts
│   │   ├── hooks/
│   │   │   ├── useCamera.js         # WebRTC camera capture hook
│   │   │   ├── useIdentification.js # Guided identification flow
│   │   │   └── usePlantDescription.js  # AI description state
│   │   ├── lib/
│   │   │   ├── api.js               # Backend API client
│   │   │   ├── confidence.js        # Confidence colours and labels
│   │   │   └── plantKnowledge.js    # Bundled fallback plant profiles
│   │   ├── App.jsx                  # Main application component
│   │   ├── index.css                # Tailwind CSS directives
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js               # Dev server with /api proxy to port 3001
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start (Zero Setup Required)

Everything is pre-configured out of the box, including the hosted **Supabase Cloud Database**, Roboflow AI workflow, and plain-language botanical description service.

**Requirements:** Node.js 18.11 or newer.

### Step 1: Start the Backend Server
Open a terminal in the project directory:
```bash
cd backend
npm install
npm run dev
```
You will see:
```
===============================================
🌿 HerbSense Backend running on http://localhost:3001
🔑 Roboflow API key is loaded.
===============================================
```

### Step 2: Start the Frontend Application
Open a second terminal in the project directory:
```bash
cd frontend
npm install
npm run dev
```
You will see:
```
  VITE v5.4.x  ready in ... ms

  ➜  Local:   http://localhost:5173/
```
Keep **both** terminals open while you use the application.

### Step 3: Open in Browser
Open **http://localhost:5173** in your web browser. You can immediately:
- Scan or upload any plant photo (guest mode or signed in).
- Sign in or create an account with email or username to save scans and bookmark plants.
- View your persistent scan history and expand each card to read the AI botanical description.
- Review guided identification verification questions when confidence needs confirmation.

### Step 4: Open and Test
1. Open **http://localhost:5173** in your browser.
2. Click **"Choose from Gallery"** or **"Open Camera"** and add a photo of a medicinal plant.
3. Click **"Identify Medicinal Plant"**.
4. If the model is confident, the result appears immediately. Otherwise, answer the plant-feature questions (choose "Not sure" for anything you cannot check) or skip them.
5. Review the identified plant, confidence score, herbarium profile, similar plants and safety warning.

After identification, HerbSense sends the top plant name to the second model and displays its plain-language field description. If that model is unavailable, the identification result still loads and the description can be retried from the result card.

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server status and which keys are configured |
| POST | `/api/identify` | Top-3 predictions, then questions or a final result |
| POST | `/api/verify` | Verify or adjust the ranking with the feature answers |
| POST | `/api/detect` | Original single-step detection |
| POST | `/api/describe` | AI plain-language description of a plant |
| GET | `/api/herbarium` | List the plants in the digital herbarium |
| GET | `/api/herbarium/:name` | One herbarium record plus similar plants |

Any extra Express router file placed in `backend/src/routes/` is mounted under `/api` automatically.

---

## 🧪 Tests

```bash
cd backend
npm run test:unit
```
These tests run fully offline (the Roboflow call is replaced by a stub), so no API key or internet connection is needed.

---

## 🌱 Adding a Plant to the Herbarium

Add an entry to `backend/src/data/plants.js`. The `features` values must match the option values in `backend/src/data/questions.js` (the test suite checks this). Plants that are missing from the herbarium still get a result, but with no reference details, no feature questions and a warning saying so.

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot reach the backend server` or a bare `500` error | The backend is not running. Run `npm run dev` inside `backend/`. |
| `EADDRINUSE: address already in use :::3001` | An old backend is still running. Stop it (Ctrl+C in its terminal), or on Windows run `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force`. |
| `CORS blocked for origin` | Update `backend/src/server.js` to the latest version. It allows any `localhost` port. For a deployed site, set `FRONTEND_URL`. |
| Vite shows `Failed to resolve import` | A file is missing or in the wrong folder. Check the path in the error against the structure above. |
| `Roboflow API key required` banner | Add `ROBOFLOW_API_KEY` to `backend/.env` and restart the backend. |

---

## 🔒 Security

- Never commit `backend/.env`. The `.gitignore` excludes it, but a file that was committed earlier must also be removed with `git rm --cached backend/.env`.
- If a key was ever committed, **rotate it**. Removing the file does not remove it from git history.
- The backend rate-limits `/api` requests to protect your inference credits.