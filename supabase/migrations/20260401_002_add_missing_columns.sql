-- Add missing columns to existing agent_listings table
-- Each column is added separately with IF NOT EXISTS check

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'area') THEN
        ALTER TABLE agent_listings ADD COLUMN area text;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'year_built') THEN
        ALTER TABLE agent_listings ADD COLUMN year_built int;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'floor') THEN
        ALTER TABLE agent_listings ADD COLUMN floor int;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'unit_number') THEN
        ALTER TABLE agent_listings ADD COLUMN unit_number text;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'furnishing') THEN
        ALTER TABLE agent_listings ADD COLUMN furnishing text DEFAULT 'unfurnished';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'parking') THEN
        ALTER TABLE agent_listings ADD COLUMN parking text DEFAULT 'none';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'pets_allowed') THEN
        ALTER TABLE agent_listings ADD COLUMN pets_allowed boolean DEFAULT false;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'zoning') THEN
        ALTER TABLE agent_listings ADD COLUMN zoning text;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'latitude') THEN
        ALTER TABLE agent_listings ADD COLUMN latitude double precision;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'longitude') THEN
        ALTER TABLE agent_listings ADD COLUMN longitude double precision;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'pinned') THEN
        ALTER TABLE agent_listings ADD COLUMN pinned boolean DEFAULT false;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'video_url') THEN
        ALTER TABLE agent_listings ADD COLUMN video_url text;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'property_metadata') THEN
        ALTER TABLE agent_listings ADD COLUMN property_metadata jsonb DEFAULT '{}'::jsonb;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'is_featured') THEN
        ALTER TABLE agent_listings ADD COLUMN is_featured boolean DEFAULT false;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'expires_at') THEN
        ALTER TABLE agent_listings ADD COLUMN expires_at timestamptz;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'saves_count') THEN
        ALTER TABLE agent_listings ADD COLUMN saves_count int DEFAULT 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'inquiries_count') THEN
        ALTER TABLE agent_listings ADD COLUMN inquiries_count int DEFAULT 0;
    END IF;
END $$;
