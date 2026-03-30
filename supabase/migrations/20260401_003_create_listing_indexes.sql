-- Create performance indexes for agent_listings
-- Using DO blocks to handle errors gracefully

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_category ON agent_listings(category);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_listing_type ON agent_listings(listing_type);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_price ON agent_listings(price);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_location ON agent_listings(location);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_created_at ON agent_listings(created_at DESC);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_agent_id ON agent_listings(agent_id);
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        CREATE INDEX IF NOT EXISTS idx_agent_listings_status ON agent_listings(status);
    END IF;
END $$;
