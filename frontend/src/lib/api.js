/**
 * API client to communicate with the HerbSense Express backend.
 * Uses relative URL '/api' which Vite proxies to http://localhost:3001 in dev,
 * and seamlessly works when deployed together in production.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Sends a base64 encoded plant image to the backend for identification.
 * @param {string} base64Image - Base64 string or data URL of the image
 * @returns {Promise<Array<{class: string, confidence: number}>>}
 */
export async function detectMedicinalPlant(base64Image) {
  if (!base64Image) {
    throw new Error('No image provided for detection.');
  }

  const response = await fetch(`${API_BASE_URL}/api/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || `Server responded with error status ${response.status}`;
    throw new Error(message);
  }

  return data.predictions || [];
}

export async function describePlant(plantName) {
  const response = await fetch(`${API_BASE_URL}/api/describe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plantName }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Description service returned status ${response.status}`);
  }

  return data.description || '';
}

/**
 * Checks the backend health and if Roboflow API key is loaded.
 * @returns {Promise<{status: string, roboflowConfigured: boolean}>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return { status: 'error', roboflowConfigured: false };
    return await response.json();
  } catch {
    return { status: 'offline', roboflowConfigured: false };
  }
}

