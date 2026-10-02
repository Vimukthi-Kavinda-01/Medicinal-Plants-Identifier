'use strict';

const { Pool } = require('pg');

/**
 * PostgreSQL Connection Pool for HerbSense
 *
 * Configured using environment variables from backend/.env.
 * Fallback values are safe defaults for local development.
 */
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME || 'herbsense_db',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      max: 20, // Maximum active clients in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
});

/**
 * Executes a parameterized SQL query against the database pool.
 *
 * @param {string} text - The SQL query text with $1, $2, etc. placeholders
 * @param {Array<any>} [params] - The parameter values to bind
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SQL Query] duration=${duration}ms rows=${res.rowCount}`);
  }
  return res;
}

/**
 * Tests connectivity to the PostgreSQL database.
 *
 * @returns {Promise<{ connected: boolean, timestamp?: string, error?: string }>}
 */
async function testConnection() {
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
