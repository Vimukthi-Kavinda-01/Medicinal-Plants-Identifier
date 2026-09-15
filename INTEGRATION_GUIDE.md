# HerbSense – Roboflow Integration Guide

## Step-by-Step: Connect Your Trained Model

> **Prerequisites**: You have already trained a medicinal plants model on [roboflow.com](https://roboflow.com) and it is published/deployed.

---

## Step 1 — Find Your API Key

1. Log in to **[roboflow.com](https://roboflow.com)**
2. Click your **profile avatar** (top-right) → **Settings**
3. Go to the **"Roboflow API"** tab
4. Copy your **Private API Key** (starts with letters/numbers)

> 🔒 Your API key is stored only in your browser's `localStorage`. It is never sent to any server other than Roboflow's.

---

## Step 2 — Find Your Model Details

In Roboflow, open your trained project and note down:

| Field | Where to find it | Example |
|-------|-----------------|---------|
| **Workspace** | URL slug after `app.roboflow.com/` | `john-doe` |
| **Model / Project Name** | URL slug after workspace | `medicinal-plants-v2` |
| **Version** | The version number you deployed | `1` |

**Example Roboflow URL:**
```
https://app.roboflow.com/john-doe/medicinal-plants-v2/1
                           ^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^  ^
                           workspace    model name       version
```

---

## Step 3 — Determine Your Model Type

Roboflow supports two types of models relevant to plant identification:

| Model Type | Use Case | API Endpoint |
|------------|----------|-------------|
| **Classification** | "What plant is this?" (whole image) | `classify.roboflow.com` |
| **Object Detection** | "Find plants in the image with bounding boxes" | `detect.roboflow.com` |

✅ **For plant identification, Classification is recommended** — it classifies the entire image.

The app automatically tries Classification first, then falls back to Detection.

---

## Step 4 — Configure the App

1. Open **HerbSense** in your browser (`index.html`)
2. Click the **"Configure"** button in the blue banner at the top
3. Fill in the form:
   - **API Key** → paste from Step 1
   - **Workspace** → your workspace slug
   - **Model Name** → your project slug
   - **Version** → model version number
4. Click **"Save Configuration"**

The banner will turn **green** and show your model name — you're ready!

---

## Step 5 — Test Your Integration

1. Click **"Upload Image"** and choose a plant photo
2. Click **"Identify Plant"**
3. Results will appear below with:
   - Top predicted plant name
   - Confidence score (%)
   - Other possible matches

---

## Troubleshooting

### ❌ API Error 401 — Unauthorized
- Check your API key is correct (no extra spaces)
- Make sure you copied the **Private** key, not the publishable key

### ❌ API Error 404 — Not Found  
- Check the model name and version number exactly match what's in Roboflow
- Make sure your model version is **deployed** (not just trained)
  - In Roboflow: open your version → click **"Deploy"** → choose **"Hosted API"**

### ❌ CORS Error in browser
- This can happen if serving from `file://` protocol
- **Fix**: Serve using a local server:
  ```sh
  # Python
  python -m http.server 8080

  # Node.js (npx)
  npx serve .

  # VS Code: use "Live Server" extension
  ```
- Then open `http://localhost:8080` in your browser

### ❌ No predictions returned
- Make sure your model is **trained and deployed** in Roboflow
- Try a clearer image with good lighting
- Ensure the plant is clearly visible and fills the frame

---

## Adding Plant Knowledge

Open `app.js` and find the `PLANT_KNOWLEDGE` object near the top. Add your plants:

```javascript
const PLANT_KNOWLEDGE = {
  'your-plant-name': {
    scientific: 'Scientific name',
    family: 'Plant family',
    uses: 'Medicinal uses...',
    habitat: 'Where it grows...',
    caution: 'Safety warnings...'
  },
  // more plants...
};
```

The key must match the class name from your Roboflow model (case-insensitive, spaces or hyphens normalized).

---

## API Reference (Roboflow)

**Classification Endpoint:**
```
POST https://classify.roboflow.com/{model}/{version}?api_key={key}
Content-Type: application/x-www-form-urlencoded
Body: {base64-encoded-image}
```

**Detection Endpoint:**
```
POST https://detect.roboflow.com/{model}/{version}?api_key={key}
Content-Type: application/x-www-form-urlencoded
Body: {base64-encoded-image}
```

**Example successful response (Classification):**
```json
{
  "time": 0.045,
  "image": { "width": 640, "height": 480 },
  "top": "aloe vera",
  "confidence": 0.9823,
  "predictions": {
    "aloe vera": 0.9823,
    "neem": 0.0124,
    "tulsi": 0.0053
  }
}
```

---

## File Structure

```
Medicinal Plants Identifier/
├── index.html     ← Main HTML structure
├── style.css      ← All styles (mobile-first, green/white/blue)
├── app.js         ← Application logic + Roboflow API calls
└── INTEGRATION_GUIDE.md  ← This guide
```

