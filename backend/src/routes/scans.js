'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/scans
 * Save a plant identification scan record.
 * Body: { detectedClass, confidence, predictionsPayload, description, imageUrl, userId }
 */
router.post('/scans', async (req, res) => {
  try {
    const {
      detectedClass,
      confidence,
      predictionsPayload,
      description,
      imageUrl,
      userId,
    } = req.body;

    if (!detectedClass || typeof detectedClass !== 'string' || !detectedClass.trim()) {
      return res.status(400).json({ error: 'detectedClass is required.' });
    }

    const cleanClass = detectedClass.trim();
    const cleanConfidence = typeof confidence === 'number' ? confidence : parseFloat(confidence) || null;
    const cleanDescription = typeof description === 'string' ? description.trim() : null;
    const cleanImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : null;
    const cleanPayload = Array.isArray(predictionsPayload) ? JSON.stringify(predictionsPayload) : JSON.stringify([]);

    // Check if optional userId is a valid UUID
    let validUserId = null;
    if (userId && typeof userId === 'string' && userId.trim()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(userId.trim())) {
        validUserId = userId.trim();
      }
    }

    // Attempt to match plant_id from plants table by slug or class name
    const normalizedSlug = cleanClass.toLowerCase().replace(/[_\s]+/g, '-');
    const plantMatch = await db.query(
      `SELECT id FROM plants WHERE LOWER(slug) = LOWER($1) OR LOWER(REPLACE(slug, '-', ' ')) = LOWER($2) LIMIT 1;`,
      [normalizedSlug, cleanClass.toLowerCase().replace(/_/g, ' ')]
    );
    const plantId = plantMatch.rows[0]?.id || null;

    const insertSql = `
      INSERT INTO plant_scans (
        user_id,
        plant_id,
        detected_class,
        confidence,
        predictions_payload,
        description,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        user_id,
        plant_id,
        detected_class,
        confidence,
        predictions_payload,
        description,
        image_url,
        created_at;
    `;

    const result = await db.query(insertSql, [
      validUserId,
      plantId,
      cleanClass,
      cleanConfidence,
      cleanPayload,
      cleanDescription,
      cleanImageUrl,
    ]);

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

/**
 * GET /api/scans
 * Retrieve scan history with optional user filter and limit.
 * Query: ?userId=<uuid>&limit=<number>
 */
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
        s.predictions_payload,
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
        predictionsPayload: row.predictions_payload,
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
