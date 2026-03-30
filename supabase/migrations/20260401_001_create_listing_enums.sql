-- Create agent_listings table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'agent_listings') THEN
        -- Create enum types first
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
            CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_category') THEN
            CREATE TYPE property_category AS ENUM ('house', 'apartment', 'land', 'commercial', 'villa', 'bungalow');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_type') THEN
            CREATE TYPE listing_type AS ENUM ('sale', 'rent');
        END IF;
        
        -- Create table
        CREATE TABLE public.agent_listings (
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
        
        ALTER TABLE public.agent_listings ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Table agent_listings created successfully';
    ELSE
        RAISE NOTICE 'Table agent_listings already exists';
    END IF;
END $$;
