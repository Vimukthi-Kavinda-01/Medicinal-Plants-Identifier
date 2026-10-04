'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, optionalAuthenticate } = require('../middleware/authenticate');

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/scans
   Save a plant identification scan record.
   Optional auth: if logged in, scan is linked to the user account.
   Body: { detectedClass, confidence, predictionsPayload, description, imageUrl }
───────────────────────────────────────────────────────────────────────────── */
router.post('/scans', optionalAuthenticate, async (req, res) => {
  try {
    const {
      detectedClass,
      confidence,
      predictionsPayload,
      description,
      imageUrl,
    } = req.body;

    if (!detectedClass || typeof detectedClass !== 'string' || !detectedClass.trim()) {
      return res.status(400).json({ error: 'detectedClass is required.' });
    }

    const cleanClass = detectedClass.trim();
    const cleanConfidence = typeof confidence === 'number' ? confidence : parseFloat(confidence) || null;
    const cleanDescription = typeof description === 'string' ? description.trim() : null;
    const cleanImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : null;
    const cleanPayload = Array.isArray(predictionsPayload)
      ? JSON.stringify(predictionsPayload)
      : JSON.stringify([]);

    // Validate and use authenticated user ID or body userId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let validUserId = null;
    if (req.user?.id && uuidRegex.test(req.user.id)) {
      validUserId = req.user.id;
    } else if (req.body?.userId && uuidRegex.test(String(req.body.userId).trim())) {
      validUserId = String(req.body.userId).trim();
    }

    // Attempt to match plant_id from plants table by slug, common_name, or sanitized label
    const cleanNoSpecial = cleanClass.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanHyphen = cleanClass.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanSpace = cleanClass.toLowerCase().replace(/[^a-z0-9]+/g, ' ');

    const plantMatch = await db.query(
      `SELECT id FROM plants
       WHERE LOWER(slug) = $1
          OR LOWER(slug) = $2
          OR LOWER(REPLACE(slug, '-', '')) = $3
          OR LOWER(common_name) = $4
          OR LOWER(REPLACE(common_name, ' ', '')) = $3
       LIMIT 1;`,
      [cleanHyphen, cleanClass.toLowerCase(), cleanNoSpecial, cleanSpace]
    );
    const plantId = plantMatch.rows[0]?.id || null;

    // Ensure user actually exists in users table before setting foreign key
    let finalUserId = null;
    if (validUserId) {
      const userCheck = await db.query(`SELECT id FROM users WHERE id = $1 LIMIT 1;`, [validUserId]);
      if (userCheck.rows.length > 0) {
        finalUserId = validUserId;
      }
    }

    const result = await db.query(
      `INSERT INTO plant_scans (user_id, plant_id, detected_class, confidence, predictions_payload, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, plant_id, detected_class, confidence, predictions_payload, description, image_url, created_at;`,
      [finalUserId, plantId, cleanClass, cleanConfidence, cleanPayload, cleanDescription, cleanImageUrl]
    );

    const row = result.rows[0];
    return res.status(201).json({
      success: true,
      scan: {
        id: row.id,
        userId: row.user_id,
        plantId: row.plant_id,
        detectedClass: row.detected_class,
        confidence: row.confidence ? parseFloat(row.confidence) : null,
        predictionsPayload: row.predictions_payload,
        description: row.description,
        imageUrl: row.image_url,
        createdAt: row.created_at,
      },
    });
  } catch (err) {
    console.error('[Save Scan Error]:', err.message);
    return res.status(500).json({ error: 'Failed to record scan in database.' });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/scans/my
   Get the current logged-in user's scan history (requires auth).
   Query: ?limit=<number> (max 50, default 30)
───────────────────────────────────────────────────────────────────────────── */
router.get('/scans/my', authenticate, async (req, res) => {
  try {
    const { limit } = req.query;
    const queryLimit = Math.min(Math.max(parseInt(limit, 10) || 30, 1), 50);

    const result = await db.query(
      `SELECT
         s.id,
         s.user_id,
         s.plant_id,
         s.detected_class,
         s.confidence,
         s.description,
         s.image_url,
         s.created_at,
         p.common_name,
         p.scientific_name,
         p.family
       FROM plant_scans s
       LEFT JOIN plants p ON s.plant_id = p.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC
       LIMIT $2;`,
      [req.user.id, queryLimit]
    );

    return res.json({
      success: true,
      count: result.rows.length,
      scans: result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        plantId: row.plant_id,
        detectedClass: row.detected_class,
        confidence: row.confidence ? parseFloat(row.confidence) : null,
        description: row.description,
        imageUrl: row.image_url,
        createdAt: row.created_at,
        plant: row.plant_id
          ? {
              commonName: row.common_name,
              scientificName: row.scientific_name,
              family: row.family,
            }
          : null,
      })),
    });
  } catch (err) {
    console.error('[Get My Scans Error]:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve your scan history.' });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/scans
   Public scan history (no auth needed) with optional userId filter.
   Query: ?userId=<uuid>&limit=<number>
───────────────────────────────────────────────────────────────────────────── */
router.get('/scans', async (req, res) => {
  try {
    const { userId, limit } = req.query;
    const queryLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    let querySql = `
      SELECT
        s.id,
        s.user_id,
        s.plant_id,
        s.detected_class,
        s.confidence,
        s.description,
        s.image_url,
        s.created_at,
        p.common_name,
        p.scientific_name,
        p.family
      FROM plant_scans s
      LEFT JOIN plants p ON s.plant_id = p.id
    `;

    const params = [];
    if (userId && typeof userId === 'string' && userId.trim()) {
      params.push(userId.trim());
      querySql += ` WHERE s.user_id = $1`;
      params.push(queryLimit);
      querySql += ` ORDER BY s.created_at DESC LIMIT $2;`;
    } else {
      params.push(queryLimit);
      querySql += ` ORDER BY s.created_at DESC LIMIT $1;`;
    }

    const result = await db.query(querySql, params);

    return res.json({
      success: true,
      count: result.rows.length,
      scans: result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        plantId: row.plant_id,
        detectedClass: row.detected_class,
        confidence: row.confidence ? parseFloat(row.confidence) : null,
        description: row.description,
        imageUrl: row.image_url,
        createdAt: row.created_at,
        plant: row.plant_id
          ? {
              commonName: row.common_name,
              scientificName: row.scientific_name,
              family: row.family,
            }
          : null,
      })),
    });
  } catch (err) {
    console.error('[Get Scans Error]:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve scan history from database.' });
  }
});

module.exports = router;
