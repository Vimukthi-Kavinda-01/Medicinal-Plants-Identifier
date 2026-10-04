-- ============================================================================
-- HerbSense: Medicinal Plants Identifier - Database Setup Script
-- Target Database: PostgreSQL 13+ (Supabase / local)
-- Run this entire script in pgAdmin or psql to recreate the schema.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Enable Required Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. Drop Tables (if recreating the schema in development)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS saved_plants CASCADE;
DROP TABLE IF EXISTS plant_scans CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 3. Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,          -- bcrypt hash of the user's password
    full_name VARCHAR(100),
    location VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX idx_users_username ON users (LOWER(username));
CREATE INDEX idx_users_email    ON users (LOWER(email));

-- ----------------------------------------------------------------------------
-- 4. Table: plants
-- ----------------------------------------------------------------------------
CREATE TABLE plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL,
    common_name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(200) NOT NULL,
    family VARCHAR(100),
    medicinal_uses TEXT,
    active_compounds TEXT,
    habitat TEXT,
    precautions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_plants_slug UNIQUE (slug)
);

CREATE INDEX idx_plants_slug ON plants (LOWER(slug));

-- ----------------------------------------------------------------------------
-- 5. Table: plant_scans
-- ----------------------------------------------------------------------------
CREATE TABLE plant_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    plant_id UUID,
    detected_class VARCHAR(100) NOT NULL,
    confidence NUMERIC(5, 4),
    predictions_payload JSONB DEFAULT '[]'::jsonb,
    description TEXT,                     -- AI-generated description stored here
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_scans_user  FOREIGN KEY (user_id)  REFERENCES users  (id) ON DELETE SET NULL,
    CONSTRAINT fk_scans_plant FOREIGN KEY (plant_id) REFERENCES plants (id) ON DELETE SET NULL
);

CREATE INDEX idx_scans_user_id    ON plant_scans (user_id);
CREATE INDEX idx_scans_plant_id   ON plant_scans (plant_id);
CREATE INDEX idx_scans_created_at ON plant_scans (created_at DESC);

-- ----------------------------------------------------------------------------
-- 6. Table: saved_plants
-- ----------------------------------------------------------------------------
CREATE TABLE saved_plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plant_id UUID NOT NULL,
    user_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_saved_user  FOREIGN KEY (user_id)  REFERENCES users  (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_plant FOREIGN KEY (plant_id) REFERENCES plants (id) ON DELETE CASCADE,
    CONSTRAINT uq_saved_plants_user_plant UNIQUE (user_id, plant_id)
);

CREATE INDEX idx_saved_plants_user_id ON saved_plants (user_id);
