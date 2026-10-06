'use strict';
 
// Offline unit + route tests for the guided identification pipeline.
// Run with: npm run test:unit   (no API keys or network needed)
 
const test = require('node:test');
const assert = require('node:assert/strict');
 
process.env.ROBOFLOW_API_KEY = 'test-key';
 
const roboflow = require('../src/services/roboflow');
const { classifyConfidence, needsVerification, buildTopThree } = require('../src/services/confidence');
const { findPlant, findSimilarPlants, listPlants } = require('../src/services/herbarium');
const { selectQuestions, sanitizeAnswers, verifyCandidates } = require('../src/services/ruleEngine');
const { buildFinalResult } = require('../src/services/resultBuilder');
const { PLANTS } = require('../src/data/plants');
const { QUESTIONS } = require('../src/data/questions');
const app = require('../src/server');
 
test('confidence levels use 0.75 / 0.45 thresholds', () => {
  assert.equal(classifyConfidence(0.9), 'high');
  assert.equal(classifyConfidence(0.75), 'high');
  assert.equal(classifyConfidence(0.6), 'medium');
  assert.equal(classifyConfidence(0.45), 'medium');
  assert.equal(classifyConfidence(0.1), 'low');
  assert.equal(classifyConfidence(NaN), 'low');
  assert.equal(needsVerification('high'), false);
  assert.equal(needsVerification('medium'), true);
  assert.equal(needsVerification('low'), true);
});
 
test('buildTopThree keeps the three best, sorted, with display fields', () => {
  const top = buildTopThree([
    { class: 'neem', confidence: 0.2 },
    { class: 'aloe_vera', confidence: 0.9 },
    { class: 'tulsi', confidence: 0.5 },
    { class: 'ginger', confidence: 0.1 },
    { class: 'bad', confidence: 'x' },
  ]);
  assert.deepEqual(top.map((p) => p.class), ['aloe_vera', 'tulsi', 'neem']);
  assert.equal(top[0].name, 'Aloe Vera');
  assert.equal(top[0].percent, 90);
});
 
test('herbarium data is internally consistent', () => {
  const ids = new Set(PLANTS.map((p) => p.id));
  assert.equal(ids.size, PLANTS.length, 'ids must be unique');
  for (const plant of PLANTS) {
    for (const [feature, values] of Object.entries(plant.features)) {
      const question = QUESTIONS.find((q) => q.id === feature);
      assert.ok(question, `${plant.id}: unknown feature ${feature}`);
      for (const value of values) {
        assert.ok(question.options.some((o) => o.value === value), `${plant.id}: ${feature}=${value} is not a question option`);
      }
    }
    for (const look of plant.lookalikes) assert.ok(ids.has(look.id), `${plant.id}: unknown look-alike ${look.id}`);
  }
  assert.equal(listPlants().length, PLANTS.length);
});
 
test('findPlant handles labels, aliases and noisy names', () => {
  assert.equal(findPlant('aloe_vera').id, 'aloe-vera');
  assert.equal(findPlant('ALOE-VERA').id, 'aloe-vera');
  assert.equal(findPlant('Holy Basil').id, 'tulsi');
  assert.equal(findPlant('aloe vera leaf').id, 'aloe-vera');
   assert.equal(findPlant('Aleovera').id, 'aloe-vera');
  assert.equal(findPlant('Gotu kola').id, 'gotu-kola');
  assert.equal(findPlant('dandelion'), null);
  assert.equal(findPlant(''), null);
  assert.equal(findPlant(undefined), null);
});
 
test('findSimilarPlants returns curated look-alikes first and never the plant itself', () => {
  const similar = findSimilarPlants(findPlant('tulsi'));
  assert.equal(similar[0].id, 'peppermint');
  assert.ok(similar[0].tip);
  assert.ok(similar.every((s) => s.id !== 'tulsi'));
  assert.ok(similar.length <= 3);
  assert.deepEqual(findSimilarPlants(null), []);
});
 
test('selectQuestions asks discriminating questions only', () => {
  const questions = selectQuestions([{ class: 'tulsi' }, { class: 'peppermint' }, { class: 'aloe_vera' }]);
  assert.ok(questions.length > 0 && questions.length <= 3);
  // Tulsi vs peppermint share arrangement/shape, but aloe differs -> arrangement must be useful.
  assert.ok(questions.some((q) => q.id === 'leafArrangement'));
  assert.deepEqual(selectQuestions([{ class: 'unknown_thing' }]), []);
});
 
test('sanitizeAnswers drops unknown ids, invalid values and "unsure"', () => {
  const clean = sanitizeAnswers({ leafShape: 'oval', scent: 'unsure', bogus: 'x', growthHabit: 'spaceship' });
  assert.deepEqual(clean, { leafShape: 'oval' });
  assert.deepEqual(sanitizeAnswers(null), {});
  assert.deepEqual(sanitizeAnswers([]), {});
});
 
test('verifyCandidates can adjust the ranking when answers contradict the model', () => {
  const candidates = [
    { class: 'tulsi', name: 'Tulsi', confidence: 0.5 },
    { class: 'peppermint', name: 'Peppermint', confidence: 0.4 },
  ];
  const { ranked, verification } = verifyCandidates(candidates, { scent: 'minty' });
  assert.equal(ranked[0].class, 'peppermint');
  assert.equal(verification.status, 'adjusted');
  assert.equal(verification.previousTop.class, 'tulsi');
});
 
test('verifyCandidates confirms when answers agree, and skips when none are given', () => {
  const candidates = [
    { class: 'neem', name: 'Neem', confidence: 0.6 },
    { class: 'moringa', name: 'Moringa', confidence: 0.3 },
  ];
  const confirmed = verifyCandidates(candidates, { scent: 'pungent', growthHabit: 'tree' });
  assert.equal(confirmed.verification.status, 'confirmed');
  assert.ok(confirmed.ranked[0].confidence > 0.6, 'matching answers should raise confidence');
 
  const skipped = verifyCandidates(candidates, { scent: 'unsure' });
  assert.equal(skipped.verification.status, 'skipped');
  assert.equal(skipped.ranked[0].confidence, 0.6);
});
 
test('buildFinalResult returns info, similar plants and a severity-matched warning', () => {
  const low = buildFinalResult([{ class: 'neem', name: 'Neem', confidence: 0.2 }], { status: 'skipped' });
  assert.equal(low.level, 'low');
  assert.equal(low.warning.severity, 'critical');
  assert.equal(low.info.name, 'Neem');
 
  const unknown = buildFinalResult([{ class: 'mystery', name: 'Mystery', confidence: 0.9 }], { status: 'not_needed' });
  assert.equal(unknown.info, null);
  assert.deepEqual(unknown.similar, []);
  assert.ok(unknown.warning.messages.some((m) => /not in the digital herbarium/.test(m)));
});
 
// ── Route tests (Roboflow is stubbed) ─────────────────────────────────────────
async function withServer(fn) {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}
 
const post = (base, path, body) =>
  fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(
    async (r) => ({ status: r.status, json: await r.json() })
  );
 
test('POST /api/identify: high confidence goes straight to the final result', async () => {
  const original = roboflow.runRoboflowWorkflow;
  roboflow.runRoboflowWorkflow = async () => ({
    predictions: [{ class: 'aloe_vera', confidence: 0.93 }, { class: 'neem', confidence: 0.04 }],
  });
  try {
    await withServer(async (base) => {
      const { status, json } = await post(base, '/api/identify', { image: 'data:image/jpeg;base64,AAAA' });
      assert.equal(status, 200);
      assert.equal(json.stage, 'final');
      assert.equal(json.level, 'high');
      assert.equal(json.result.info.name, 'Aloe Vera');
      assert.equal(json.result.verification.status, 'not_needed');
    });
  } finally {
    roboflow.runRoboflowWorkflow = original;
  }
});
 
test('POST /api/identify -> /api/verify: medium confidence asks questions then finalises', async () => {
  const original = roboflow.runRoboflowWorkflow;
  roboflow.runRoboflowWorkflow = async () => ({
    predictions: [
      { class: 'tulsi', confidence: 0.5 },
      { class: 'peppermint', confidence: 0.4 },
      { class: 'aloe_vera', confidence: 0.05 },
    ],
  });
  try {
    await withServer(async (base) => {
      const first = await post(base, '/api/identify', { image: 'AAAA' });
      assert.equal(first.json.stage, 'verification');
      assert.equal(first.json.top3.length, 3);
      assert.ok(first.json.questions.length > 0);
 
      const second = await post(base, '/api/verify', { candidates: first.json.top3, answers: { scent: 'minty' } });
      assert.equal(second.status, 200);
      assert.equal(second.json.stage, 'final');
      assert.equal(second.json.result.top.class, 'peppermint');
      assert.equal(second.json.result.verification.status, 'adjusted');
      assert.ok(second.json.result.similar.length > 0);
      assert.ok(second.json.result.warning.messages.length > 0);
    });
  } finally {
    roboflow.runRoboflowWorkflow = original;
  }
});
 
test('POST /api/identify: no detections gives stage "none"', async () => {
  const original = roboflow.runRoboflowWorkflow;
  roboflow.runRoboflowWorkflow = async () => ({ predictions: [] });
  try {
    await withServer(async (base) => {
      const { json } = await post(base, '/api/identify', { image: 'AAAA' });
      assert.equal(json.stage, 'none');
    });
  } finally {
    roboflow.runRoboflowWorkflow = original;
  }
});
 
test('input validation returns 400 and Roboflow errors keep their status', async () => {
  const original = roboflow.runRoboflowWorkflow;
  await withServer(async (base) => {
    assert.equal((await post(base, '/api/identify', {})).status, 400);
    assert.equal((await post(base, '/api/verify', { candidates: [], answers: {} })).status, 400);
    assert.equal((await post(base, '/api/verify', { candidates: [{ class: 'x', confidence: 5 }], answers: {} })).status, 400);
 
    roboflow.runRoboflowWorkflow = async () => {
      throw new roboflow.RoboflowError('Roboflow rate limit reached.', 429);
    };
    const limited = await post(base, '/api/identify', { image: 'AAAA' });
    assert.equal(limited.status, 429);
  });
  roboflow.runRoboflowWorkflow = original;
});
 
test('GET /api/herbarium routes', async () => {
  await withServer(async (base) => {
    const list = await (await fetch(`${base}/api/herbarium`)).json();
    assert.equal(list.count, PLANTS.length);
 
    const one = await fetch(`${base}/api/herbarium/holy%20basil`);
    assert.equal(one.status, 200);
    assert.equal((await one.json()).plant.name, 'Tulsi');
 
    assert.equal((await fetch(`${base}/api/herbarium/unknown-plant`)).status, 404);
  });
});
 