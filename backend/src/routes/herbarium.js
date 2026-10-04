'use strict';
 
const express = require('express');
const { findPlant, listPlants, toPublicEntry, findSimilarPlants } = require('../services/herbarium');
 
const router = express.Router();
 
/** GET /api/herbarium – list every plant in the digital herbarium. */
router.get('/herbarium', (_req, res) => {
  const plants = listPlants();
  res.json({ success: true, count: plants.length, plants });
});
 
/** GET /api/herbarium/:name – full record (+ similar plants) by id, name, alias or model label. */
router.get('/herbarium/:name', (req, res) => {
  const plant = findPlant(req.params.name);
  if (!plant) {
    return res.status(404).json({ error: `"${req.params.name}" is not in the digital herbarium.` });
  }
  return res.json({ success: true, plant: toPublicEntry(plant), similar: findSimilarPlants(plant) });
});
 
module.exports = router;