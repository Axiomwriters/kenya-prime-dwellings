-- Email Confirmation Sessions table
-- Tracks branded email confirmations for agent/host/professional sign-ups

CREATE TABLE IF NOT EXISTS email_confirmation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('agent', 'host', 'professional')),
  confirmation_token TEXT NOT NULL UNIQUE,
  confirmation_link TEXT NOT NULL,
  email_sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'clicked', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up by clerk_user_id
CREATE INDEX IF NOT EXISTS idx_email_confirmation_sessions_user_id 
ON email_confirmation_sessions(clerk_user_id);

-- Index for looking up by confirmation_token
CREATE INDEX IF NOT EXISTS idx_email_confirmation_sessions_token 
ON email_confirmation_sessions(confirmation_token);

-- Index for admin queries by status
CREATE INDEX IF NOT EXISTS idx_email_confirmation_sessions_status 
ON email_confirmation_sessions(status);

-- Index for admin queries by role
CREATE INDEX IF NOT EXISTS idx_email_confirmation_sessions_role 
ON email_confirmation_sessions(role);

-- RLS (Row Level Security)
ALTER TABLE email_confirmation_sessions ENABLE ROW LEVEL SECURITY;

-- Admins can view all
CREATE POLICY "Admins can view all email confirmations"
ON email_confirmation_sessions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.clerk_user_id = auth.jwt()->>'sub'
    AND p.role = 'admin'
  )
);

-- Service role can do everything
CREATE POLICY "Service role can do everything"
ON email_confirmation_sessions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to create confirmation session
CREATE OR REPLACE FUNCTION create_email_confirmation_session(
  p_clerk_user_id TEXT,
  p_email TEXT,
  p_role TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id UUID;
  v_token TEXT;
  v_link TEXT;
BEGIN
  -- Generate secure token
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Build confirmation link
  v_link := 'https://savanah-dwelling.co.ke/email-confirmed?token=' || v_token;
  
  -- Insert session
  INSERT INTO email_confirmation_sessions (
    clerk_user_id,
    email,
    role,
    confirmation_token,
    confirmation_link,
    expires_at
  ) VALUES (
    p_clerk_user_id,
    p_email,
    p_role,
    v_token,
    v_link,
    NOW() + INTERVAL '24 hours'
  )
  RETURNING id INTO v_session_id;
  
  RETURN v_session_id;
END;
$$;

-- Function to mark session as clicked
CREATE OR REPLACE FUNCTION mark_confirmation_clicked(p_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id UUID;
BEGIN
  UPDATE email_confirmation_sessions
  SET 
    status = 'clicked',
    clicked_at = NOW(),
    updated_at = NOW()
  WHERE confirmation_token = p_token
    AND status != 'clicked'
    AND expires_at > NOW()
  RETURNING id INTO v_session_id;
  
  RETURN v_session_id;
END;
$$;

-- Function to get session by token
CREATE OR REPLACE FUNCTION get_confirmation_by_token(p_token TEXT)
RETURNS TABLE (
  id UUID,
  clerk_user_id TEXT,
  email TEXT,
  role TEXT,
  status TEXT,
  expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ecs.id,
    ecs.clerk_user_id,
    ecs.email,
    ecs.role,
    ecs.status,
    ecs.expires_at
  FROM email_confirmation_sessions ecs
  WHERE ecs.confirmation_token = p_token;
END;
$$;

-- Add clerk_user_id to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'clerk_user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN clerk_user_id TEXT;
  END IF;
EXCEPTION
  WHEN duplicate_column THEN
    NULL;
END
$$;

-- Add unique index for clerk_user_id if not exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_clerk_user_id 
ON public.profiles(clerk_user_id);
