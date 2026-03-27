-- Admin Portal Setup SQL
-- Run this in Supabase SQL Editor

-- Add columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '{}';

-- RLS Policy to allow reading profiles (for admin accounts page)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- RLS Policy to allow updating profiles
DROP POLICY IF EXISTS "Profiles are updatable by authenticated users" ON profiles;
CREATE POLICY "Profiles are updatable by authenticated users" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (true);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy for admin_users
DROP POLICY IF EXISTS "Admin users are viewable" ON admin_users;
CREATE POLICY "Admin users are viewable" 
  ON admin_users FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy for user_roles
DROP POLICY IF EXISTS "User roles are viewable" ON user_roles;
CREATE POLICY "User roles are viewable" 
  ON user_roles FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create viewings table
CREATE TABLE IF NOT EXISTS viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  property_id UUID,
  property_title TEXT,
  viewing_date DATE NOT NULL,
  viewing_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on viewings
ALTER TABLE viewings ENABLE ROW LEVEL SECURITY;

-- RLS Policy for viewings
DROP POLICY IF EXISTS "Viewings are viewable" ON viewings;
CREATE POLICY "Viewings are viewable" 
  ON viewings FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create trips table if not exists
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  property_title TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total_price DECIMAL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on trips
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- RLS Policy for trips
DROP POLICY IF EXISTS "Trips are viewable" ON trips;
CREATE POLICY "Trips are viewable" 
  ON trips FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Create listings table if not exists
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price DECIMAL,
  property_type TEXT,
  listing_type TEXT,
  status TEXT DEFAULT 'active',
  bedrooms INTEGER,
  bathrooms INTEGER,
  location TEXT,
  images JSONB DEFAULT '[]',
  agent_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RLS Policy for listings
DROP POLICY IF EXISTS "Listings are viewable" ON listings;
CREATE POLICY "Listings are viewable" 
  ON listings FOR SELECT 
  TO authenticated, anon 
  USING (true);
