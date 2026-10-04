'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'herbsense-dev-secret-change-in-production';

/**
 * Middleware: authenticate
 * Verifies the JWT Bearer token in the Authorization header.
 * Sets req.user = { id, username, email } if valid.
 * Returns 401 if token is missing or invalid.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username, email: decoded.email };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    }
    return res.status(401).json({ error: 'Invalid token. Please sign in again.' });
  }
}

/**
 * Middleware: optionalAuthenticate
 * Like authenticate but does NOT block the request if no token is provided.
 * Sets req.user if token is valid, otherwise leaves req.user = null.
 */
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username, email: decoded.email };
  } catch {
    req.user = null;
  }

  return next();
}

module.exports = { authenticate, optionalAuthenticate };
