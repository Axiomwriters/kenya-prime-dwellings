-- Create Row Level Security policies for agent_listings (conditional)
-- Drop existing policies first if they exist
DROP POLICY IF EXISTS "Agents can view own listings" ON agent_listings;
DROP POLICY IF EXISTS "Agents can insert own listings" ON agent_listings;
DROP POLICY IF EXISTS "Agents can update own listings" ON agent_listings;
DROP POLICY IF EXISTS "Agents can delete own listings" ON agent_listings;
DROP POLICY IF EXISTS "Public can view approved listings" ON agent_listings;

-- Create new policies
CREATE POLICY "Agents can view own listings" ON agent_listings FOR SELECT USING (auth.uid() = agent_id);
CREATE POLICY "Agents can insert own listings" ON agent_listings FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can update own listings" ON agent_listings FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agents can delete own listings" ON agent_listings FOR DELETE USING (auth.uid() = agent_id);
CREATE POLICY "Public can view approved listings" ON agent_listings FOR SELECT USING (status = 'approved');
