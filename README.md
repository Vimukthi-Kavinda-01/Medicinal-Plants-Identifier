# 🌿 HerbSense – Intelligent Medicinal Plants Identifier & Digital Herbarium

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646C99?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud_DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![YOLO11n](https://img.shields.io/badge/YOLO11n-Roboflow_Workflow-00FFFF?style=flat-square&logo=roboflow&logoColor=black)](https://roboflow.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **HerbSense** is a full-stack, AI-powered botanical identification platform that pairs computer vision with a rule-based botanical expert system and a cloud-hosted digital herbarium. It eliminates single-model blind spots by guiding users through discriminating botanical verification questions when model confidence is uncertain.

---

> [!WARNING]
> **Educational & Research Use Only:** HerbSense is designed for academic, research, and educational purposes. Never ingest, brew, or topically apply any plant based solely on algorithmic identification. Toxic look-alikes exist in nature; always consult a certified botanist or medical professional.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Hybrid Identification Architecture](#-hybrid-identification-architecture)
- [Supported Medicinal Species](#-supported-medicinal-species)
- [Quick Start (Zero Setup Required)](#-quick-start-zero-setup-required)
- [System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [API Reference](#-api-reference)
- [Repository Structure](#-repository-structure)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Troubleshooting](#-troubleshooting)
- [Team & Acknowledgments](#-team--acknowledgments)

---

## ✨ Key Features

### 🔍 1. Hybrid AI Identification Engine
- **Computer Vision First-Pass:** Uses a custom **YOLO11n** model deployed via Roboflow to extract top candidates with sub-second latency.
- **Confidence-Driven Branching:**
  - **High Confidence ($\ge 75\%$):** Instantly displays the identified plant, active compounds, and safety profile.
  - **Medium/Low Confidence ($< 75\%$):** Triggers the **Dynamic Feature Verification Engine**, prompting the user with tailored questions about physical characteristics (leaf margin, arrangement, stem type, crushed scent).
- **Evidence Fusion:** Combines visual probabilities ($60\%$) with morphological evidence ($40\%$) to produce a validated result.

### 📚 2. Digital Herbarium & Botanical Profiles
- Comprehensive profiles for **37+ medicinal plant species**, detailing:
  - Botanical taxonomy (binomial nomenclature, family, common names).
  - Therapeutic applications & active phytochemicals.
  - Preparation guidelines, dosage cautions, and contraindications.
  - Side-by-side look-alike warnings (distinguishing medicinal plants from toxic look-alikes).

### 🤖 3. AI Botanical Field Notes
- Integrates LLM field notes powered by OpenAI-compatible inference (NVIDIA NIM Nemotron-3 / OpenAI), generating structured, plain-language identification guidance with automated in-memory caching and exponential backoff retry.

### 🔐 4. Cloud Authentication & Scan History
- **Supabase Cloud PostgreSQL:** High-availability cloud database using universal IPv4 connection pooling.
- **JWT Authentication:** Secure user registration, login, and session persistence.
- **Scan History Dashboard:** Automatically logs scanned plants, confidence scores, dates, and AI notes to user profiles with expandable cards.
- **Guest Mode Support:** Full identification pipeline accessible immediately without requiring login.

---

## 🧭 Hybrid Identification Architecture

```mermaid
flowchart TD
    A["📸 User captures or uploads plant photo"] --> B["POST /api/identify\n(Roboflow YOLO11n Inference)"]
    B --> C{"Top-1 Confidence Score"}
    
    C -- "High (≥ 75%)" --> D["Direct Verification Pass"]
    C -- "Medium / Low (< 75%)" --> E["Rule Engine selects discriminating questions\n(Leaf shape, scent, arrangement, growth form)"]
    
    E --> F["User answers interactive verification questions"]
    F --> G["POST /api/verify\nWeighted Fusion: (0.6 × Image) + (0.4 × Rule Score)"]
    
    D --> H["Query Herbarium & Supabase Cloud DB"]
    G --> H
    
    H --> I["Fetch AI Botanical Field Notes\n(NVIDIA NIM / LLM Service)"]
    I --> J["Render Results Dashboard:\n• Final Botanical Profile\n• Look-alike Warnings\n• Therapeutic Uses & Precautions"]
    J --> K{"User Logged In?"}
    K -- "Yes" --> L["Persist to Supabase scan_history"]
    K -- "No (Guest)" --> M["Display in session"]
```

### Confidence Decision Matrix

| Confidence Tier | Score Range | System Action | Safety Warning Level |
|---|---|---|---|
| **High** | $\ge 75\%$ | Immediate profile rendering | Standard educational note |
| **Medium** | $45\% - 74\%$ | Discriminates top-3 via botanical questions | Cautionary verification warning |
| **Low** | $< 45\%$ | Requires multi-question confirmation | Strict "Do Not Ingest" safety alert |

---

## 🌿 Supported Medicinal Species

HerbSense includes botanical profiles and detection capabilities for **37+ medicinal species**:

| Common Name | Scientific Name | Key Traditional Applications |
|---|---|---|
| **Aloe Vera** | *Aloe barbadensis miller* | Skin burns, wound healing, soothing digestant |
| **Artemisia (Wormwood)** | *Artemisia annua / absinthium* | Antimicrobial, febrifuge, digestive tonic |
| **Ashoka** | *Saraca asoca* | Gynecological support, anti-inflammatory |
| **Ashwagandha** | *Withania somnifera* | Adaptogen, stress reduction, vitality tonic |
| **Avocado Leaf** | *Persea americana* | Diuretic, mild hypertension, anti-inflammatory |
| **Bamboo** | *Bambusa vulgaris* | Silica source, joint health, astringent |
| **Betel Leaf** | *Piper betle* | Oral hygiene, antimicrobial, carminative |
| **Bitter Melon Leaf** | *Momordica charantia* | Blood glucose regulation, metabolic health |
| **Boat Lily** | *Tradescantia spathacea* | Respiratory soothing, anti-inflammatory |
| **Brahmi** | *Bacopa monnieri* | Cognitive enhancement, memory, neuroprotection |
| **Candelabra Spurge** | *Euphorbia lactea* | Traditional topical use *(Caution: Toxic latex)* |
| **Cassava Leaf** | *Manihot esculenta* | Protein, antioxidant *(Requires cooking)* |
| **Castor** | *Ricinus communis* | Topical emollient *(Caution: Toxic seeds)* |
| **Climbing Ylang-Ylang** | *Artabotrys hexapetalus* | Aromatherapy, relaxing traditional infusion |
| **Coconut Leaf** | *Cocos nucifera* | Traditional antiseptic washes, astringent |
| **Five-Leaved Chaste Tree** | *Vitex negundo* | Joint pain, headache, respiratory catarrh |
| **Guava Leaf** | *Psidium guajava* | Antidiarrheal, oral rinse, antimicrobial |
| **Heart-leaved Moonseed** | *Tinospora cordifolia (Guduchi)* | Immunomodulator, fever management, detox |
| **Indian Borage** | *Plectranthus amboinicus* | Cough, sore throat, respiratory clearing |
| **Indian Gooseberry** | *Phyllanthus emblica (Amla)* | High Vitamin C, immune tonic, antioxidant |
| **Lemon Leaf** | *Citrus limon* | Carminative, calming tea, vitamin source |
| **Lemongrass** | *Cymbopogon citratus* | Digestive soothing, antipyretic, repellent |
| **Malabar Spinach** | *Basella alba* | Laxative, demulcent, iron & mineral rich |
| **Mango Leaf** | *Mangifera indica* | Mild diabetic management, oral astringent |
| **Mint** | *Mentha piperita* | Irritable bowel relief, carminative, cooling |
| **Moon Orchid** | *Phalaenopsis amabilis* | Traditional cooling compresses |
| **Moringa** | *Moringa oleifera* | Nutrient-dense superfood, anti-inflammatory |
| **Neem** | *Azadirachta indica* | Potent antibacterial, antifungal, skin disorders |
| **Oleander** | *Nerium oleander* | **⚠️ HIGHLY TOXIC** *(Detected for safety warning)* |
| **Oregano** | *Origanum vulgare* | Potent antibacterial, carminative, respiratory |
| **Papaya Leaf** | *Carica papaya* | Platelet support, digestive enzymes (papain) |
| **Black Pepper** | *Piper nigrum* | Bioavailability enhancer (piperine), digestive |
| **Pepper Elder** | *Peperomia pellucida* | Uric acid reduction, gout, anti-inflammatory |
| **Physic Nut** | *Jatropha curcas* | Topical wound dressing *(Caution: Toxic seed)* |
| **Ringworm Bush** | *Senna alata* | Potent antifungal, tinea, ringworm treatments |
| **Sapodilla Leaf** | *Manilkara zapota* | Mild astringent, antidiabetic traditional uses |
| **Sweet Potato Leaf** | *Ipomoea batatas* | Antioxidant lutein source, immune support |

---

## 🚀 Quick Start (Zero Setup Required)

HerbSense is configured to run **out-of-the-box**. The repository includes pre-configured environment credentials for the Roboflow vision model, Supabase Cloud Database, and AI notes.

### Prerequisites
- [Node.js](https://nodejs.org/) **18.11 or higher**
- Modern Web Browser (Chrome, Firefox, Edge, Safari)
- Camera access (optional, for live viewfinder)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Vimukthi21/Medicinal-Plants-Identifier.git
cd "Medicinal Plants Identifier"
```

---

### Step 2: Start the Backend Service
Open your first terminal in the project root:
```bash
cd backend
npm install
npm run dev
```
*Expected output:*
```
===============================================
🌿 HerbSense Backend running on http://localhost:3001
🔑 Roboflow API key is loaded.
📊 Database Connected: Supabase Cloud PostgreSQL
===============================================
```

---

### Step 3: Start the Frontend Application
Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
*Expected output:*
```
  VITE v5.4.x  ready in 280 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 4: Open and Explore
1. Navigate to **`http://localhost:5173`** in your browser.
2. Drag and drop a plant image, choose a photo from your gallery, or use your live camera.
3. Click **"Identify Medicinal Plant"**.
4. Test the pipeline:
   - For ambiguous images, answer the plant-feature questions or click **"Skip Questions"**.
   - Review botanical names, active compounds, look-alikes, and AI field notes.
   - Click **"Sign In"** in the top navigation bar to create an account, save scans, and build your digital field history.

---

## 🏗️ System Architecture & Tech Stack

```
                    ┌──────────────────────────────────────────────┐
                    │               CLIENT BROWSER                 │
                    │   React 18 + Vite + Tailwind CSS + Phosphor  │
                    └──────────────────────┬───────────────────────┘
                                           │ HTTP / JSON (Port 5173 -> 3001)
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │            NODE.JS / EXPRESS API             │
                    │  Rate Limiting, Auth Middleware, Rule Engine │
                    └──────┬───────────────┬───────────────┬───────┘
                           │               │               │
        ┌──────────────────┘               │               └──────────────────┐
        ▼                                  ▼                                  ▼
┌─────────────────┐             ┌─────────────────────┐             ┌───────────────────┐
│ ROBOFLOW VISION │             │   SUPABASE CLOUD    │             │   LLM FIELD NOTES │
│ YOLO11n Workflow│             │ PostgreSQL Database │             │ NVIDIA NIM / OAI  │
│ Computer Vision │             │ Auth, Scans, Plants │             │ Botanical Summary │
└─────────────────┘             └─────────────────────┘             └───────────────────┘
```

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3 | Responsive mobile-first UI, camera capture, verification modal |
| **Icons** | `@phosphor-icons/react` | Modern botanical and system iconography |
| **Backend** | Node.js, Express 4.19 | REST API proxy, CORS handling, rate-limiting, rule engine |
| **Vision Model** | Roboflow Hosted YOLO11n | Object detection & plant species classification |
| **Database** | Supabase Cloud PostgreSQL | Cloud relational storage for accounts, scans, and botanical data |
| **Authentication** | JWT (`jsonwebtoken`), `bcrypt` | Secure password hashing, token validation, session management |
| **AI Descriptions**| NVIDIA NIM / OpenAI API | Dynamic botanical field notes with backoff caching |
| **Testing** | Node.js Built-in Test Runner (`node --test`)| 15 automated offline unit tests for the guided pipeline |

---

## 🔌 API Reference

### Identification & Guidance Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/identify` | Initial image evaluation. Returns top-3 predictions, questions if uncertain, or immediate result | No |
| `POST` | `/api/verify` | Submits answers to morphological questions; recalculates confidence ($0.6 \times \text{img} + 0.4 \times \text{rule}$) | No |
| `POST` | `/api/detect` | Legacy raw single-step Roboflow workflow inference | No |
| `POST` | `/api/describe` | Generates plain-language AI field notes for an identified plant | No |
| `GET` | `/api/herbarium` | Retrieves all registered plants in the digital herbarium | No |
| `GET` | `/api/herbarium/:name` | Retrieves a single plant's taxonomy, look-alikes, and precautions | No |
| `GET` | `/api/health` | Diagnostic endpoint reporting API, database, and key statuses | No |

### User Accounts & Saved Scans Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user with username, email, and password | No |
| `POST` | `/api/auth/login` | Authenticate with username/email and password, returns JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile details | **Yes** (`Bearer`) |
| `GET` | `/api/scans/my` | Retrieve logged-in user's historical plant scans | **Yes** (`Bearer`) |
| `POST` | `/api/scans` | Save a scan result to database (associated to user or guest) | Optional |
| `GET` | `/api/plants` | Query plant catalog from PostgreSQL database | No |
| `POST` | `/api/saved-plants` | Bookmark a plant to personal collection | **Yes** (`Bearer`) |
| `DELETE` | `/api/saved-plants/:id` | Remove a plant from personal bookmarks | **Yes** (`Bearer`) |

---

## 📁 Repository Structure

```
Medicinal Plants Identifier/
├── docs/
│   └── HERBSENSE -Group 38.pdf      # Architecture, presentation & tech slides
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── plants.js            # Offline herbarium dataset & look-alike mappings
│   │   │   └── questions.js         # Rule engine feature verification questions
│   │   ├── db/
│   │   │   └── index.js             # Supabase PostgreSQL pool connection (IPv4 safe)
│   │   ├── middleware/
│   │   │   └── authenticate.js      # JWT token authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js              # User registration, login, and verification
│   │   │   ├── describe.js          # AI botanical description service
│   │   │   ├── detect.js            # Raw vision detection proxy
│   │   │   ├── herbarium.js         # Digital herbarium lookup endpoints
│   │   │   ├── identify.js          # Guided identification (identify + verify)
│   │   │   ├── plants.js            # Botanical records CRUD routes
│   │   │   ├── savedPlants.js       # User plant bookmarking routes
│   │   │   ├── scans.js             # User scan history persistence
│   │   │   └── users.js             # Profile management
│   │   ├── services/
│   │   │   ├── confidence.js        # Prediction ranking and confidence tiers
│   │   │   ├── herbarium.js         # Botanical lookup and look-alike resolver
│   │   │   ├── resultBuilder.js     # Formats final response with safety alerts
│   │   │   ├── roboflow.js          # Roboflow inference client with retry logic
│   │   │   └── ruleEngine.js        # Dynamic discriminating question selector
│   │   ├── utils/
│   │   │   ├── image.js             # Base64 payload validation & normalization
│   │   │   └── text.js              # Label formatting & normalization
│   │   └── server.js                # Express app setup, CORS, and route mounting
│   ├── test/
│   │   ├── pipeline.test.js         # 15 automated offline unit tests
│   │   └── smoke.test.js            # Live connection smoke test
│   ├── database.sql                 # PostgreSQL DDL schema definition
│   ├── seed.sql                     # Botanical database seed dataset (37+ plants)
│   ├── .env                         # Preconfigured environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.jsx            # Educational mission & ethical disclaimer
│   │   │   ├── AuthModal.jsx        # Modal dialog for Sign In / Registration
│   │   │   ├── CameraModal.jsx      # WebRTC live camera viewfinder
│   │   │   ├── ErrorBoundary.jsx    # UI crash protection boundary
│   │   │   ├── Header.jsx           # Responsive sticky header with user avatar
│   │   │   ├── Hero.jsx             # Hero section with primary CTA
│   │   │   ├── HowItWorks.jsx       # Visual 3-step explanation of the pipeline
│   │   │   ├── ImageUploadZone.jsx  # Drag & drop upload with preview
│   │   │   ├── PlantInfoCard.jsx    # Botanical information & pharmacology card
│   │   │   ├── ResultsPanel.jsx     # Master results view with candidates & AI notes
│   │   │   ├── ScanHistory.jsx      # Expandable past scans dashboard
│   │   │   ├── SimilarPlants.jsx    # Side-by-side look-alikes comparison
│   │   │   ├── Toast.jsx            # Dynamic alert notifications
│   │   │   ├── Top3Predictions.jsx  # Ranked candidates with visual confidence bars
│   │   │   ├── VerificationQuestions.jsx # Interactive morphological question form
│   │   │   ├── VerificationSummary.jsx   # Feedback on how verification altered score
│   │   │   └── WarningBanner.jsx    # Context-sensitive toxicity alerts
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global user authentication provider
│   │   ├── hooks/
│   │   │   ├── useCamera.js         # WebRTC camera stream management
│   │   │   ├── useIdentification.js # State machine managing the 2-stage pipeline
│   │   │   └── usePlantDescription.js # AI description fetching hook
│   │   ├── lib/
│   │   │   ├── api.js               # Typed client for all backend endpoints
│   │   │   ├── confidence.js        # Score thresholds and badge styling
│   │   │   └── plantKnowledge.js    # Client-side botanical data
│   │   ├── App.jsx                  # Main application orchestrator
│   │   ├── index.css                # Tailwind directives and custom scrollbars
│   │   └── main.jsx
│   ├── .env                         # Frontend environment configuration
│   ├── tailwind.config.js           # Botanical color palette configurations
│   ├── vite.config.js               # Dev server configuration with backend proxy
│   └── package.json
└── README.md
```

---

## 🧪 Testing & Quality Assurance

HerbSense includes a comprehensive offline test suite verifying pipeline integrity, scoring logic, question selection, and edge-case handling without requiring external network calls or Roboflow credits.

```bash
cd backend
npm run test:unit
```

### Verified Test Suites (15/15 Passing):
- ✔ **Confidence thresholds:** Correct assignment of High ($\ge 0.75$), Medium ($0.45 - 0.74$), and Low ($< 0.45$).
- ✔ **Top-3 Selection:** Proper sorting, label deduplication, and candidate structure.
- ✔ **Herbarium consistency:** Cross-validates all 37 species against defined botanical feature options.
- ✔ **Alias resolution:** Matches noisy inputs and alternate colloquial names to standard botanical records.
- ✔ **Similar plant matching:** Ensures look-alikes are surfaced correctly and never match the candidate itself.
- ✔ **Rule Engine:** Dynamically selects only discriminating questions that differentiate candidate species.
- ✔ **Answer Sanitization:** Robust handling of omitted, malformed, or "unsure" inputs.
- ✔ **Evidence Fusion:** Verifies candidate rank adjustment when user answers contradict initial visual guess.
- ✔ **Safety Warnings:** Automatically maps low confidence and toxic species to elevated warning tiers.
- ✔ **HTTP Route Isolation:** Verifies `/api/identify`, `/api/verify`, and `/api/herbarium` status codes and payloads.

---

## ⚙️ Environment Variables Reference

Both frontend and backend `.env` files are tracked in git for immediate out-of-the-box evaluation. For custom deployment, configure the following:

### Backend (`backend/.env`)
```ini
# Server Port
PORT=3001

# Allowed Frontend Origins (comma-separated)
FRONTEND_URL=http://localhost:5173

# Roboflow Vision Workflow API
ROBOFLOW_API_KEY=your_roboflow_key_here
ROBOFLOW_WORKFLOW_URL=https://detect.roboflow.com/infer/workflows/...

# Supabase Cloud Database (PostgreSQL Connection URI)
DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres

# JWT Secret for User Authentication
JWT_SECRET=your_jwt_secret_here

# AI Field Notes (OpenAI / NVIDIA NIM)
OPENAI_API_KEY=your_ai_api_key_here
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
OPENAI_MODEL=nvidia/nemotron-3-nano-omni-30b-a3b-reasoning
```

### Frontend (`frontend/.env`)
```ini
# Base URL for API requests (handled via Vite proxy in development)
VITE_API_BASE_URL=http://localhost:3001
```

---

## 🛠️ Troubleshooting

### 1. `Cannot reach the backend server` / Network Error
- Make sure the backend server is running in its own terminal window (`cd backend && npm run dev`).
- Verify that `http://localhost:3001/api/health` returns `{"status":"ok"}`.

### 2. `EADDRINUSE: address already in use :::3001`
- Another instance of the backend is running. Stop it with `Ctrl + C`, or kill the process:
  - **Windows (PowerShell):**
    ```powershell
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
    ```
  - **Linux / macOS:**
    ```bash
    kill -9 $(lsof -t -i:3001)
    ```

### 3. Account Creation Fails on Other Machines
- HerbSense uses the **IPv4 Supabase Transaction Pooler** (`aws-0-ap-northeast-1.pooler.supabase.com:5432`), ensuring compatibility across all ISP and dual-stack IPv4/IPv6 networks without local PostgreSQL dependencies. Ensure your machine has active internet access.

---

## 🛡️ License & Medical Disclaimer

This project is licensed under the **MIT License**.

```
MEDICAL DISCLAIMER:
The content, predictions, and botanical data provided by HerbSense are for informational and educational 
purposes only. HerbSense does not provide medical advice, diagnosis, or treatment. Never disregard 
professional medical advice or delay seeking it because of something you have read on this application. 
Extreme caution is advised: misidentification of wild plants can lead to severe illness or fatal poisoning.
```

---

<p align="center">
  <b>🌿 HerbSense — Group 38</b><br>
  <i>Empowering Traditional Botanical Knowledge with Modern Computer Vision</i>
</p>