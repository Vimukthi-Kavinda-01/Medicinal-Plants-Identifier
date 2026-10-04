'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuthenticate } = require('../middleware/authenticate');

/**
 * POST /api/saved-plants
 * Save / bookmark a medicinal plant for a user.
 * Body: { userId?, plantId, userNotes? } or Header: Authorization Bearer
 */
router.post('/saved-plants', optionalAuthenticate, async (req, res) => {
  try {
    const rawUserId = req.user?.id || req.body?.userId;
    const { plantId, userNotes } = req.body;

    if (!rawUserId || typeof rawUserId !== 'string' || !rawUserId.trim()) {
      return res.status(400).json({ error: 'userId or authentication required to save a plant.' });
    }

    if (!plantId || typeof plantId !== 'string' || !plantId.trim()) {
      return res.status(400).json({ error: 'plantId is required.' });
    }

    const cleanUserId = rawUserId.trim();
    const cleanPlantId = plantId.trim();
    const cleanNotes = typeof userNotes === 'string' ? userNotes.trim() : null;

    // Verify user exists
    const userCheck = await db.query(`SELECT id FROM users WHERE id = $1;`, [cleanUserId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User does not exist.' });
    }

    // Verify plant exists
    const plantCheck = await db.query(`SELECT id, common_name FROM plants WHERE id = $1;`, [cleanPlantId]);
    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Plant does not exist.' });
    }

    // Insert or update notes on conflict
    const insertSql = `
      INSERT INTO saved_plants (user_id, plant_id, user_notes)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, plant_id)
      DO UPDATE SET user_notes = EXCLUDED.user_notes
      RETURNING id, user_id, plant_id, user_notes, created_at;
    `;

    const result = await db.query(insertSql, [cleanUserId, cleanPlantId, cleanNotes]);
    const row = result.rows[0];

    return res.status(201).json({
      success: true,
      message: `"${plantCheck.rows[0].common_name}" saved to your collection!`,
      savedPlant: {
        id: row.id,
        userId: row.user_id,
        plantId: row.plant_id,
        userNotes: row.user_notes,
        createdAt: row.created_at,
      },
    });
  } catch (err) {
    console.error('[Save Plant Error]:', err.message);
    return res.status(500).json({ error: 'Failed to bookmark plant in database.' });
  }
});

/**
 * GET /api/saved-plants
 * Retrieve saved plants for a specific user.
 * Query: ?userId=<uuid>
 */
router.get('/saved-plants', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    const selectSql = `
      SELECT
        sp.id,
        sp.user_id,
        sp.plant_id,
        sp.user_notes,
        sp.created_at,
        p.slug,
        p.common_name,
        p.scientific_name,
        p.family,
        p.medicinal_uses
      FROM saved_plants sp
      JOIN plants p ON sp.plant_id = p.id
      WHERE sp.user_id = $1
      ORDER BY sp.created_at DESC;
    `;

    const result = await db.query(selectSql, [userId.trim()]);

    return res.json({
      success: true,
      count: result.rows.length,
      savedPlants: result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        plantId: row.plant_id,
        userNotes: row.user_notes,
        createdAt: row.created_at,
        plant: {
          slug: row.slug,
          commonName: row.common_name,
          scientificName: row.scientific_name,
          family: row.family,
          medicinalUses: row.medicinal_uses,
        },
      })),
    });
  } catch (err) {
    console.error('[Get Saved Plants Error]:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve saved plants from database.' });
  }
});

/**
 * DELETE /api/saved-plants/:plantId
 * Remove a saved plant from a user's collection.
 * Query: ?userId=<uuid>
 */
router.delete('/saved-plants/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { userId } = req.query;

    if (!plantId || !plantId.trim()) {
      return res.status(400).json({ error: 'plantId parameter is required.' });
    }

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    const deleteSql = `
      DELETE FROM saved_plants
      WHERE plant_id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await db.query(deleteSql, [plantId.trim(), userId.trim()]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Saved plant not found for this user.' });
    }

    return res.json({
      success: true,
      message: 'Plant removed from saved collection.',
    });
  } catch (err) {
    console.error('[Delete Saved Plant Error]:', err.message);
    return res.status(500).json({ error: 'Failed to remove saved plant from database.' });
  }
});

module.exports = router;
