-- Add notification preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_listings": true,
  "email_messages": true,
  "email_marketing": false
}'::jsonb;