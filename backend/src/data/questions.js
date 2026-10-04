'use strict';

/** Human-readable names for herbarium feature keys. */
const FEATURE_LABELS = Object.freeze({
  leafArrangement: 'Leaf arrangement',
  leafShape: 'Leaf shape',
  scent: 'Crushed-leaf scent',
  growthHabit: 'Growth habit',
});

/**
 * Plant-feature questions for the rule-based verifier.
 * Each option `value` must match the values used in data/plants.js `features`.
 */
const QUESTIONS = [
  {
    id: 'leafArrangement',
    text: 'How are the leaves attached to the stem?',
    hint: 'Look at where two neighbouring leaves join the stem.',
    options: [
      { value: 'opposite', label: 'In pairs, facing each other' },
      { value: 'alternate', label: 'One at a time, alternating sides' },
      { value: 'basal', label: 'All from the base (rosette or clump)' },
    ],
  },
  {
    id: 'leafShape',
    text: 'What best describes the leaf shape?',
    hint: 'Choose the closest match for a mature leaf.',
    options: [
      { value: 'fleshy', label: 'Thick, fleshy and spiky' },
      { value: 'compound', label: 'Feathery, made of many small leaflets' },
      { value: 'oval', label: 'Simple oval or egg-shaped' },
      { value: 'lanceolate', label: 'Long, broad and pointed' },
      { value: 'grass', label: 'Thin grass-like blades' },
      { value: 'round', label: 'Round or kidney-shaped' },
    ],
  },
  {
    id: 'scent',
    text: 'What does a crushed leaf smell like?',
    hint: 'Gently rub a leaf between your fingers. Skip this if you cannot check.',
    options: [
      { value: 'minty', label: 'Cool and minty' },
      { value: 'citrus', label: 'Lemony or citrus' },
      { value: 'spicy', label: 'Warm, spicy or clove-like' },
      { value: 'curry', label: 'Curry-like' },
      { value: 'pungent', label: 'Bitter or pungent' },
      { value: 'none', label: 'Little or no smell' },
    ],
  },
  {
    id: 'growthHabit',
    text: 'What is the overall growth form of the plant?',
    hint: 'Think about the whole plant, not one leaf.',
    options: [
      { value: 'tree', label: 'Tree' },
      { value: 'shrub', label: 'Woody shrub' },
      { value: 'herb', label: 'Small leafy herb' },
      { value: 'succulent', label: 'Succulent' },
      { value: 'grass', label: 'Grass or clump' },
      { value: 'creeping', label: 'Low and creeping' },
    ],
  },
];

const UNSURE = 'unsure';

module.exports = { FEATURE_LABELS, QUESTIONS, UNSURE };