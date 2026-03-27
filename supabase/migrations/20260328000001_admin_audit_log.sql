-- Admin Audit Log Table
-- Tracks all admin actions for compliance and security

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_logs
CREATE POLICY "Audit logs are viewable by admins" 
  ON audit_logs FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert audit logs" 
  ON audit_logs FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, old_value, new_value)
  VALUES (p_admin_id, p_action, p_entity_type, p_entity_id, p_old_value, p_new_value);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_admin_action TO authenticated;

-- Add additional admin RLS policies for existing tables

-- RLS for profiles - Admin only can update verification status
CREATE POLICY "Admins can update profile verification" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS for agent_listings - Admin can approve/reject
CREATE POLICY "Admins can update agent listings" 
  ON agent_listings FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS for agent_verifications - Admin only can approve/reject
CREATE POLICY "Admins can update agent verifications" 
  ON agent_verifications FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to get admin dashboard stats (for real-time metrics)
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_agents BIGINT,
  pending_verifications BIGINT,
  total_listings BIGINT,
  pending_listings BIGINT,
  approved_listings BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::BIGINT FROM profiles)::BIGINT AS total_users,
    (SELECT COUNT(*)::BIGINT FROM agent_verifications WHERE status = 'approved')::BIGINT AS total_agents,
    (SELECT COUNT(*)::BIGINT FROM agent_verifications WHERE status = 'pending')::BIGINT AS pending_verifications,
    (SELECT COUNT(*)::BIGINT FROM agent_listings)::BIGINT AS total_listings,
    (SELECT COUNT(*)::BIGINT FROM agent_listings WHERE status = 'pending')::BIGINT AS pending_listings,
    (SELECT COUNT(*)::BIGINT FROM agent_listings WHERE status = 'approved')::BIGINT AS approved_listings;
END;
$$;

GRANT EXECUTE ON FUNCTION get_admin_stats TO authenticated;

-- Create trigger function to auto-log role changes
CREATE OR REPLACE FUNCTION auto_log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role <> OLD.role THEN
    PERFORM log_admin_action(
      auth.uid(),
      'role_changed',
      'user_roles',
      NEW.user_id::TEXT,
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user_roles changes
DROP TRIGGER IF EXISTS trigger_log_role_change ON user_roles;
CREATE TRIGGER trigger_log_role_change
  AFTER UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION auto_log_role_change();
