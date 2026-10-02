-- ============================================================================
-- HerbSense: Medicinal Plants Identifier - Database Setup Script
-- Target Database: PostgreSQL 13+ (compatible with pgAdmin 4)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Enable Required Extensions
-- ----------------------------------------------------------------------------
-- "pgcrypto" provides cryptographic functions including gen_random_uuid().
-- PostgreSQL 13+ has gen_random_uuid() built-in, but this ensures compatibility.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. Drop Tables (if recreating the schema in development)
-- ----------------------------------------------------------------------------
-- Drop in reverse dependency order (child tables first, parent tables last)
DROP TABLE IF EXISTS saved_plants CASCADE;
DROP TABLE IF EXISTS plant_scans CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 3. Table: users
-- ----------------------------------------------------------------------------
-- Stores user profile data created via the HerbSense Profile page.
-- Currently operates without mandatory authentication/passwords.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    location VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Index on username for fast profile lookup
CREATE INDEX idx_users_username ON users (LOWER(username));

-- ----------------------------------------------------------------------------
-- 4. Table: plants
-- ----------------------------------------------------------------------------
-- Master botanical knowledge base storing therapeutic and medicinal data.
-- Initial records are seeded from plantKnowledge.js.
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

    -- Constraints
    CONSTRAINT uq_plants_slug UNIQUE (slug)
);

-- Index on slug for fast botanical lookups (e.g. /api/plants/aloe-vera)
CREATE INDEX idx_plants_slug ON plants (LOWER(slug));

-- ----------------------------------------------------------------------------
-- 5. Table: plant_scans
-- ----------------------------------------------------------------------------
-- Stores records of AI identification scans performed via Roboflow YOLO11n.
-- user_id is NULLABLE so guest scans are captured without requiring a profile.
CREATE TABLE plant_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    plant_id UUID,
    detected_class VARCHAR(100) NOT NULL,
    confidence NUMERIC(5, 4),
    predictions_payload JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Foreign Keys with ON DELETE SET NULL to preserve scan history
    CONSTRAINT fk_scans_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE SET NULL,

    CONSTRAINT fk_scans_plant
        FOREIGN KEY (plant_id)
        REFERENCES plants (id)
        ON DELETE SET NULL
);

-- Indexes for querying scan history
CREATE INDEX idx_scans_user_id ON plant_scans (user_id);
CREATE INDEX idx_scans_plant_id ON plant_scans (plant_id);
CREATE INDEX idx_scans_created_at ON plant_scans (created_at DESC);

-- ----------------------------------------------------------------------------
-- 6. Table: saved_plants
-- ----------------------------------------------------------------------------
-- Allows registered users to bookmark plants to their personal collection.
CREATE TABLE saved_plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plant_id UUID NOT NULL,
    user_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Foreign Keys: Cascade deletion if user or plant is removed
    CONSTRAINT fk_saved_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_saved_plant
        FOREIGN KEY (plant_id)
        REFERENCES plants (id)
        ON DELETE CASCADE,

    -- Prevent a user from saving the exact same plant multiple times
    CONSTRAINT uq_saved_plants_user_plant UNIQUE (user_id, plant_id)
);

-- Index for fetching a user's saved plants quickly
CREATE INDEX idx_saved_plants_user_id ON saved_plants (user_id);
