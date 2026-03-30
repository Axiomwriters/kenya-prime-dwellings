-- Create Row Level Security policies for agent_listings
-- Only create if table and required columns exist

DO $$
DECLARE
    tbl_exists boolean;
    col_exists boolean;
BEGIN
    -- Check if table exists
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') INTO tbl_exists;
    
    IF NOT tbl_exists THEN
        RAISE NOTICE 'Table agent_listings does not exist. Skipping policies.';
        RETURN;
    END IF;
    
    -- Check if agent_id column exists
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'agent_id') INTO col_exists;
    
    IF NOT col_exists THEN
        RAISE NOTICE 'Column agent_id does not exist. Skipping policies.';
        RETURN;
    END IF;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Agents can view own listings" ON agent_listings;
    DROP POLICY IF EXISTS "Agents can insert own listings" ON agent_listings;
    DROP POLICY IF EXISTS "Agents can update own listings" ON agent_listings;
    DROP POLICY IF EXISTS "Agents can delete own listings" ON agent_listings;
    DROP POLICY IF EXISTS "Public can view approved listings" ON agent_listings;

    -- Create policies
    CREATE POLICY "Agents can view own listings" ON agent_listings FOR SELECT USING (auth.uid() = agent_id);
    CREATE POLICY "Agents can insert own listings" ON agent_listings FOR INSERT WITH CHECK (auth.uid() = agent_id);
    CREATE POLICY "Agents can update own listings" ON agent_listings FOR UPDATE USING (auth.uid() = agent_id);
    CREATE POLICY "Agents can delete own listings" ON agent_listings FOR DELETE USING (auth.uid() = agent_id);
    
    -- Only create public policy if status column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agent_listings' AND column_name = 'status') THEN
        CREATE POLICY "Public can view approved listings" ON agent_listings FOR SELECT USING (status = 'approved');
    END IF;
    
    RAISE NOTICE 'Policies created successfully';
END $$;
