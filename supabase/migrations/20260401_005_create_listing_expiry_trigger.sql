-- Create trigger to auto-set listing expiry date
-- Handle case where function or trigger already exists

-- Drop trigger if exists
DROP TRIGGER IF EXISTS set_listing_expiry_trigger ON agent_listings;

-- Drop function if exists (with CASCADE to handle dependencies)
DROP FUNCTION IF EXISTS set_listing_expiry() CASCADE;

-- Create the function
CREATE FUNCTION set_listing_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at IS NULL THEN
        NEW.expires_at := NOW() + INTERVAL '90 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER set_listing_expiry_trigger
    BEFORE INSERT ON agent_listings
    FOR EACH ROW
    EXECUTE FUNCTION set_listing_expiry();
