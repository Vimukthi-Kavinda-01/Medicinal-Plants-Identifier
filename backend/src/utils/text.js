'use strict';
 
/** Lower-cases a model label and collapses separators: "ALOE_vera-leaf" -> "aloe vera leaf". */
function normalizeLabel(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[_\-/]+/g, ' ')
    .replace(/[^a-z0-9× ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
 
/** "aloe_vera" -> "Aloe Vera". Mirrors the frontend helper of the same name. */
function formatPlantName(raw) {
  const label = String(raw || '').replace(/[_-]+/g, ' ').trim();
  if (!label) return 'Unknown Plant';
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
}
 
module.exports = { normalizeLabel, formatPlantName };
 