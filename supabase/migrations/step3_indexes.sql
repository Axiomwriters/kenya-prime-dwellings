-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_listings_category ON agent_listings(category);
CREATE INDEX IF NOT EXISTS idx_agent_listings_listing_type ON agent_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_agent_listings_price ON agent_listings(price);
CREATE INDEX IF NOT EXISTS idx_agent_listings_location ON agent_listings(location);
CREATE INDEX IF NOT EXISTS idx_agent_listings_created_at ON agent_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_listings_agent_id ON agent_listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_listings_status ON agent_listings(status);

SELECT 'Step 3: Indexes created' as status;
