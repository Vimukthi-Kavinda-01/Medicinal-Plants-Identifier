'use strict';

const { Pool } = require('pg');

/**
 * PostgreSQL Connection Pool for HerbSense (Supabase Cloud Database)
 *
 * Exclusively uses DATABASE_URL from backend/.env.
 * SSL is enabled with rejectUnauthorized: false for secure cloud connectivity.
 */
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.warn('[PostgreSQL Warning]: DATABASE_URL is not set in backend/.env. Cloud database features will be disabled.');
}

const pool = new Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        // Fallback dummy client if no database URL is supplied
        max: 0,
      }
);

pool.on('error', (err) => {
  console.error('[Supabase PostgreSQL Pool Unexpected Error]:', err.message);
});

/**
 * Executes a parameterized SQL query against the cloud database pool.
 *
 * @param {string} text - The SQL query text with $1, $2, etc. placeholders
 * @param {Array<any>} [params] - The parameter values to bind
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  if (!databaseUrl) {
    throw new Error('Database is not configured. Please set DATABASE_URL in backend/.env');
  }

  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Cloud SQL Query] duration=${duration}ms rows=${res.rowCount}`);
  }
  return res;
}

/**
 * Tests connectivity to the Supabase PostgreSQL database.
 *
 * @returns {Promise<{ connected: boolean, timestamp?: string, database?: string, error?: string }>}
 */
async function testConnection() {
  if (!databaseUrl) {
    return {
      connected: false,
      error: 'DATABASE_URL environment variable is missing.',
    };
  }

  try {
    const res = await pool.query('SELECT NOW() AS now, current_database() AS db;');
    return {
      connected: true,
      timestamp: res.rows[0]?.now,
      database: res.rows[0]?.db,
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};
