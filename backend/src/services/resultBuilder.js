'use strict';
 
const { classifyConfidence } = require('./confidence');
const { findPlant, toPublicEntry, findSimilarPlants } = require('./herbarium');
 
const GENERAL_DISCLAIMER =
  'This result is for education only and is not medical advice. Never eat, brew or apply a wild plant based on an app identification alone.';
 
/**
 * Step 9 – warning shown with every final result.
 * @returns {{ severity: 'info'|'caution'|'critical', title: string, messages: string[] }}
 */
function buildWarning({ level, entry, verification }) {
  const messages = [];
  let severity = 'info';
  let title = 'Safety note';
 
  if (level === 'low') {
    severity = 'critical';
    title = 'Low confidence – do not use this plant';
    messages.push('The match is weak. Do not consume or apply this plant. Confirm it with a botanist or a herbarium first.');
  } else if (level === 'medium') {
    severity = 'caution';
    title = 'Moderate confidence – confirm before use';
    messages.push('The match is plausible but not certain. Compare the similar plants below before relying on it.');
  }
 
  if (verification?.status === 'skipped' && level !== 'high') {
    messages.push('The feature questions were skipped, so the answer has not been cross-checked.');
  }
  if (!entry) {
    messages.push('This plant is not in the digital herbarium yet, so no reference details are available.');
  } else if (entry.precautions) {
    messages.push(`Plant precaution: ${entry.precautions}`);
  }
 
  messages.push(GENERAL_DISCLAIMER);
  return { severity, title, messages };
}
 
/**
 * Assembles the final response payload: ranking, herbarium info, similar plants and warning.
 *
 * @param {Array} ranked candidates sorted best-first (each with `class`, `name`, `confidence`)
 * @param {object} verification verification summary ({ status, message, ... })
 */
function buildFinalResult(ranked, verification) {
  const top = ranked[0];
  const level = classifyConfidence(top.confidence);
  const plant = findPlant(top.class);
 
  return {
    top,
    ranked,
    level,
    verification,
    info: plant ? toPublicEntry(plant) : null,
    similar: findSimilarPlants(plant),
    warning: buildWarning({ level, entry: plant, verification }),
  };
}
 
module.exports = { buildFinalResult, buildWarning, GENERAL_DISCLAIMER };
 