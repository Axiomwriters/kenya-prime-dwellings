-- Create listing status and category enums if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
        CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_category') THEN
        CREATE TYPE property_category AS ENUM ('house', 'apartment', 'land', 'commercial', 'villa', 'bungalow', 'townhouse', 'cottage', 'residential_plot', 'commercial_land', 'agricultural', 'industrial');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
        CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'lease');
    END IF;
END $$;

-- Create agent_listings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.agent_listings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category property_category not null default 'house',
  listing_type listing_type not null default 'sale',
  price numeric not null,
  location text not null,
  county text,
  city text,
  area text,
  bedrooms int,
  bathrooms int,
  land_size text,
  amenities jsonb DEFAULT '[]'::jsonb,
  images text[] DEFAULT '{}'::text[],
  status listing_status default 'draft',
  rejection_reason text,
  view_count int default 0,
  saves_count int default 0,
  inquiries_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz,
  -- New columns
  year_built int,
  floor int,
  unit_number text,
  furnishing text DEFAULT 'unfurnished',
  parking text DEFAULT 'none',
  pets_allowed boolean DEFAULT false,
  zoning text,
  latitude double precision,
  longitude double precision,
  pinned boolean DEFAULT false,
  video_url text,
  property_metadata jsonb DEFAULT '{}'::jsonb,
  is_featured boolean DEFAULT false,
  expires_at timestamptz
);

-- Enable RLS
ALTER TABLE public.agent_listings ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can view own listings' AND tablename = 'agent_listings') THEN
        CREATE POLICY "Agents can view own listings" ON agent_listings FOR SELECT USING (auth.uid() = agent_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can insert own listings' AND tablename = 'agent_listings') THEN
        CREATE POLICY "Agents can insert own listings" ON agent_listings FOR INSERT WITH CHECK (auth.uid() = agent_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can update own listings' AND tablename = 'agent_listings') THEN
        CREATE POLICY "Agents can update own listings" ON agent_listings FOR UPDATE USING (auth.uid() = agent_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can delete own listings' AND tablename = 'agent_listings') THEN
        CREATE POLICY "Agents can delete own listings" ON agent_listings FOR DELETE USING (auth.uid() = agent_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view approved listings' AND tablename = 'agent_listings') THEN
        CREATE POLICY "Public can view approved listings" ON agent_listings FOR SELECT USING (status = 'approved');
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_listings_category ON agent_listings(category);
CREATE INDEX IF NOT EXISTS idx_agent_listings_listing_type ON agent_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_agent_listings_price ON agent_listings(price);
CREATE INDEX IF NOT EXISTS idx_agent_listings_location ON agent_listings(location);
CREATE INDEX IF NOT EXISTS idx_agent_listings_created_at ON agent_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_listings_agent_id ON agent_listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_listings_status ON agent_listings(status);

-- Function to set expiry
DROP FUNCTION IF EXISTS set_listing_expiry();

CREATE FUNCTION set_listing_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at IS NULL THEN
        NEW.expires_at := NOW() + INTERVAL '90 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS set_listing_expiry_trigger ON agent_listings;

CREATE TRIGGER set_listing_expiry_trigger
    BEFORE INSERT ON agent_listings
    FOR EACH ROW
    EXECUTE FUNCTION set_listing_expiry();
