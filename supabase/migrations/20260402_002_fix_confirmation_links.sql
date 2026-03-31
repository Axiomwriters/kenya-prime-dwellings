-- Migration: Fix confirmation links to support multiple environments
-- This updates the function to use a configurable base URL

-- Add site_url column to settings table if not exists (or create a simple config)
ALTER TABLE email_confirmation_sessions 
ADD COLUMN IF NOT EXISTS site_url TEXT;

-- Update the function to use environment variable or configurable URL
CREATE OR REPLACE FUNCTION create_email_confirmation_session(
  p_clerk_user_id TEXT,
  p_email TEXT,
  p_role TEXT,
  p_site_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id UUID;
  v_token TEXT;
  v_link TEXT;
  v_base_url TEXT;
BEGIN
  -- Use provided URL, environment variable, or fallback to a default
  v_base_url := COALESCE(
    p_site_url,
    COALESCE(
      (SELECT value FROM app_config WHERE key = 'site_url'),
      'https://savanah-dwelling.co.ke'
    )
  );
  
  -- Generate secure token
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Build confirmation link using the dynamic base URL
  v_link := v_base_url || '/email-confirmed?token=' || v_token;
  
  -- Insert session
  INSERT INTO email_confirmation_sessions (
    clerk_user_id,
    email,
    role,
    confirmation_token,
    confirmation_link,
    status,
    expires_at
  ) VALUES (
    p_clerk_user_id,
    p_email,
    p_role,
    v_token,
    v_link,
    'sent',
    NOW() + INTERVAL '24 hours'
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

-- Create a simple config table for site settings (if not exists)
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site URL if not exists
INSERT INTO app_config (key, value) 
VALUES ('site_url', 'https://savanah-dwelling.co.ke')
ON CONFLICT (key) DO NOTHING;

-- Allow authenticated users to read config (drop first if exists to avoid errors)
DROP POLICY IF EXISTS "Authenticated users can read app config" ON app_config;
CREATE POLICY "Authenticated users can read app config"
ON app_config FOR SELECT
TO authenticated
USING (true);

-- Function to update site URL
CREATE OR REPLACE FUNCTION set_site_url(p_url TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO app_config (key, value) 
  VALUES ('site_url', p_url)
  ON CONFLICT (key) DO UPDATE SET value = p_url, updated_at = NOW();
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION set_site_url(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION create_email_confirmation_session(TEXT, TEXT, TEXT, TEXT) TO service_role;
