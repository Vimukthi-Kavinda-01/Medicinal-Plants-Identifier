'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const detectRoutes = require('./routes/detect');
const describeRoutes = require('./routes/describe');
const identifyRoutes = require('./routes/identify');
const herbariumRoutes = require('./routes/herbarium');
const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plants');
const scanRoutes = require('./routes/scans');
const savedPlantRoutes = require('./routes/savedPlants');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS Configuration ────────────────────────────────────────────────────────
// Any localhost / 127.0.0.1 port is allowed so it keeps working when Vite picks
// another port (5174, 5175, ...). Set FRONTEND_URL in backend/.env for production
// (several URLs can be separated by commas).
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const extraOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server), local dev origins, or FRONTEND_URL
      if (!origin || LOCAL_ORIGIN.test(origin) || extraOrigins.includes(origin)) {
        return callback(null, true);
      }
      const corsError = new Error(`CORS blocked for origin: ${origin}`);
      corsError.status = 403;
      return callback(corsError);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body Parser (20MB limit for high-res camera photos) ──────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── Rate Limiting (prevent abuse of inference credits) ────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded. Please wait a moment before sending another plant scan.',
  },
});
app.use('/api/', apiLimiter);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  const hasKey = Boolean(process.env.ROBOFLOW_API_KEY && process.env.ROBOFLOW_API_KEY.trim());
  const hasDescriptionKey = Boolean(process.env.DESCRIPTION_API_KEY && process.env.DESCRIPTION_API_KEY.trim());

  let databaseConnected = false;
  let databaseDetails = {};
  try {
    const dbCheck = await db.testConnection();
    databaseConnected = dbCheck.connected;
    if (dbCheck.connected) {
      databaseDetails = { database: dbCheck.database };
    }
  } catch (err) {
    databaseConnected = false;
  }

  res.json({
    status: 'ok',
    service: 'HerbSense Backend',
    databaseConnected,
    ...databaseDetails,
    roboflowConfigured: hasKey,
    descriptionConfigured: hasDescriptionKey,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', detectRoutes);
app.use('/api', describeRoutes);
app.use('/api', identifyRoutes); // POST /api/identify, POST /api/verify
app.use('/api', herbariumRoutes); // GET /api/herbarium, GET /api/herbarium/:name
app.use('/api/users', userRoutes);
app.use('/api', plantRoutes);
app.use('/api', scanRoutes);
app.use('/api', savedPlantRoutes);

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// ── Error Handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[HerbSense Server Error]:', err.message);
  const status = err.type === 'entity.too.large' ? 413 : err.status || 500;
  const message =
    status === 413 ? 'The uploaded image is too large. Please use a smaller photo.' : err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// ── Start Server ─────────────────────────────────────────────────────────────
// Only listen when run directly (`npm start`), so tests can import `app`.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🌿 HerbSense Backend running on http://localhost:${PORT}`);
    if (!process.env.ROBOFLOW_API_KEY || !process.env.ROBOFLOW_API_KEY.trim()) {
      console.warn(`⚠️  WARNING: ROBOFLOW_API_KEY is not set in backend/.env`);
      console.warn(`   Inference calls will return an error until you add your key.`);
    } else {
      console.log(`🔑 Roboflow API key is loaded.`);
    }
    console.log(`===============================================`);
  });
}

module.exports = app;