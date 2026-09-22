/**
 * HerbSense – Medicinal Plant Identifier
 * Main Application Script
 *
 * ─── Roboflow Workflow Integration ──────────────────────────────────────────
 * Calls the deployed Roboflow Workflow via the Serverless Run endpoint:
 *
 *   POST https://serverless.roboflow.com/vimukthi-kavinda/workflows/
 *        medicinal-plants-dataset-v-02-vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1-logic
 *   Authorization: Bearer <api_key>
 *   Content-Type: application/json
 *   Body: { "inputs": { "image": { "type": "base64", "value": "..." } } }
 *
 * The workflow uses YOLO11n trained on medicinal plants and returns a list
 * of output dicts (one per input image).  Output keys are read dynamically —
 * the parser does NOT assume specific output names.
 *
 * Auth: API key is stored only in localStorage and sent via the
 * Authorization: Bearer header (inference ≥1.5.0).  Never in the URL.
 * ────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ── Workflow constants (hardcoded — this app targets one specific workflow) ───
const WORKFLOW_ENDPOINT =
  'https://serverless.roboflow.com/vimukthi-kavinda/workflows/' +
  'medicinal-plants-dataset-v-02-vmedicinal-plants-dataset-v-0-2-1-yolo11n-t1-logic';

const STORAGE_KEY      = 'herbsense_config_v2'; // versioned to avoid stale shape
const REQUEST_TIMEOUT  = 30_000; // ms — workflow cap is 20 s; add buffer
const MAX_RETRIES      = 2;
const RETRY_BASE_MS    = 800;

// ── Plant knowledge base ─────────────────────────────────────────────────────
// Keys should be lowercase versions of what your model's class labels look like.
// The parser normalises class names (snake_case → spaces, lower) before lookup.
const PLANT_KNOWLEDGE = {
  'aloe vera': {
    scientific: 'Aloe barbadensis miller',
    family:     'Asphodelaceae',
    uses:       'Burn relief, skin moisturizer, digestive aid, immune support.',
    habitat:    'Arid and semi-arid climates; native to the Arabian Peninsula.',
    caution:    'Do not ingest if pregnant. May cause allergic reactions.',
  },
  'neem': {
    scientific: 'Azadirachta indica',
    family:     'Meliaceae',
    uses:       'Antibacterial, antifungal, antiseptic skin care, dental hygiene.',
    habitat:    'Tropical and subtropical regions; widely cultivated in India.',
    caution:    'High doses can be toxic. Avoid during pregnancy.',
  },
  'tulsi': {
    scientific: 'Ocimum tenuiflorum',
    family:     'Lamiaceae',
    uses:       'Adaptogen, respiratory support, anti-inflammatory, stress relief.',
    habitat:    'Tropical regions; sacred plant in Hindu culture.',
    caution:    'May thin blood; avoid before surgery.',
  },
  'turmeric': {
    scientific: 'Curcuma longa',
    family:     'Zingiberaceae',
    uses:       'Anti-inflammatory, antioxidant, digestive support, joint pain.',
    habitat:    'South and Southeast Asia; tropical climate.',
    caution:    'High doses may cause stomach upset or interact with blood thinners.',
  },
  'ginger': {
    scientific: 'Zingiber officinale',
    family:     'Zingiberaceae',
    uses:       'Nausea, digestion, anti-inflammatory, cold and flu relief.',
    habitat:    'Tropical regions; widely cultivated globally.',
    caution:    'May interact with blood thinners or diabetes medications.',
  },
  'ashwagandha': {
    scientific: 'Withania somnifera',
    family:     'Solanaceae',
    uses:       'Adaptogen, stress reduction, energy, hormonal balance.',
    habitat:    'India, North Africa, Mediterranean.',
    caution:    'Avoid during pregnancy. May interact with thyroid medications.',
  },
  'brahmi': {
    scientific: 'Bacopa monnieri',
    family:     'Plantaginaceae',
    uses:       'Memory enhancement, anxiety relief, neurological support.',
    habitat:    'Wetlands and marshy areas; India, Asia, Americas.',
    caution:    'May cause nausea; consult a doctor if on sedatives.',
  },
};

// ── Application state ────────────────────────────────────────────────────────
let state = {
  imageFile:    null,
  imageDataUrl: null,
  config:       loadConfig(),
  stream:       null, // camera MediaStream
};

// ── DOM refs ─────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const uploadZone      = $('uploadZone');
const uploadIdle      = $('uploadIdle');
const uploadPreview   = $('uploadPreview');
const previewImg      = $('previewImg');
const removeImgBtn    = $('removeImg');
const fileInput       = $('fileInput');
const cameraBtn       = $('cameraBtn');
const detectBtn       = $('detectBtn');
const loadingState    = $('loadingState');
const errorState      = $('errorState');
const errorMsg        = $('errorMsg');
const retryBtn        = $('retryBtn');
const resultsSection  = $('resultsSection');
const newScanBtn      = $('newScanBtn');
const resultImg       = $('resultImg');
const plantLabel      = $('plantLabel');
const confidenceBar   = $('confidenceBar');
const confidencePct   = $('confidencePct');
const predictionsList = $('predictionsList');
const plantInfo       = $('plantInfo');
const plantInfoBody   = $('plantInfoBody');
const apiBanner       = $('apiBanner');

// Config modal
const configModal     = $('configModal');
const openConfigBtn   = $('openConfigBtn');
const closeConfigBtn  = $('closeConfigBtn');
const cancelConfigBtn = $('cancelConfigBtn');
const saveConfigBtn   = $('saveConfigBtn');
const apiKeyInput     = $('apiKeyInput');

// Camera modal
const cameraModal     = $('cameraModal');
const closeCameraBtn  = $('closeCameraBtn');
const cameraVideo     = $('cameraVideo');
const captureBtn      = $('captureBtn');
const captureCanvas   = $('captureCanvas');

// ── Init ─────────────────────────────────────────────────────────────────────
function init() {
  updateBanner();
  setupEventListeners();
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Config / localStorage
// ═══════════════════════════════════════════════════════════════════════════════

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { apiKey: '' };
  } catch {
    return { apiKey: '' };
  }
}

function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  state.config = cfg;
}

function isConfigured() {
  return Boolean(state.config.apiKey && state.config.apiKey.trim());
}

function updateBanner() {
  if (isConfigured()) {
    apiBanner.classList.add('configured');
    apiBanner.querySelector('.api-banner__text strong').textContent =
      '✓ Roboflow API Key Configured';
    apiBanner.querySelector('.api-banner__text p').textContent =
      'Workflow: Medicinal Plants YOLO11n · workspace: vimukthi-kavinda';
    openConfigBtn.innerHTML = '<i class="ph ph-pencil-simple"></i> Edit Key';
  } else {
    apiBanner.classList.remove('configured');
    apiBanner.querySelector('.api-banner__text strong').textContent =
      'Enter your Roboflow API Key';
    apiBanner.querySelector('.api-banner__text p').textContent =
      'One-time setup — your key is stored only in this browser.';
    openConfigBtn.innerHTML = '<i class="ph ph-key"></i> Add API Key';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — Workflow Client
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Thin error class so callers can distinguish network vs. API failures.
 */
class WorkflowError extends Error {
  constructor(message, status) {
    super(message);
    this.name  = 'WorkflowError';
    this.status = status ?? null;
  }
}

/**
 * runWorkflow(base64Image)
 *
 * Calls the Roboflow Workflow endpoint with the given base64 image string
 * (no data-URL prefix).  Returns the first element of the outputs list —
 * a plain object whose keys are the workflow's declared output names.
 *
 * Retries up to MAX_RETRIES times on transient errors (5xx, network failure).
 * Raises WorkflowError on permanent failures (4xx, timeout).
 *
 * @param {string} base64Image  Raw base64-encoded image data (no data: prefix)
 * @returns {Promise<Object>}   Raw workflow output dict for the single image
 */
async function runWorkflow(base64Image) {
  const apiKey = state.config.apiKey.trim();
  if (!apiKey) throw new WorkflowError('No API key configured.', 401);

  const body = JSON.stringify({
    inputs: {
      image: { type: 'base64', value: base64Image },
    },
  });

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_BASE_MS * Math.pow(2, attempt - 1)); // exponential backoff
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(WORKFLOW_ENDPOINT, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const errMsg  = errBody.message || errBody.error || `HTTP ${response.status}`;

        // 4xx = permanent failure — don't retry
        if (response.status >= 400 && response.status < 500) {
          throw new WorkflowError(
            friendlyApiError(response.status, errMsg),
            response.status,
          );
        }

        // 5xx = transient — retry
        lastError = new WorkflowError(errMsg, response.status);
        continue;
      }

      const data = await response.json();
      return parseWorkflowResponse(data);

    } catch (err) {
      clearTimeout(timer);

      if (err instanceof WorkflowError) throw err; // permanent — propagate

      if (err.name === 'AbortError') {
        throw new WorkflowError('Request timed out (30 s). Try again.', null);
      }

      // Network error — retry
      lastError = new WorkflowError(`Network error: ${err.message}`, null);
    }
  }

  throw lastError || new WorkflowError('Unknown error running workflow.');
}

/**
 * Parse the workflow response defensively.
 *
 * The Roboflow workflow run endpoint returns:
 *   { outputs: [ { <output_name>: <value>, ... } ] }
 *
 * One entry per input image.  We sent one image, so we read index 0.
 * We do NOT hard-code any output name — we expose the raw dict to the caller
 * and let extractPredictions() fish out the usable data.
 *
 * @param {Object} data  Parsed JSON from the API
 * @returns {Object}     Raw output dict for image 0
 */
function parseWorkflowResponse(data) {
  // Shape: { outputs: [ {...} ] }
  if (data && Array.isArray(data.outputs) && data.outputs.length > 0) {
    return data.outputs[0];
  }

  // Some workflow responses wrap under 'results' or return the dict directly
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // If there's at least one non-meta key, treat as direct output dict
    const keys = Object.keys(data).filter(k => !['time', 'api_key'].includes(k));
    if (keys.length > 0) return data;
  }

  return {};
}

/**
 * extractPredictions(outputDict)
 *
 * Walks the raw workflow output dict and converts it into our unified
 * internal format:  Array<{ class: string, confidence: number }>
 *
 * Handled shapes (covers detection, classification, and custom workflow blocks):
 *
 *  a) Detection block output:
 *     { predictions: [ { class, confidence, x, y, width, height, ... } ] }
 *
 *  b) Classification block output:
 *     { top: "class", confidence: 0.99, predictions: { class: conf, ... } }
 *
 *  c) Nested: the dict has sub-objects for each output key, any of the above
 *
 * @param {Object} outputDict
 * @returns {Array<{class: string, confidence: number}>}
 */
function extractPredictions(outputDict) {
  // Collect all candidate arrays from any key in the output dict
  const candidates = [];

  for (const [, value] of Object.entries(outputDict)) {
    if (!value || typeof value !== 'object') continue;

    // Shape a — detection array directly
    if (Array.isArray(value)) {
      const detections = value.filter(
        (p) => typeof p === 'object' && typeof p.class === 'string' && typeof p.confidence === 'number'
      );
      if (detections.length > 0) {
        candidates.push(...detections.map((p) => ({ class: p.class, confidence: p.confidence })));
      }
      continue;
    }

    // Shape b — classification dict {top, confidence, predictions:{}}
    if (value.top && typeof value.confidence === 'number') {
      if (value.predictions && typeof value.predictions === 'object' && !Array.isArray(value.predictions)) {
        // Multi-class classification
        Object.entries(value.predictions).forEach(([cls, conf]) => {
          candidates.push({ class: cls, confidence: parseFloat(conf) });
        });
      } else {
        candidates.push({ class: value.top, confidence: value.confidence });
      }
      continue;
    }

    // Shape a wrapped — { predictions: [...] }
    if (Array.isArray(value.predictions)) {
      const detections = value.predictions.filter(
        (p) => typeof p === 'object' && typeof p.class === 'string' && typeof p.confidence === 'number'
      );
      if (detections.length > 0) {
        candidates.push(...detections.map((p) => ({ class: p.class, confidence: p.confidence })));
      }
      continue;
    }

    // Shape b wrapped — { predictions: {class: conf} } with top
    if (value.predictions && typeof value.predictions === 'object' && !Array.isArray(value.predictions)) {
      Object.entries(value.predictions).forEach(([cls, conf]) => {
        candidates.push({ class: cls, confidence: parseFloat(conf) });
      });
      continue;
    }
  }

  if (candidates.length === 0) return [];

  // Aggregate by class — keep highest confidence if same class appears multiple times
  const classMap = new Map();
  for (const p of candidates) {
    const existing = classMap.get(p.class);
    if (!existing || p.confidence > existing) {
      classMap.set(p.class, p.confidence);
    }
  }

  return Array.from(classMap.entries())
    .map(([cls, confidence]) => ({ class: cls, confidence }))
    .sort((a, b) => b.confidence - a.confidence);
}

/** Map HTTP status codes to human-readable messages */
function friendlyApiError(status, raw) {
  switch (status) {
    case 401: return 'Invalid API key. Check your key at app.roboflow.com/settings/api.';
    case 402: return 'Roboflow account limit reached. Check your plan.';
    case 403: return 'API key does not have access to this workflow.';
    case 404: return 'Workflow not found. Contact support if this persists.';
    case 429: return 'Rate limit reached. Wait a moment and try again.';
    default:  return raw || `API error ${status}.`;
  }
}

/** Promisified sleep */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Event Listeners
// ═══════════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
  // File input
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadImageFile(file);
    fileInput.value = '';
  });

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragging');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImageFile(file);
    } else {
      showToast('Please drop an image file.', 'error');
    }
  });

  // Keyboard on upload zone
  uploadZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') fileInput.click();
  });

  // Remove image
  removeImgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearImage();
  });

  // Camera
  cameraBtn.addEventListener('click', openCamera);

  // Detect
  detectBtn.addEventListener('click', runDetection);

  // Retry
  retryBtn.addEventListener('click', () => {
    hideElement(errorState);
    runDetection();
  });

  // New scan
  newScanBtn.addEventListener('click', resetAll);

  // Config modal
  openConfigBtn.addEventListener('click', openConfigModal);
  closeConfigBtn.addEventListener('click', closeConfigModal);
  cancelConfigBtn.addEventListener('click', closeConfigModal);
  saveConfigBtn.addEventListener('click', handleSaveConfig);
  configModal.addEventListener('click', (e) => {
    if (e.target === configModal) closeConfigModal();
  });

  // Camera modal
  closeCameraBtn.addEventListener('click', closeCamera);
  cameraModal.addEventListener('click', (e) => {
    if (e.target === cameraModal) closeCamera();
  });
  captureBtn.addEventListener('click', capturePhoto);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!configModal.classList.contains('hidden')) closeConfigModal();
      if (!cameraModal.classList.contains('hidden')) closeCamera();
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — Image Handling
// ═══════════════════════════════════════════════════════════════════════════════

function loadImageFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file.', 'error');
    return;
  }
  state.imageFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    state.imageDataUrl = e.target.result;
    showPreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function showPreview(dataUrl) {
  previewImg.src = dataUrl;
  hideElement(uploadIdle);
  showElement(uploadPreview);
  uploadZone.classList.add('has-image');
  detectBtn.disabled = false;
  hideElement(resultsSection);
  hideElement(errorState);
  hideElement(loadingState);
}

function clearImage() {
  state.imageFile    = null;
  state.imageDataUrl = null;
  previewImg.src     = '';
  showElement(uploadIdle);
  hideElement(uploadPreview);
  uploadZone.classList.remove('has-image');
  detectBtn.disabled = true;
  hideElement(resultsSection);
  hideElement(errorState);
  hideElement(loadingState);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Config Modal
// ═══════════════════════════════════════════════════════════════════════════════

function openConfigModal() {
  apiKeyInput.value = state.config.apiKey || '';
  showElement(configModal);
  configModal.classList.remove('hidden');
  setTimeout(() => apiKeyInput.focus(), 100);
}

function closeConfigModal() {
  hideElement(configModal);
}

function handleSaveConfig() {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    showToast('Please enter your Roboflow API key.', 'error');
    apiKeyInput.focus();
    return;
  }
  saveConfig({ apiKey });
  updateBanner();
  closeConfigModal();
  showToast('API key saved!', 'success');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — Camera
// ═══════════════════════════════════════════════════════════════════════════════

async function openCamera() {
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    cameraVideo.srcObject = state.stream;
    showElement(cameraModal);
    cameraModal.classList.remove('hidden');
  } catch (err) {
    const msg = err.name === 'NotAllowedError'
      ? 'Camera access denied. Please allow camera permissions.'
      : `Camera error: ${err.message}`;
    showToast(msg, 'error');
  }
}

function closeCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach((t) => t.stop());
    state.stream = null;
  }
  cameraVideo.srcObject = null;
  hideElement(cameraModal);
}

function capturePhoto() {
  const canvas = captureCanvas;
  canvas.width  = cameraVideo.videoWidth;
  canvas.height = cameraVideo.videoHeight;
  canvas.getContext('2d').drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    loadImageFile(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' }));
    closeCamera();
    showToast('Photo captured!', 'success');
  }, 'image/jpeg', 0.92);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — Detection Orchestration
// ═══════════════════════════════════════════════════════════════════════════════

async function runDetection() {
  if (!state.imageDataUrl) {
    showToast('Please upload or capture a plant image first.', 'info');
    return;
  }

  if (!isConfigured()) {
    showToast('Add your Roboflow API key first.', 'info');
    openConfigModal();
    return;
  }

  // Enter loading state
  detectBtn.disabled = true;
  showElement(loadingState);
  loadingState.classList.remove('hidden');
  hideElement(errorState);
  hideElement(resultsSection);

  try {
    // Strip data-URL prefix — send only raw base64 to the API
    const base64 = state.imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const outputDict = await runWorkflow(base64);
    const predictions = extractPredictions(outputDict);
    renderResults(predictions);
  } catch (err) {
    console.error('[HerbSense] Detection error:', err);
    errorMsg.textContent = err.message || 'Detection failed. Please try again.';
    showElement(errorState);
    errorState.classList.remove('hidden');
  } finally {
    hideElement(loadingState);
    detectBtn.disabled = false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — Render Results
// ═══════════════════════════════════════════════════════════════════════════════

function renderResults(predictions) {
  resultImg.src = state.imageDataUrl;

  if (!predictions || predictions.length === 0) {
    predictionsList.innerHTML = `
      <div class="no-detection">
        <i class="ph ph-magnifying-glass"></i>
        <p>No plant detected in this image.<br>Try a clearer, closer photo focusing on leaves or flowers.</p>
      </div>`;
    plantLabel.textContent        = 'No plant detected';
    confidenceBar.style.width     = '0%';
    confidencePct.textContent     = '—';
    hideElement(plantInfo);
    showResults();
    return;
  }

  const top    = predictions[0];
  const topPct = Math.round(top.confidence * 100);

  plantLabel.textContent = formatClassName(top.class);

  // Animate confidence bar
  requestAnimationFrame(() => requestAnimationFrame(() => {
    confidenceBar.style.width = `${topPct}%`;
    confidencePct.textContent = `${topPct}%`;
  }));

  // Other predictions
  predictionsList.innerHTML = '';
  const others = predictions.slice(1, 6);
  if (others.length > 0) {
    const title = document.createElement('p');
    title.style.cssText = 'font-size:.75rem;font-weight:600;color:var(--clr-gray-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem;';
    title.textContent = 'Other Candidates';
    predictionsList.appendChild(title);

    others.forEach((p) => {
      const pct  = Math.round(p.confidence * 100);
      const item = document.createElement('div');
      item.className  = 'prediction-item';
      item.innerHTML  = `
        <span class="prediction-item__name">${formatClassName(p.class)}</span>
        <div class="prediction-item__bar-wrap">
          <div class="prediction-item__bar" style="width:0%" data-pct="${pct}"></div>
        </div>
        <span class="prediction-item__pct">${pct}%</span>`;
      predictionsList.appendChild(item);
    });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      predictionsList.querySelectorAll('.prediction-item__bar').forEach((bar) => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }));
  }

  renderPlantInfo(top.class);
  showResults();
}

function showResults() {
  showElement(resultsSection);
  resultsSection.classList.remove('hidden');
  setTimeout(() => resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function renderPlantInfo(className) {
  const key  = className.toLowerCase().replace(/[_-]/g, ' ').trim();
  const info = PLANT_KNOWLEDGE[key];
  if (!info) { hideElement(plantInfo); return; }

  plantInfoBody.innerHTML = `
    <div class="plant-info__item">
      <strong>Scientific Name</strong>${info.scientific}
    </div>
    <div class="plant-info__item">
      <strong>Family</strong>${info.family}
    </div>
    <div class="plant-info__item">
      <strong>Medicinal Uses</strong>${info.uses}
    </div>
    <div class="plant-info__item">
      <strong>Habitat</strong>${info.habitat}
    </div>
    <div class="plant-info__item" style="grid-column:1/-1">
      <strong>⚠ Caution</strong>${info.caution}
    </div>`;

  showElement(plantInfo);
  plantInfo.classList.remove('hidden');
}

function formatClassName(name) {
  return name.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — Misc UI Helpers
// ═══════════════════════════════════════════════════════════════════════════════

function resetAll() {
  clearImage();
  hideElement(resultsSection);
  hideElement(errorState);
  hideElement(loadingState);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let toastTimer = null;
function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icons = { success: 'ph-check-circle', error: 'ph-x-circle', info: 'ph-info' };
  toast.className   = `toast toast--${type}`;
  toast.innerHTML   = `<i class="ph ${icons[type] || icons.info}"></i> ${message}`;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function showElement(el) { el.classList.remove('hidden'); }
function hideElement(el) { el.classList.add('hidden'); }

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — Smoke test (runs only if ?smoketest=1 in URL)
// ═══════════════════════════════════════════════════════════════════════════════
// Usage: open the app with ?smoketest=1 appended to the URL.
// It will POST a 1×1 white pixel JPEG to the workflow and log the raw
// output dict — letting you verify the exact output key names your workflow
// returns before you customise extractPredictions() further.

if (new URLSearchParams(window.location.search).has('smoketest')) {
  (async () => {
    console.group('[HerbSense] Smoke test');
    try {
      // Minimal 1×1 white JPEG in base64
      const tiny1x1JPEG =
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
        'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
        'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
        'MjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB' +
        'AQFAQIDAQAAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/EABQB' +
        'AQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJWAAAAAAB//2Q==';

      const raw = await runWorkflow(tiny1x1JPEG);
      console.log('Raw workflow output keys:', Object.keys(raw));
      console.log('Full output dict:', raw);
      const preds = extractPredictions(raw);
      console.log('Extracted predictions:', preds);
      console.log('✅ Smoke test complete');
    } catch (err) {
      console.error('❌ Smoke test failed:', err.message);
    }
    console.groupEnd();
  })();
}

// ── Boot ──────────────────────────────────────────────────────────────────────
init();
