'use strict';

const express = require('express');
const router = express.Router();

const DEFAULT_DESCRIPTION_URL = 'https://api.openai.com/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 60_000;

router.post('/describe', async (req, res) => {
  const plantName = typeof req.body?.plantName === 'string' ? req.body.plantName.trim() : '';

  if (!plantName) {
    return res.status(400).json({ error: 'A plant name is required to generate a description.' });
  }

  const apiKey = process.env.DESCRIPTION_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Description model is not configured. Add DESCRIPTION_API_KEY to backend/.env and restart the server.',
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(getDescriptionEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DESCRIPTION_MODEL || 'gpt-4o-mini',
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

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data.error?.message || data.error || `Description provider returned ${response.status}.`;
      if (response.status === 429 || String(providerMessage).toLowerCase().includes('resourceexhausted')) {
        return res.status(503).json({
          error: 'The description model is temporarily at capacity. Please retry in a moment.',
        });
      }
      return res.status(response.status >= 500 ? 502 : response.status).json({ error: providerMessage });
    }

    const content = data.choices?.[0]?.message?.content;
    const description = Array.isArray(content)
      ? content.map((part) => part.text || '').join(' ').trim()
      : typeof content === 'string'
      ? content.trim()
      : '';

    if (!description) {
      return res.status(502).json({ error: 'The description model returned an empty response.' });
    }

    return res.json({ success: true, description });
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'The description model timed out. You can retry from the result.'
      : 'Unable to reach the description model. Please try again.';
    console.error('[Description Route Error]:', error.message);
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeoutId);
  }
});

module.exports = router;

function getDescriptionEndpoint() {
  const configuredUrl = (process.env.DESCRIPTION_API_URL || DEFAULT_DESCRIPTION_URL).trim().replace(/\/+$/, '');

  if (configuredUrl.endsWith('/chat/completions')) {
    return configuredUrl;
  }

  return `${configuredUrl}/chat/completions`;
}