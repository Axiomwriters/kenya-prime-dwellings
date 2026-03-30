-- Create trigger to auto-set listing expiry date
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

DROP TRIGGER IF EXISTS set_listing_expiry_trigger ON agent_listings;

CREATE TRIGGER set_listing_expiry_trigger
    BEFORE INSERT ON agent_listings
    FOR EACH ROW
    EXECUTE FUNCTION set_listing_expiry();
