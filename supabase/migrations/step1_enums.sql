-- Step 1: Create enum types
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

SELECT 'Step 1: Enum types created' as status;
