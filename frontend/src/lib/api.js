const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
   PLANT DETECTION
   ========================================================= */

export async function detectMedicinalPlant(imageData) {
  if (!imageData) {
    throw new Error('Please provide an image.');
  }

  const response = await fetch(`${API_BASE_URL}/api/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: imageData,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Plant identification failed.');
  }

  // Ensure an array of predictions is returned
  if (Array.isArray(data.predictions)) {
    return data.predictions;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

export async function describePlant(plantName) {
  if (!plantName) {
    throw new Error('Plant name is required.');
  }

  const response = await fetch(`${API_BASE_URL}/api/describe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plantName,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to generate plant description.'
    );
  }

  // Ensure a string is returned
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
    const token = localStorage.getItem('herbsense_jwt');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/scans`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId: scanData.userId || null,
        detectedClass: scanData.detectedClass || null,
        confidence: scanData.confidence ?? null,
        predictionsPayload: scanData.predictionsPayload || null,
        description: scanData.description || null,
        imageUrl: scanData.imageUrl || null,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Failed to record scan.');
    }

    return data;
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

    const response = await fetch(url);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch scan history.');
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

  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Could not save profile.');
  }

  return data;
}

export async function getUserProfile(username) {
  if (!username) {
    throw new Error('Username is required.');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/users/profile/${encodeURIComponent(username)}`
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Could not fetch user profile.');
  }

  return data.user;
}

/* =========================================================
   PLANTS
   ========================================================= */

export async function getPlants() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plants`);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch plants.');
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
    const cleanSlug = encodeURIComponent(
      slug.trim().toLowerCase().replace(/[\s_]+/g, '-')
    );

    const response = await fetch(
      `${API_BASE_URL}/api/plants/${cleanSlug}`
    );

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

  const token = localStorage.getItem('herbsense_jwt');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/saved-plants`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      userId,
      plantId,
      userNotes,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to bookmark plant in database.'
    );
  }

  return data;
}

export async function getSavedPlants(userId) {
  if (!userId) {
    return [];
  }

  try {
    const response = await fetch(
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

  const response = await fetch(
    `${API_BASE_URL}/api/saved-plants/${encodeURIComponent(
      plantId
    )}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'DELETE',
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || 'Failed to remove saved plant.'
    );
  }

  return data;
}