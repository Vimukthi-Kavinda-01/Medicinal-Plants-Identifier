'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const detectRoutes = require('./routes/detect');

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
    methods: ['GET', 'POST', 'OPTIONS'],
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
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.ROBOFLOW_API_KEY && process.env.ROBOFLOW_API_KEY.trim());
  res.json({
    status: 'ok',
    service: 'HerbSense Backend',
    roboflowConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', detectRoutes);

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
    console.warn(`   Inference calls will return an error until you add your key.`);
  } else {
    console.log(`🔑 Roboflow API key is loaded.`);
  }
  console.log(`===============================================`);
});

