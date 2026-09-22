'use strict';

const express = require('express');
const router = express.Router();

const DEFAULT_DESCRIPTION_URL = 'https://api.openai.com/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 65_000;
const MAX_RETRIES = 4; // Up to 5 total attempts to ride out worker pool capacity spikes
const BASE_RETRY_DELAY_MS = 1_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // Cache descriptions for 24 hours

// In-memory cache: normalized plant name -> { description, timestamp }
const descriptionCache = new Map();

// In-flight request deduplication: normalized plant name -> Promise<string>
const inFlightRequests = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post('/describe', async (req, res) => {
  const plantName = typeof req.body?.plantName === 'string' ? req.body.plantName.trim() : '';

  if (!plantName) {
    return res.status(400).json({ error: 'A plant name is required to generate a description.' });
  }

  const normalizedKey = plantName.toLowerCase();

  // 1. Check in-memory cache first
  const cached = descriptionCache.get(normalizedKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json({ success: true, description: cached.description, cached: true });
  }

  const apiKey = process.env.DESCRIPTION_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Description model is not configured. Add DESCRIPTION_API_KEY to backend/.env and restart the server.',
    });
  }

  // 2. In-flight request deduplication: if a request for this plant is already running, join it
  if (inFlightRequests.has(normalizedKey)) {
    try {
      const description = await inFlightRequests.get(normalizedKey);
      return res.json({ success: true, description });
    } catch (err) {
      return res.status(502).json({ error: err.message || 'Unable to generate description.' });
    }
  }

  // 3. Initiate fetch with retries
  const requestPromise = fetchDescriptionWithRetries(plantName, apiKey);
  inFlightRequests.set(normalizedKey, requestPromise);

  try {
    const description = await requestPromise;

    // Cache successful description
    descriptionCache.set(normalizedKey, {
      description,
      timestamp: Date.now(),
    });

    // Prune cache if it grows beyond 200 plants
    if (descriptionCache.size > 200) {
      const oldestKey = descriptionCache.keys().next().value;
      descriptionCache.delete(oldestKey);
    }

    return res.json({ success: true, description });
  } catch (error) {
    console.error(`[Description Route Error for "${plantName}"]:`, error.message);
    const status = error.status || 502;
    return res.status(status).json({ error: error.message });
  } finally {
    inFlightRequests.delete(normalizedKey);
  }
});

/**
 * Fetches the plant description with automatic exponential backoff retries for capacity/rate-limit spikes.
 */
async function fetchDescriptionWithRetries(plantName, apiKey) {
  const endpoint = getDescriptionEndpoint();
  const model = process.env.DESCRIPTION_MODEL || 'gpt-4o-mini';

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Exponential backoff with random jitter: ~1.2s, ~2.3s, ~4.1s, ~6.5s
      const jitter = Math.random() * 500;
      const delay = Math.min(8_000, BASE_RETRY_DELAY_MS * Math.pow(1.8, attempt - 1) + jitter);
      console.log(`[Description Retry] Plant "${plantName}" attempt ${attempt + 1}/${MAX_RETRIES + 1} after ${Math.round(delay)}ms...`);
      await sleep(delay);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.5,
          max_tokens: 260,
          messages: [
            {
              role: 'system',
              content:
                'You are a careful botanical educator. Give concise, readable plant descriptions. Mention appearance, habitat, commonly researched uses, and one safety caveat. Never present traditional use as medical advice. Do not use markdown headings or bullet points.',
            },
            {
              role: 'user',
              content: `Describe ${plantName} for a curious field researcher in 90 to 120 words.`,
            },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const providerMessage = data.error?.message || data.error || `Provider returned status ${response.status}.`;

        const isCapacityOrTransient =
          response.status === 429 ||
          response.status === 503 ||
          response.status === 502 ||
          response.status === 504 ||
          /resourceexhausted|worker.*limit|rate.*limit|capacity|busy|overloaded|try again/i.test(String(providerMessage));

        if (isCapacityOrTransient && attempt < MAX_RETRIES) {
          // Check for Retry-After header
          const retryAfterHeader = response.headers.get('retry-after');
          if (retryAfterHeader) {
            const retrySeconds = parseInt(retryAfterHeader, 10);
            if (!isNaN(retrySeconds) && retrySeconds > 0 && retrySeconds <= 10) {
              console.log(`[Description] Respecting Retry-After header: ${retrySeconds}s`);
              await sleep(retrySeconds * 1000);
            }
          }
          lastError = new Error(providerMessage);
          lastError.status = 503;
          continue;
        }

        const friendlyMsg = isCapacityOrTransient
          ? 'The description model is temporarily at capacity. Please try again in a moment.'
          : providerMessage;

        const err = new Error(friendlyMsg);
        err.status = response.status >= 500 ? 502 : response.status;
        throw err;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      const description = Array.isArray(content)
        ? content.map((part) => part.text || '').join(' ').trim()
        : typeof content === 'string'
        ? content.trim()
        : '';

      if (!description) {
        throw new Error('The description model returned an empty response.');
      }

      return description;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        lastError = new Error('The description model timed out after 65 seconds.');
        lastError.status = 504;
      } else {
        lastError = err;
      }

      // If it's the last attempt or a non-retryable 4xx client error, bubble up immediately
      if (attempt >= MAX_RETRIES || (err.status && err.status >= 400 && err.status < 429)) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Unable to reach the description model. Please try again.');
}

function getDescriptionEndpoint() {
  const configuredUrl = (process.env.DESCRIPTION_API_URL || DEFAULT_DESCRIPTION_URL).trim().replace(/\/+$/, '');

  if (configuredUrl.endsWith('/chat/completions')) {
    return configuredUrl;
  }

  return `${configuredUrl}/chat/completions`;
}

module.exports = router;