const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const BACKEND_DOWN_MESSAGE =
  'Cannot reach the backend server. Open a terminal, run "cd backend" then "npm run dev", and check it prints "HerbSense Backend running on http://localhost:3001".';

/* =========================================================
   HELPERS
   ========================================================= */

/**
 * Builds a readable error from a failed response. An empty 5xx body usually means
 * the backend (or the dev proxy in front of it) is not running.
 */
function errorFromResponse(response, data, fallback) {
  if (data && data.error) return new Error(data.error);
  if ([500, 502, 503, 504].includes(response.status)) return new Error(BACKEND_DOWN_MESSAGE);
  return new Error(fallback || `Server responded with error status ${response.status}`);
}

/** fetch() that turns network failures into one readable message. */
async function safeFetch(url, options = {}) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('herbsense_jwt') : null;
    const headers = { ...options.headers };
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return await fetch(url, { ...options, headers });
  } catch {
    throw new Error(BACKEND_DOWN_MESSAGE);
  }
}

async function postJson(path, body, fallback) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('herbsense_jwt') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await safeFetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw errorFromResponse(response, data, fallback);
  }
  return data;
}

/* =========================================================
   BACKEND HEALTH
   ========================================================= */

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      return {
        status: 'error',
        roboflowConfigured: false,
        descriptionConfigured: false,
      };
    }

    return await response.json();
  } catch {
    return {
      status: 'error',
      roboflowConfigured: false,
      descriptionConfigured: false,
    };
  }
}

/* =========================================================
   GUIDED IDENTIFICATION (steps 4–9)
   ========================================================= */

/**
 * Steps 4–5: runs the image model and returns the top-3 predictions.
 * `stage` is 'none' | 'verification' (questions included) | 'final' (result included).
 * @param {string} base64Image - Base64 string or data URL of the image
 */
export async function identifyPlant(base64Image) {
  if (!base64Image) {
    throw new Error('No image provided for identification.');
  }
  return postJson('/api/identify', { image: base64Image }, 'Plant identification failed.');
}

/**
 * Steps 6–9: sends the feature answers and returns the final verified result.
 * @param {Array<{class: string, confidence: number}>} candidates - top-3 from identifyPlant
 * @param {Object<string,string>} answers - { questionId: optionValue }
 */
export async function verifyPlant(candidates, answers) {
  return postJson(
    '/api/verify',
    {
      candidates: candidates.map(({ class: label, confidence }) => ({ class: label, confidence })),
      answers,
    },
    'Plant verification failed.'
  );
}

/* =========================================================
   PLANT DETECTION (original single-step endpoint)
   ========================================================= */

export async function detectMedicinalPlant(imageData) {
  if (!imageData) {
    throw new Error('Please provide an image.');
  }

  const data = await postJson('/api/detect', { image: imageData }, 'Plant identification failed.');

  // Ensure an array of predictions is returned
  if (Array.isArray(data.predictions)) {
    return data.predictions;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

/* =========================================================
   PLANT DESCRIPTION
   ========================================================= */

/**
 * Returns the description as a plain string (usePlantDescription and ResultsPanel
 * render it as text, so returning the whole response object would crash the page).
 */
export async function describePlant(plantName) {
  if (!plantName) {
    throw new Error('Plant name is required.');
  }

  const data = await postJson('/api/describe', { plantName }, 'Failed to generate plant description.');
  if (typeof data.description === 'string') {
    return data.description;
  }
  if (typeof data === 'string') {
    return data;
  }
  return data.description || '';
}

/* =========================================================
   SCAN HISTORY
   ========================================================= */

export async function recordScan(scanData) {
  if (!scanData) {
    throw new Error('Scan data is required.');
  }

  try {
    return await postJson(
      '/api/scans',
      {
        userId: scanData.userId || null,
        detectedClass: scanData.detectedClass || null,
        confidence: scanData.confidence ?? null,
        predictionsPayload: scanData.predictionsPayload || null,
        description: scanData.description || null,
        imageUrl: scanData.imageUrl || null,
      },
      'Failed to record scan.'
    );
  } catch (error) {
    console.error('[HerbSense] Failed to record scan:', error);
    throw error;
  }
}

export async function getScans(userId = null) {
  try {
    const url = userId
      ? `${API_BASE_URL}/api/scans?userId=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/api/scans`;

    const response = await safeFetch(url);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw errorFromResponse(response, data, 'Failed to fetch scan history.');
    }

    return data.scans || [];
  } catch (error) {
    console.error('[HerbSense] Failed to fetch scans:', error);
    return [];
  }
}

/* =========================================================
   USER PROFILE
   ========================================================= */

export async function saveUserProfile(profileData) {
  if (!profileData) {
    throw new Error('Profile data is required.');
  }
  return postJson('/api/users/profile', profileData, 'Could not save profile.');
}

export async function getUserProfile(username) {
  if (!username) {
    throw new Error('Username is required.');
  }

  const response = await safeFetch(
    `${API_BASE_URL}/api/users/profile/${encodeURIComponent(username)}`
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw errorFromResponse(response, data, 'Could not fetch user profile.');
  }

  return data.user;
}

/* =========================================================
   PLANTS
   ========================================================= */

export async function getPlants() {
  try {
    const response = await safeFetch(`${API_BASE_URL}/api/plants`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw errorFromResponse(response, data, 'Failed to fetch plants.');
    }

    return data.plants || [];
  } catch (error) {
    console.error('[HerbSense] Failed to fetch plants:', error);
    return [];
  }
}

export async function getPlantBySlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  try {
    const cleanSlug = encodeURIComponent(slug.trim().toLowerCase().replace(/[\s_]+/g, '-'));
    const response = await safeFetch(`${API_BASE_URL}/api/plants/${cleanSlug}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json().catch(() => ({}));
    return data.plant || null;
  } catch (error) {
    console.error('[HerbSense] Failed to fetch plant:', error);
    return null;
  }
}

/* =========================================================
   SAVED PLANTS
   ========================================================= */

export async function savePlant(userId, plantId, userNotes = null) {
  if (!userId || !plantId) {
    throw new Error('User ID and Plant ID are required to save a plant.');
  }

  return postJson(
    '/api/saved-plants',
    { userId, plantId, userNotes },
    'Failed to bookmark plant in database.'
  );
}

export async function getSavedPlants(userId) {
  if (!userId) {
    return [];
  }

  try {
    const response = await safeFetch(
      `${API_BASE_URL}/api/saved-plants?userId=${encodeURIComponent(userId)}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json().catch(() => ({}));
    return data.savedPlants || [];
  } catch (error) {
    console.error('[HerbSense] Failed to fetch saved plants:', error);
    return [];
  }
}

/* =========================================================
   REMOVE SAVED PLANT
   ========================================================= */

export async function removeSavedPlant(userId, plantId) {
  if (!userId || !plantId) {
    throw new Error('User ID and Plant ID are required.');
  }

  const response = await safeFetch(
    `${API_BASE_URL}/api/saved-plants/${encodeURIComponent(plantId)}?userId=${encodeURIComponent(userId)}`,
    { method: 'DELETE' }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw errorFromResponse(response, data, 'Failed to remove saved plant.');
  }

  return data;
}