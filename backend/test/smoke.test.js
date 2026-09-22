'use strict';

const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { runRoboflowWorkflow, WORKFLOW_URL } = require('../src/services/roboflow');

// Minimal 1x1 valid JPEG in base64
const SAMPLE_IMAGE_BASE64 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
  'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
  'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
  'MjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAU' +
  'EAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAA' +
  'AAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJ+AAD//2Q==';

async function runSmokeTest() {
  console.log('🧪 Starting Roboflow Workflow Smoke Test...');
  console.log(`🌐 Target Endpoint: ${WORKFLOW_URL}`);

  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('❌ ROBOFLOW_API_KEY is not set in backend/.env.');
    process.exit(1);
  }

  try {
    const startTime = Date.now();
    const result = await runRoboflowWorkflow(SAMPLE_IMAGE_BASE64, apiKey);
    const duration = Date.now() - startTime;

    console.log(`⏱️ Inference roundtrip completed in ${duration}ms.`);

    // Assert raw response has 'outputs'
    assert(result && typeof result === 'object', 'Result must be an object');
    assert(result.raw && typeof result.raw === 'object', 'Result must contain raw response object');
    assert(Array.isArray(result.raw.outputs), 'Raw response must contain "outputs" array');
    assert(result.raw.outputs.length > 0, '"outputs" array must have at least one element');

    const outputObj = result.raw.outputs[0];
    const outputKeys = Object.keys(outputObj);
    console.log(`🔑 Detected workflow output keys: [ ${outputKeys.join(', ')} ]`);

    // Verify expected output key exists
    assert(outputKeys.length > 0, 'Workflow output dict must contain at least one output key');

    // Assert sanitized predictions array exists
    assert(Array.isArray(result.predictions), 'result.predictions must be an array');
    console.log(`🌿 Parsed predictions count: ${result.predictions.length}`);

    if (result.predictions.length > 0) {
      console.log('Top prediction:', result.predictions[0]);
    } else {
      console.log('ℹ️ No plant detected in 1x1 test image (expected behavior for blank sample).');
    }

    console.log('✅ Smoke test PASSED successfully!');
  } catch (err) {
    console.error('❌ Smoke test FAILED:', err.message);
    if (err.status) console.error(`HTTP Status: ${err.status}`);
    if (err.details) console.error('Details:', err.details);
    process.exit(1);
  }
}

runSmokeTest();
