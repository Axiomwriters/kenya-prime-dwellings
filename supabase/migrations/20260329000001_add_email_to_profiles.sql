-- Add email column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx
  ON public.profiles (email);
