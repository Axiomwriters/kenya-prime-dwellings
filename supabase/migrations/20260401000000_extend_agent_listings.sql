-- Extend agent_listings with additional fields for comprehensive property listings
ALTER TABLE agent_listings 
ADD COLUMN IF NOT EXISTS county text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS area text,
ADD COLUMN IF NOT EXISTS year_built int,
ADD COLUMN IF NOT EXISTS floor int,
ADD COLUMN IF NOT EXISTS unit_number text,
ADD COLUMN IF NOT EXISTS furnishing text DEFAULT 'unfurnished',
ADD COLUMN IF NOT EXISTS parking text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS pets_allowed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS zoning text,
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision,
ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS property_metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agent_listings_category ON agent_listings(category);
CREATE INDEX IF NOT EXISTS idx_agent_listings_listing_type ON agent_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_agent_listings_price ON agent_listings(price);
CREATE INDEX IF NOT EXISTS idx_agent_listings_location ON agent_listings(location);
CREATE INDEX IF NOT EXISTS idx_agent_listings_created_at ON agent_listings(created_at DESC);

-- Create function to automatically set expires_at for new listings
CREATE OR REPLACE FUNCTION set_listing_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at IS NULL THEN
        NEW.expires_at := NOW() + INTERVAL '90 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set expiry on insert
DROP TRIGGER IF EXISTS set_listing_expiry_trigger ON agent_listings;
CREATE TRIGGER set_listing_expiry_trigger
    BEFORE INSERT ON agent_listings
    FOR EACH ROW
    EXECUTE FUNCTION set_listing_expiry();
