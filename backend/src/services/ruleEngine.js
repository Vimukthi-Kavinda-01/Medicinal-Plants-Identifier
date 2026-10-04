'use strict';
 
const { QUESTIONS, UNSURE } = require('../data/questions');
const { findPlant } = require('./herbarium');
const { formatPlantName } = require('../utils/text');
const { round } = require('./confidence');
 
/** Weight of the model score vs. the rule-based score when both exist. */
const MODEL_WEIGHT = 0.6;
const RULE_WEIGHT = 0.4;
const MAX_QUESTIONS = 3;
 
const QUESTION_BY_ID = new Map(QUESTIONS.map((question) => [question.id, question]));
 
/**
 * Step 5 – choose the questions that best tell the current candidates apart.
 * A question is useful when at least two candidates have different accepted answers.
 *
 * @param {Array<{class: string}>} candidates top-3 predictions
 * @returns {Array} question objects (id, text, hint, options)
 */
function selectQuestions(candidates) {
  const entries = candidates.map((candidate) => findPlant(candidate.class)).filter(Boolean);
  if (entries.length === 0) return [];
 
  return QUESTIONS.map((question, order) => ({ question, order, power: separationPower(question.id, entries) }))
    .filter((item) => item.power > 0)
    .sort((a, b) => b.power - a.power || a.order - b.order)
    .slice(0, MAX_QUESTIONS)
    .map((item) => item.question);
}
 
/** Number of candidate pairs whose accepted answers do not overlap. */
function separationPower(questionId, entries) {
  let pairs = 0;
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i].features[questionId] || [];
      const b = entries[j].features[questionId] || [];
      if (a.length > 0 && b.length > 0 && !a.some((value) => b.includes(value))) pairs++;
    }
  }
  return pairs;
}
 
/**
 * Removes unknown question ids / invalid values so bad input cannot skew scores.
 * @returns {Object<string,string>} sanitised answers ("unsure" answers are dropped)
 */
function sanitizeAnswers(answers) {
  const clean = {};
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return clean;
 
  for (const [questionId, value] of Object.entries(answers)) {
    const question = QUESTION_BY_ID.get(questionId);
    if (!question || value === UNSURE) continue;
    if (question.options.some((option) => option.value === value)) clean[questionId] = value;
  }
  return clean;
}
 
/**
 * Step 6 – verify/adjust the candidates with the person's answers.
 *
 * rule score  = matched answers / answered questions (only questions the plant has data for)
 * fused score = 0.6 * model + 0.4 * rule   (model only when there is nothing to compare)
 *
 * @param {Array<{class: string, confidence: number}>} candidates
 * @param {Object} rawAnswers
 * @returns {{ ranked: Array, verification: object }}
 */
function verifyCandidates(candidates, rawAnswers) {
  const answers = sanitizeAnswers(rawAnswers);
  const answeredCount = Object.keys(answers).length;
 
  const scored = candidates.map((candidate, originalRank) => {
    const entry = findPlant(candidate.class);
    const comparable = entry
      ? Object.entries(answers).filter(([questionId]) => (entry.features[questionId] || []).length > 0)
      : [];
    const matched = comparable.filter(([questionId, value]) => entry.features[questionId].includes(value)).length;
    const ruleScore = comparable.length > 0 ? matched / comparable.length : null;
    const fused =
      ruleScore === null ? candidate.confidence : MODEL_WEIGHT * candidate.confidence + RULE_WEIGHT * ruleScore;
 
    return {
      class: candidate.class,
      name: candidate.name || formatPlantName(candidate.class),
      modelConfidence: round(candidate.confidence),
      ruleScore: ruleScore === null ? null : round(ruleScore),
      matched,
      compared: comparable.length,
      confidence: round(fused),
      percent: Math.round(fused * 100),
      originalRank,
    };
  });
 
  const ranked = [...scored].sort((a, b) => b.confidence - a.confidence || a.originalRank - b.originalRank);
  const previousTop = candidates[0];
  const newTop = ranked[0];
 
  let status = 'confirmed';
  if (answeredCount === 0) status = 'skipped';
  else if (newTop.class !== previousTop.class) status = 'adjusted';
 
  return {
    ranked,
    verification: {
      status,
      answeredCount,
      previousTop: previousTop ? { class: previousTop.class, name: previousTop.name || formatPlantName(previousTop.class) } : null,
      message: verificationMessage(status, newTop, previousTop),
    },
  };
}
 
function verificationMessage(status, newTop, previousTop) {
  if (status === 'skipped') {
    return 'No feature answers were given, so the prediction is based on the image model alone.';
  }
  if (status === 'adjusted') {
    const before = previousTop.name || formatPlantName(previousTop.class);
    return `Your answers fit ${newTop.name} better than the image model's first guess (${before}), so the ranking was adjusted.`;
  }
  return `Your answers are consistent with ${newTop.name}, so the prediction was kept.`;
}
 
module.exports = { selectQuestions, sanitizeAnswers, verifyCandidates, MODEL_WEIGHT, RULE_WEIGHT, MAX_QUESTIONS };