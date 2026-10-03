'use strict';
 
const { PLANTS } = require('../data/plants');
const { normalizeLabel } = require('../utils/text');
const { FEATURE_LABELS } = require('../data/questions');
 
/** Lookup table: normalised id / name / alias -> plant record. */
const INDEX = new Map();
for (const plant of PLANTS) {
  const names = [plant.id, plant.name, plant.scientificName, ...(plant.aliases || [])];
  for (const name of names) INDEX.set(normalizeLabel(name), plant);
}
const KEYS_LONGEST_FIRST = [...INDEX.keys()].sort((a, b) => b.length - a.length);
 
/**
 * Step 7 – find the herbarium record for a model label.
 * Exact match first, then whole-word containment ("aloe vera leaf" -> Aloe Vera).
 */
function findPlant(label) {
  const key = normalizeLabel(label);
  if (!key) return null;
  if (INDEX.has(key)) return INDEX.get(key);
 
  const padded = ` ${key} `;
  const partial = KEYS_LONGEST_FIRST.find((known) => padded.includes(` ${known} `));
  return partial ? INDEX.get(partial) : null;
}
 
function getPlantById(id) {
  return PLANTS.find((plant) => plant.id === id) || null;
}
 
function listPlants() {
  return PLANTS.map(({ id, name, scientificName, family }) => ({ id, name, scientificName, family }));
}
 
/** Herbarium record shaped for the UI (field names match PlantInfoCard). */
function toPublicEntry(plant) {
  return {
    id: plant.id,
    name: plant.name,
    scientificName: plant.scientificName,
    family: plant.family,
    medicinalUses: plant.medicinalUses,
    activeCompounds: plant.activeCompounds,
    habitat: plant.habitat,
    precautions: plant.precautions,
    keyFeatures: Object.entries(plant.features).map(([feature, values]) => ({
      label: FEATURE_LABELS[feature] || feature,
      value: values.join(' / '),
    })),
  };
}
 
/**
 * Step 8 – plants a person could confuse with `plant`.
 * Score = curated look-alike (10) + same family (3) + shared feature values (1 each).
 */
function findSimilarPlants(plant, limit = 3) {
  if (!plant) return [];
 
  const curated = new Map((plant.lookalikes || []).map((item) => [item.id, item.tip]));
 
  return PLANTS.filter((other) => other.id !== plant.id)
    .map((other) => {
      const sharedFeatures = Object.entries(plant.features).flatMap(([feature, values]) =>
        (other.features[feature] || [])
          .filter((value) => values.includes(value))
          .map((value) => `${(FEATURE_LABELS[feature] || feature).toLowerCase()}: ${value}`)
      );
      const sameFamily = other.family === plant.family;
      const score = (curated.has(other.id) ? 10 : 0) + (sameFamily ? 3 : 0) + sharedFeatures.length;
 
      return {
        score,
        entry: {
          id: other.id,
          name: other.name,
          scientificName: other.scientificName,
          family: other.family,
          reason: describeSimilarity(sameFamily, other.family, sharedFeatures),
          tip: curated.get(other.id) || null,
        },
      };
    })
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, limit)
    .map((item) => item.entry);
}
 
function describeSimilarity(sameFamily, family, sharedFeatures) {
  const parts = [];
  if (sameFamily) parts.push(`same family (${family})`);
  if (sharedFeatures.length > 0) parts.push(`shares ${sharedFeatures.join(', ')}`);
  return parts.length > 0 ? `Similar: ${parts.join('; ')}.` : 'Sometimes confused in the field.';
}
 
module.exports = { findPlant, getPlantById, listPlants, toPublicEntry, findSimilarPlants };
 