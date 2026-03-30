-- Step 6: Add profile columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_listings_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unread_notifications_count int DEFAULT 0;

SELECT 'Step 6: Profile columns added' as status;
