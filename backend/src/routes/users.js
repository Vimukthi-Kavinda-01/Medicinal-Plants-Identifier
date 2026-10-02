'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * POST /api/users/profile
 * Create a new user profile.
 * Body: { username, email, fullName, location, bio, avatarUrl }
 */
router.post('/profile', async (req, res) => {
  try {
    const { username, email, fullName, location, bio, avatarUrl } = req.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = typeof fullName === 'string' ? fullName.trim() : null;
    const cleanLocation = typeof location === 'string' ? location.trim() : null;
    const cleanBio = typeof bio === 'string' ? bio.trim() : null;
    const cleanAvatarUrl = typeof avatarUrl === 'string' ? avatarUrl.trim() : null;

    // Check if username or email already exists
    const existingCheck = await db.query(
      `SELECT id, username, email FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2);`,
      [cleanUsername, cleanEmail]
    );

    if (existingCheck.rows.length > 0) {
      const match = existingCheck.rows[0];
      if (match.username.toLowerCase() === cleanUsername.toLowerCase()) {
        return res.status(409).json({
          error: `Username "${cleanUsername}" is already taken. Please choose another username or update your profile.`,
          existingUsername: true,
        });
      }
      return res.status(409).json({
        error: `Email "${cleanEmail}" is already associated with an account.`,
        existingEmail: true,
      });
    }

    // Insert new user profile with raw SQL
    const insertSql = `
      INSERT INTO users (username, email, full_name, location, bio, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, full_name, location, bio, avatar_url, created_at, updated_at;
    `;

    const result = await db.query(insertSql, [
      cleanUsername,
      cleanEmail,
      cleanFullName,
      cleanLocation,
      cleanBio,
      cleanAvatarUrl,
    ]);

    const user = result.rows[0];
    return res.status(201).json({
      success: true,
      message: 'Profile created successfully!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        location: user.location,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error('[Create Profile Error]:', err.message);
    return res.status(500).json({ error: 'Failed to create user profile in database.' });
  }
});

/**
 * GET /api/users/profile/:username
 * Retrieve a user profile by username.
 */
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username parameter is required.' });
    }

    const result = await db.query(
      `SELECT id, username, email, full_name, location, bio, avatar_url, created_at, updated_at
       FROM users
       WHERE LOWER(username) = LOWER($1);`,
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `User profile "${username}" not found.` });
    }

    const user = result.rows[0];
    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        location: user.location,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error('[Get Profile Error]:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve profile from database.' });
  }
});

/**
 * PUT /api/users/profile/:username
 * Update an existing user profile by username.
 * Body: { email, fullName, location, bio, avatarUrl }
 */
router.put('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { email, fullName, location, bio, avatarUrl } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username parameter is required.' });
    }

    // Verify user exists first
    const existing = await db.query(
      `SELECT id, username, email FROM users WHERE LOWER(username) = LOWER($1);`,
      [username.trim()]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: `User profile "${username}" not found.` });
    }

    const userId = existing.rows[0].id;

    // If changing email, check uniqueness
    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      const emailCheck = await db.query(
        `SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id != $2;`,
        [cleanEmail, userId]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ error: `Email "${cleanEmail}" is already used by another account.` });
      }
    }

    const updateSql = `
      UPDATE users
      SET
        email = COALESCE($1, email),
        full_name = COALESCE($2, full_name),
        location = COALESCE($3, location),
        bio = COALESCE($4, bio),
        avatar_url = COALESCE($5, avatar_url),
        updated_at = NOW()
      WHERE id = $6
      RETURNING id, username, email, full_name, location, bio, avatar_url, created_at, updated_at;
    `;

    const result = await db.query(updateSql, [
      email ? email.trim().toLowerCase() : null,
      fullName !== undefined ? (typeof fullName === 'string' ? fullName.trim() : null) : null,
      location !== undefined ? (typeof location === 'string' ? location.trim() : null) : null,
      bio !== undefined ? (typeof bio === 'string' ? bio.trim() : null) : null,
      avatarUrl !== undefined ? (typeof avatarUrl === 'string' ? avatarUrl.trim() : null) : null,
      userId,
    ]);

    const updated = result.rows[0];
    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        fullName: updated.full_name,
        location: updated.location,
        bio: updated.bio,
        avatarUrl: updated.avatar_url,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
    });
  } catch (err) {
    console.error('[Update Profile Error]:', err.message);
    return res.status(500).json({ error: 'Failed to update user profile in database.' });
  }
});

module.exports = router;
