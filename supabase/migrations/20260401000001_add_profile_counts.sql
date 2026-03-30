-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_listings_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unread_notifications_count int DEFAULT 0;

-- Create function to update profile counts when listings change
DROP FUNCTION IF EXISTS update_profile_listing_count();

CREATE FUNCTION update_profile_listing_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET pending_listings_count = (
        SELECT COUNT(*) FROM agent_listings 
        WHERE agent_id = NEW.agent_id AND status = 'pending'
    )
    WHERE id = NEW.agent_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update counts
DROP TRIGGER IF EXISTS trigger_update_profile_listing_count ON agent_listings;

CREATE TRIGGER trigger_update_profile_listing_count
    AFTER INSERT OR UPDATE OR DELETE ON agent_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_listing_count();
