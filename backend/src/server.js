'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const detectRoutes = require('./routes/detect');
const describeRoutes = require('./routes/describe');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plants');
const scanRoutes = require('./routes/scans');
const savedPlantRoutes = require('./routes/savedPlants');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS Configuration ────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173', // Vite preview port
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body Parser (20MB limit for high-res camera photos) ──────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── Rate Limiting (prevent abuse of inference credits) ────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP (increased for auth calls)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded. Please wait a moment before sending another request.',
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
  } catch {
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
app.use('/api/auth', authRoutes);        // POST /api/auth/register, /login, GET /api/auth/me
app.use('/api/users', userRoutes);       // GET/PUT /api/users/profile
app.use('/api', plantRoutes);            // GET /api/plants, /api/plants/:slug
app.use('/api', scanRoutes);             // POST /api/scans, GET /api/scans/my, GET /api/scans
app.use('/api', savedPlantRoutes);       // /api/saved-plants

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// ── Error Handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[HerbSense Server Error]:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🌿 HerbSense Backend running on http://localhost:${PORT}`);
  if (!process.env.ROBOFLOW_API_KEY || !process.env.ROBOFLOW_API_KEY.trim()) {
    console.warn(`⚠️  WARNING: ROBOFLOW_API_KEY is not set in backend/.env`);
  } else {
    console.log(`🔑 Roboflow API key is loaded.`);
  }
  if (!process.env.JWT_SECRET) {
    console.warn(`⚠️  WARNING: JWT_SECRET not set. Using insecure default. Set it in backend/.env`);
  }
  console.log(`===============================================`);
});
