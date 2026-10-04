'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/plants
 * Retrieve all medicinal plants from PostgreSQL.
 */
router.get('/plants', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT
         id,
         slug,
         common_name,
         scientific_name,
         family,
         medicinal_uses,
         active_compounds,
         habitat,
         precautions,
         created_at
       FROM plants
       ORDER BY common_name ASC;`
    );

    return res.json({
      success: true,
      count: result.rows.length,
      plants: result.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        commonName: row.common_name,
        scientificName: row.scientific_name,
        family: row.family,
        medicinalUses: row.medicinal_uses,
        activeCompounds: row.active_compounds,
        habitat: row.habitat,
        precautions: row.precautions,
        createdAt: row.created_at,
      })),
    });
  } catch (err) {
    console.error('[Get Plants Error]:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve plants from database.' });
  }
});

/**
 * GET /api/plants/:slug
 * Retrieve specific medicinal plant by its slug or name.
 */
router.get('/plants/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).json({ error: 'Plant slug is required.' });
    }

    const cleanSlug = slug.trim().toLowerCase();
    const cleanNoSpecial = cleanSlug.replace(/[^a-z0-9]/g, '');
    const cleanHyphen = cleanSlug.replace(/[^a-z0-9]+/g, '-');
    const cleanSpace = cleanSlug.replace(/[^a-z0-9]+/g, ' ');

    const result = await db.query(
      `SELECT
         id,
         slug,
         common_name,
         scientific_name,
         family,
         medicinal_uses,
         active_compounds,
         habitat,
         precautions,
         created_at
       FROM plants
       WHERE LOWER(slug) = $1
          OR LOWER(slug) = $2
          OR LOWER(REPLACE(slug, '-', '')) = $3
          OR LOWER(common_name) = $4
          OR LOWER(REPLACE(common_name, ' ', '')) = $3
       LIMIT 1;`,
      [cleanHyphen, cleanSlug, cleanNoSpecial, cleanSpace]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Plant with identifier "${slug}" not found.` });
    }

    const row = result.rows[0];
    return res.json({
      success: true,
      plant: {
        id: row.id,
        slug: row.slug,
        commonName: row.common_name,
        scientificName: row.scientific_name,
        family: row.family,
        medicinalUses: row.medicinal_uses,
        activeCompounds: row.active_compounds,
        habitat: row.habitat,
        precautions: row.precautions,
        createdAt: row.created_at,
      },
    });
  } catch (err) {
    console.error('[Get Plant Slug Error]:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve plant from database.' });
  }
});

module.exports = router;
