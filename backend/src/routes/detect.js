'use strict';

const express = require('express');
const router = express.Router();
const { runRoboflowWorkflow, RoboflowError } = require('../services/roboflow');

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

    // Run Roboflow inference via our dedicated workflow service
    const { predictions } = await runRoboflowWorkflow(cleanBase64, apiKey);

    return res.json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (err) {
    if (err instanceof RoboflowError) {
      return res.status(err.status || 500).json({
        error: err.message,
      });
    }

    console.error('[Detect Route Error]:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error processing detection.',
    });
  }
});

module.exports = router;
