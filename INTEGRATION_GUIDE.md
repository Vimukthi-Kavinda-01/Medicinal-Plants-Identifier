# HerbSense – Roboflow Workflow Integration Guide

This guide details how the **Roboflow Workflow** is integrated into HerbSense.

---

## 🌿 Integrated Workflow Details

- **Workflow Name:** `medicinal plants dataset v-0.2 vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1 Logic`
- **Workspace:** `vimukthi-kavinda`
- **Workflow ID:** `medicinal-plants-dataset-v-02-vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1-logic`
- **Serverless Run Endpoint:**
  ```http
  POST https://serverless.roboflow.com/vimukthi-kavinda/workflows/medicinal-plants-dataset-v-02-vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1-logic
  ```
- **Declared Inputs:**
  - `image`: Image file payload sent as `{ "type": "base64", "value": "<base64_data>" }`

---

## 🔒 Security & Architecture

1. **Backend Proxy Pattern:**
   The browser never communicates directly with Roboflow. Instead:
   - Frontend sends the image to `POST /api/detect`.
   - Express backend loads `ROBOFLOW_API_KEY` from `backend/.env`.
   - Backend sends request to Roboflow Serverless with `Authorization: Bearer <API_KEY>`.
   - Your private API key is never exposed in browser network inspection.

2. **Inference Client Features (`backend/src/services/roboflow.js`):**
   - **Timeout Protection:** 35-second AbortController timeout.
   - **Exponential Backoff:** Retries up to 2 times on transient network / 5xx server issues.
   - **Defensive Parsing:** Parses the output dictionary dynamically without assuming hard-coded output block names.
   - **Memory Efficiency:** Strips out heavy base64 visualization layers and raw polygon coordinates, returning only normalized `{ class, confidence }`.

---

## 🧪 Smoke Testing

You can verify the connection to the workflow at any time:

```bash
cd backend
npm test
```

This runs `backend/test/smoke.test.js`, which sends a test payload, verifies HTTP status 200, checks the output structure, and validates prediction normalization.
