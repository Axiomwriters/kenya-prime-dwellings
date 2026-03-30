-- Live Listings Tracking Migration
-- Run this first to add tracking columns

-- Add tracking columns to agent_listings
ALTER TABLE agent_listings 
ADD COLUMN IF NOT EXISTS saves_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiries_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count_30d INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_agent_listings_status ON agent_listings(status);
CREATE INDEX IF NOT EXISTS idx_agent_listings_agent_id ON agent_listings(agent_id);

-- Create table for tracking listing saves (favorites)
CREATE TABLE IF NOT EXISTS listing_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES agent_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

-- Create table for tracking listing inquiries
CREATE TABLE IF NOT EXISTS listing_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES agent_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE listing_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listing_saves
CREATE POLICY "Users can view their own saves"
  ON listing_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves"
  ON listing_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
  ON listing_saves FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Agents can view saves for their listings"
  ON listing_saves FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent_listings 
      WHERE id = listing_saves.listing_id 
      AND agent_id = auth.uid()
    )
  );

-- RLS Policies for listing_inquiries
CREATE POLICY "Anyone can insert inquiries"
  ON listing_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agents can view inquiries for their listings"
  ON listing_inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent_listings 
      WHERE id = listing_inquiries.listing_id 
      AND agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can update inquiries for their listings"
  ON listing_inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agent_listings 
      WHERE id = listing_inquiries.listing_id 
      AND agent_id = auth.uid()
    )
  );

-- Storage bucket for property images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for property-images
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Agents can update their own property images" ON storage.objects;
CREATE POLICY "Agents can update their own property images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
