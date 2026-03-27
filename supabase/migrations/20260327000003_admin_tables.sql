-- Admin Users and Role Management

-- Create admin_users table for storing admin credentials
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table for RBAC
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent', 'landlord', 'agency', 'host', 'tenant', 'professional')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create verification_sessions table
CREATE TABLE IF NOT EXISTS verification_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  documents JSONB DEFAULT '{}',
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create viewings table
CREATE TABLE IF NOT EXISTS viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  property_id UUID,
  property_title TEXT,
  viewing_date DATE NOT NULL,
  viewing_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add verification_status to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_status') THEN
    ALTER TABLE profiles ADD COLUMN verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected'));
  END IF;
END $$;

-- Add verification_documents to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verification_documents') THEN
    ALTER TABLE profiles ADD COLUMN verification_documents JSONB DEFAULT '{}';
  END IF;
END $$;

-- Insert sample admin user (password should be set via Supabase Auth)
INSERT INTO admin_users (email, full_name) VALUES 
  ('admin@savanahdwelling.com', 'Super Admin')
ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users are viewable by authenticated users" 
  ON admin_users FOR SELECT 
  TO authenticated 
  USING (true);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by authenticated users" 
  ON user_roles FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can manage user roles" 
  ON user_roles FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for verification_sessions
CREATE POLICY "Verification sessions are viewable by authenticated users" 
  ON verification_sessions FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can manage verification sessions" 
  ON verification_sessions FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for viewings
CREATE POLICY "Viewings are viewable by authenticated users" 
  ON viewings FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins and agents can manage viewings" 
  ON viewings FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Allow public read access to profiles for admin portal
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  TO authenticated, anon 
  USING (true);

-- Allow updates to profiles by authenticated users
CREATE POLICY "Profiles are updatable by authenticated users" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (true);
