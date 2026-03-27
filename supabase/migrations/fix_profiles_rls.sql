-- Run this in Supabase SQL Editor to fix the admin portal

-- Add a permissive policy for reading profiles
CREATE POLICY "profiles_read_for_admin"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);
