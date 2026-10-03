
'use strict';
 
const { formatPlantName } = require('../utils/text');
 
/** Score thresholds (0–1). Kept in sync with the badge colours in the UI. */
const THRESHOLDS = Object.freeze({ HIGH: 0.75, MEDIUM: 0.45 });
 
/** @returns {'high'|'medium'|'low'} */
function classifyConfidence(score) {
  const value = Number.isFinite(score) ? score : 0;
  if (value >= THRESHOLDS.HIGH) return 'high';
  if (value >= THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}
 
/** Rule-based questions are only needed when the model is not confident. */
function needsVerification(level) {
  return level === 'low' || level === 'medium';
}
 
/**
 * Step 4 – keep the three strongest predictions with display-ready fields.
 * @param {Array<{class: string, confidence: number}>} predictions
 */
function buildTopThree(predictions) {
  return [...(predictions || [])]
    .filter((p) => p && typeof p.class === 'string' && Number.isFinite(p.confidence))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3)
    .map((p) => ({
      class: p.class,
      name: formatPlantName(p.class),
      confidence: round(p.confidence),
      percent: Math.round(p.confidence * 100),
    }));
}
 
function round(value) {
  return Math.round(value * 10000) / 10000;
}
 
module.exports = { THRESHOLDS, classifyConfidence, needsVerification, buildTopThree, round };