-- Create performance indexes for agent_listings
-- Check for table AND column existence

DO $$
DECLARE
    col_exists boolean;
BEGIN
    -- Check if category column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'agent_listings' AND column_name = 'category'
    ) INTO col_exists;
    
    IF col_exists THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_category ON agent_listings(category);
        CREATE INDEX IF NOT EXISTS idx_agent_listings_listing_type ON agent_listings(listing_type);
        CREATE INDEX IF NOT EXISTS idx_agent_listings_status ON agent_listings(status);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'price') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_price ON agent_listings(price);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'location') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_location ON agent_listings(location);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_created_at ON agent_listings(created_at DESC);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'agent_id') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_agent_id ON agent_listings(agent_id);
    END IF;
END $$;
