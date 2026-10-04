'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticate } = require('../middleware/authenticate');

const JWT_SECRET = process.env.JWT_SECRET || 'herbsense-dev-secret-change-in-production';
const JWT_EXPIRES_IN = '30d'; // 30-day sessions
const SALT_ROUNDS = 12;

/**
 * Signs a JWT token for the given user.
 */
function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Formats a user DB row to a safe public object (no password_hash).
 */
function formatUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    fullName: row.full_name,
    location: row.location,
    bio: row.bio,
    createdAt: row.created_at,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/auth/register
   Body: { username, email, password, fullName? }
   Returns: { token, user }
───────────────────────────────────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Username is required.' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = typeof fullName === 'string' ? fullName.trim() : null;

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Username: alphanumeric + underscores + hyphens, 3-30 chars
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({
        error: 'Username must be 3–30 characters (letters, numbers, _ or -).',
      });
    }

    // ── Uniqueness check ──────────────────────────────────────────────────────
    const existing = await db.query(
      `SELECT id, username, email FROM users
       WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)
       LIMIT 1;`,
      [cleanUsername, cleanEmail]
    );

    if (existing.rows.length > 0) {
      const match = existing.rows[0];
      if (match.username.toLowerCase() === cleanUsername.toLowerCase()) {
        return res.status(409).json({ error: `Username "${cleanUsername}" is already taken.` });
      }
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    // ── Hash password & insert ─────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, full_name, location, bio, created_at;`,
      [cleanUsername, cleanEmail, passwordHash, cleanFullName]
    );

    const user = result.rows[0];
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (err) {
    console.error('[Register Error]:', err.message);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/auth/login
   Body: { login, password }  — "login" can be email OR username
   Returns: { token, user }
───────────────────────────────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || typeof login !== 'string' || !login.trim()) {
      return res.status(400).json({ error: 'Email or username is required.' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const cleanLogin = login.trim().toLowerCase();

    // Find by email OR username
    const result = await db.query(
      `SELECT id, username, email, password_hash, full_name, location, bio, created_at
       FROM users
       WHERE LOWER(email) = $1 OR LOWER(username) = $1
       LIMIT 1;`,
      [cleanLogin]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'No account found with that email or username.' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = signToken(user);

    return res.json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (err) {
    console.error('[Login Error]:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/auth/me
   Header: Authorization: Bearer <token>
   Returns: { user }  — validates token and returns current user
───────────────────────────────────────────────────────────────────────────── */
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, email, full_name, location, bio, created_at
       FROM users WHERE id = $1 LIMIT 1;`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.json({
      success: true,
      user: formatUser(result.rows[0]),
    });
  } catch (err) {
    console.error('[Auth Me Error]:', err.message);
    return res.status(500).json({ error: 'Failed to verify session.' });
  }
});

module.exports = router;
