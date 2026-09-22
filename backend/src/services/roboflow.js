'use strict';

// ── Roboflow Workflow Configuration ───────────────────────────────────────────
// Workflow Name: medicinal plants dataset v-0.2 vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1 Logic
// Workspace: vimukthi-kavinda
// Workflow ID: medicinal-plants-dataset-v-02-vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1-logic
const DEFAULT_WORKFLOW_URL =
  'https://serverless.roboflow.com/vimukthi-kavinda/workflows/' +
  'medicinal-plants-dataset-v-02-vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1-logic';

const WORKFLOW_URL = process.env.ROBOFLOW_WORKFLOW_URL || DEFAULT_WORKFLOW_URL;

const REQUEST_TIMEOUT_MS = 35_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 800;

/**
 * Typed error class for Roboflow API issues.
 */
class RoboflowError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'RoboflowError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Promisified sleep for backoff delays.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Maps HTTP status codes to clear, user-actionable messages.
 */
function mapFriendlyError(status, rawMessage) {
  switch (status) {
    case 401:
      return 'Invalid Roboflow API Key. Please verify ROBOFLOW_API_KEY in backend/.env.';
    case 403:
      return 'Access forbidden. The provided API key does not have access to workspace "vimukthi-kavinda" or this workflow.';
    case 404:
      return 'Roboflow Workflow not found. Please verify the workflow is deployed in workspace "vimukthi-kavinda".';
    case 429:
      return 'Roboflow rate limit reached. Please wait a moment before making more requests.';
    default:
      return rawMessage || `Roboflow API returned error status ${status}.`;
  }
}

/**
 * Executes the Roboflow Workflow with retries, exponential backoff, and timeouts.
 *
 * @param {string} cleanBase64 - Base64 encoded image string (without data URI prefix)
 * @param {string} apiKey - Roboflow private API key
 * @returns {Promise<{ raw: object, predictions: Array<{class: string, confidence: number}> }>}
 */
async function runRoboflowWorkflow(cleanBase64, apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new RoboflowError(
      'Roboflow API key is not configured. Please set ROBOFLOW_API_KEY in backend/.env.',
      503
    );
  }

  if (!cleanBase64 || typeof cleanBase64 !== 'string' || cleanBase64.trim().length === 0) {
    throw new RoboflowError('Invalid image data provided for inference.', 400);
  }

  let lastError = null;
  let rawResult = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`[Roboflow Retry] Attempt ${attempt + 1}/${MAX_RETRIES + 1} after ${delay}ms...`);
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

      const response = await fetch(WORKFLOW_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.message || errData.error || `Roboflow returned HTTP ${response.status}`;

        // 4xx Client errors are non-retryable
        if (response.status >= 400 && response.status < 500) {
          throw new RoboflowError(mapFriendlyError(response.status, errMsg), response.status, errData);
        }

        // 5xx Server errors can be retried
        lastError = new RoboflowError(errMsg, response.status, errData);
        continue;
      }

      rawResult = await response.json();
      break; // Success
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof RoboflowError) {
        throw err;
      }

      if (err.name === 'AbortError') {
        lastError = new RoboflowError(
          `Roboflow request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
          504
        );
      } else {
        lastError = new RoboflowError(
          `Network error contacting Roboflow: ${err.message}`,
          502
        );
      }
    }
  }

  if (!rawResult) {
    throw lastError || new RoboflowError('Unknown error running Roboflow workflow.', 502);
  }

  // Defensively extract and sanitize predictions
  const predictions = extractPredictions(rawResult);

  return {
    raw: rawResult,
    predictions,
  };
}

/**
 * Defensively extracts plant detection predictions from the real workflow output keys.
 * Handles both detection blocks ({ predictions: [...] }), classification blocks,
 * and custom output mappings. Strips out raw heavy base64 visualization buffers
 * or polygon segmentation points to keep payloads light.
 *
 * @param {object} data - Raw workflow response
 * @returns {Array<{class: string, confidence: number}>}
 */
function extractPredictions(data) {
  const candidates = [];

  // Roboflow workflow response format: { outputs: [ { <outputKey>: ... } ] }
  const outputDict =
    Array.isArray(data?.outputs) && data.outputs.length > 0
      ? data.outputs[0]
      : typeof data === 'object' && data !== null
      ? data
      : {};

  for (const [, value] of Object.entries(outputDict)) {
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
    // (Standard Roboflow workflow detection block output format)
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

    // Pattern 4: Nested dict with top-level .predictions mapping: { 'aloe vera': 0.92, ... }
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

  // Deduplicate by class name (keep highest confidence score per class)
  const classMap = new Map();
  for (const item of candidates) {
    const normClass = item.class.trim();
    const existing = classMap.get(normClass);
    if (existing === undefined || item.confidence > existing) {
      classMap.set(normClass, item.confidence);
    }
  }

  // Sort descending by confidence and clamp score [0, 1]
  return Array.from(classMap.entries())
    .map(([cls, confidence]) => ({
      class: cls,
      confidence: Math.min(1, Math.max(0, confidence)),
    }))
    .sort((a, b) => b.confidence - a.confidence);
}

module.exports = {
  runRoboflowWorkflow,
  extractPredictions,
  RoboflowError,
  WORKFLOW_URL,
  DEFAULT_WORKFLOW_URL,
};

