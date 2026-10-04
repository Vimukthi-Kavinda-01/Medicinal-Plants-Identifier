'use strict';

const express = require('express');
const roboflow = require('../services/roboflow');
const { classifyConfidence, needsVerification, buildTopThree } = require('../services/confidence');
const { selectQuestions, verifyCandidates } = require('../services/ruleEngine');
const { buildFinalResult } = require('../services/resultBuilder');
const { cleanBase64Image } = require('../utils/image');

const router = express.Router();
const MAX_CANDIDATES = 3;

/**
 * POST /api/identify
 * Body: { image: "<base64 or data URL>" }
 *
 * Steps 4–5: top-3 predictions + confidence, then either a final result (high confidence)
 * or a list of plant-feature questions (low / medium confidence).
 *
 * stage: 'none' | 'verification' | 'final'
 */
router.post('/identify', async (req, res) => {
  const image = cleanBase64Image(req.body?.image);
  if (!image) {
    return res.status(400).json({ error: 'Missing or empty "image". Provide a base64 encoded image.' });
  }

  const apiKey = process.env.ROBOFLOW_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Roboflow API key is not configured on the backend. Add ROBOFLOW_API_KEY to backend/.env and restart the server.',
    });
  }

  try {
    const { predictions } = await roboflow.runRoboflowWorkflow(image, apiKey);
    const top3 = buildTopThree(predictions);

    if (top3.length === 0) {
      return res.json({ success: true, stage: 'none', top3: [], level: null, questions: [], result: null });
    }

    const level = classifyConfidence(top3[0].confidence);
    const questions = needsVerification(level) ? selectQuestions(top3) : [];

    if (questions.length > 0) {
      return res.json({ success: true, stage: 'verification', top3, level, questions, result: null });
    }

    const verification = {
      status: level === 'high' ? 'not_needed' : 'skipped',
      answeredCount: 0,
      previousTop: null,
      message:
        level === 'high'
          ? 'The image model is confident, so no extra questions were needed.'
          : 'No feature questions are available for these candidates, so the answer rests on the image model alone.',
    };
    const result = buildFinalResult(top3, verification);
    return res.json({ success: true, stage: 'final', top3, level, questions: [], result });
  } catch (err) {
    if (err instanceof roboflow.RoboflowError) {
      return res.status(err.status || 500).json({ error: err.message });
    }
    console.error('[Identify Route Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal server error while identifying the plant.' });
  }
});

/**
 * POST /api/verify
 * Body: { candidates: [{ class, confidence }], answers: { questionId: value } }
 *
 * Steps 6–9: adjust the ranking with the answers, then return the final result.
 */
router.post('/verify', (req, res) => {
  const { candidates, answers } = req.body || {};

  if (!Array.isArray(candidates) || candidates.length === 0 || candidates.length > MAX_CANDIDATES) {
    return res.status(400).json({ error: `"candidates" must contain 1 to ${MAX_CANDIDATES} predictions.` });
  }

  const valid = candidates.every(
    (c) => c && typeof c.class === 'string' && c.class.trim() && Number.isFinite(c.confidence) && c.confidence >= 0 && c.confidence <= 1
  );
  if (!valid) {
    return res.status(400).json({ error: 'Each candidate needs a "class" string and a "confidence" between 0 and 1.' });
  }

  const cleanCandidates = buildTopThree(candidates);
  const { ranked, verification } = verifyCandidates(cleanCandidates, answers);
  const result = buildFinalResult(ranked, verification);

  return res.json({ success: true, stage: 'final', level: result.level, top3: ranked, result });
});

module.exports = router;