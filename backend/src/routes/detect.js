'use strict';

const express = require('express');
const router = express.Router();

// ── Workflow Configuration ───────────────────────────────────────────────────
const WORKFLOW_URL =
  'https://serverless.roboflow.com/infer/workflows/vimukthi-kavinda/' +
  'medicinal-plants-vmedicinal-plants-ls8os-5toge-1-yolo11n-t1-logic';

const REQUEST_TIMEOUT_MS = 35_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 800;

/** Helper for exponential backoff delay */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/detect
 * Body: { image: "<base64 string or data:image/...;base64,...>" }
 */
router.post('/detect', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== 'string' || image.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required "image" field. Provide a valid base64 encoded image.',
      });
    }

    // Automatically strip data URL prefix if sent from frontend
    const cleanBase64 = image.replace(/^data:image\/[a-zA-Z0-9.+]+;base64,/, '').trim();

    if (!cleanBase64) {
      return res.status(400).json({
        error: 'The provided image data is empty or invalid.',
      });
    }

    const apiKey = process.env.ROBOFLOW_API_KEY?.trim();
    if (!apiKey) {
      return res.status(503).json({
        error:
          'Roboflow API key is not configured on the backend. Please add ROBOFLOW_API_KEY to backend/.env and restart the server.',
      });
    }

    // Call Roboflow Workflow endpoint with retries
    let lastError = null;
    let rawResult = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`[Detection Retry] Attempt ${attempt + 1}/${MAX_RETRIES + 1} after ${delay}ms...`);
        await sleep(delay);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const payload = {
          inputs: {
            image: {
              type: 'base64',
              value: cleanBase64,
            },
          },
        };

        const rfResponse = await fetch(WORKFLOW_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!rfResponse.ok) {
          const errData = await rfResponse.json().catch(() => ({}));
          const errMsg = errData.message || errData.error || `Roboflow returned status ${rfResponse.status}`;

          // Non-retryable client errors (400, 401, 403, 404)
          if (rfResponse.status >= 400 && rfResponse.status < 500) {
            return res.status(rfResponse.status).json({
              error: mapFriendlyError(rfResponse.status, errMsg),
            });
          }

          // 5xx Server errors are retryable
          lastError = new Error(errMsg);
          continue;
        }

        rawResult = await rfResponse.json();
        break; // Successfully got response
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          lastError = new Error('Roboflow request timed out after 35 seconds. Please try again.');
        } else {
          lastError = err;
        }
      }
    }

    if (!rawResult) {
      console.error('[Roboflow Workflow Failed]:', lastError?.message);
      return res.status(502).json({
        error: lastError?.message || 'Failed to communicate with Roboflow AI inference service.',
      });
    }

    // Defensively parse predictions from the workflow response
    const predictions = extractPredictions(rawResult);

    return res.json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (err) {
    console.error('[Detect Route Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal server error processing detection.' });
  }
});

/**
 * Defensively extracts predictions from Roboflow Workflow response
 * without hardcoding output field names.
 */
function extractPredictions(data) {
  const candidates = [];

  // Roboflow workflow standard format: { outputs: [ { <outputKey>: ... } ] }
  const outputDict =
    Array.isArray(data?.outputs) && data.outputs.length > 0
      ? data.outputs[0]
      : typeof data === 'object' && data !== null
      ? data
      : {};

  for (const [outputKey, value] of Object.entries(outputDict)) {
    if (!value || typeof value !== 'object') continue;

    // Pattern 1: Direct list of predictions [{ class: '...', confidence: 0.95 }, ...]
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === 'object') {
          const className = item.class || item.name || item.label;
          const conf = typeof item.confidence === 'number' ? item.confidence : parseFloat(item.confidence);
          if (className && !isNaN(conf)) {
            candidates.push({ class: String(className), confidence: conf });
          }
        }
      }
      continue;
    }

    // Pattern 2: Object with a .predictions array [{ class: '...', confidence: 0.95 }]
    if (Array.isArray(value.predictions)) {
      for (const item of value.predictions) {
        if (item && typeof item === 'object') {
          const className = item.class || item.name || item.label;
          const conf = typeof item.confidence === 'number' ? item.confidence : parseFloat(item.confidence);
          if (className && !isNaN(conf)) {
            candidates.push({ class: String(className), confidence: conf });
          }
        }
      }
      continue;
    }

    // Pattern 3: Classification format with top & predictions map:
    // { top: 'neem', confidence: 0.98, predictions: { 'neem': 0.98, 'tulsi': 0.02 } }
    if (value.top && typeof value.confidence === 'number') {
      if (value.predictions && typeof value.predictions === 'object' && !Array.isArray(value.predictions)) {
        for (const [cls, confVal] of Object.entries(value.predictions)) {
          const conf = typeof confVal === 'number' ? confVal : parseFloat(confVal);
          if (!isNaN(conf)) {
            candidates.push({ class: cls, confidence: conf });
          }
        }
      } else {
        candidates.push({ class: String(value.top), confidence: value.confidence });
      }
      continue;
    }

    // Pattern 4: Nested dict with a top-level .predictions mapping: { 'aloe vera': 0.92, ... }
    if (value.predictions && typeof value.predictions === 'object' && !Array.isArray(value.predictions)) {
      for (const [cls, confVal] of Object.entries(value.predictions)) {
        const conf = typeof confVal === 'number' ? confVal : parseFloat(confVal);
        if (!isNaN(conf)) {
          candidates.push({ class: cls, confidence: conf });
        }
      }
      continue;
    }
  }

  // Deduplicate by class name (keep the highest confidence score per class)
  const classMap = new Map();
  for (const item of candidates) {
    const normClass = item.class.trim();
    const existing = classMap.get(normClass);
    if (existing === undefined || item.confidence > existing) {
      classMap.set(normClass, item.confidence);
    }
  }

  // Sort descending by confidence
  return Array.from(classMap.entries())
    .map(([cls, confidence]) => ({
      class: cls,
      confidence: Math.min(1, Math.max(0, confidence)), // clamp [0, 1]
    }))
    .sort((a, b) => b.confidence - a.confidence);
}

function mapFriendlyError(status, rawMessage) {
  switch (status) {
    case 401:
      return 'Invalid Roboflow API Key. Please verify ROBOFLOW_API_KEY in backend/.env.';
    case 403:
      return 'Access forbidden. The provided API key does not have access to this Roboflow workspace or workflow.';
    case 404:
      return 'Roboflow Workflow not found. Please verify the workflow is deployed in workspace "vimukthi-kavinda".';
    case 429:
      return 'Roboflow rate limit reached. Please wait a minute before making more requests.';
    default:
      return rawMessage || `Roboflow API returned error status ${status}.`;
  }
}

module.exports = router;

