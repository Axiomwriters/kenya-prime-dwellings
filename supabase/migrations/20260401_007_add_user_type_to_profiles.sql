-- Add user_type column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'individual';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
