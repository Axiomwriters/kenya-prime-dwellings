-- Add missing columns to existing agent_listings table
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS area text;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS year_built int;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS floor int;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS unit_number text;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS furnishing text DEFAULT 'unfurnished';
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS parking text DEFAULT 'none';
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS pets_allowed boolean DEFAULT false;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS zoning text;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS longitude double precision;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS property_metadata jsonb DEFAULT '{}'::jsonb;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS saves_count int DEFAULT 0;
ALTER TABLE agent_listings ADD COLUMN IF NOT EXISTS inquiries_count int DEFAULT 0;
