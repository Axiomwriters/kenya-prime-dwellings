-- Add tracking columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_listings_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unread_notifications_count int DEFAULT 0;
