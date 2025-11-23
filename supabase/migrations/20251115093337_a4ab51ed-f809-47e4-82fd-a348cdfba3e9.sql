-- Allow public to view agent profiles
CREATE POLICY "Public can view agent profiles"
ON profiles FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = profiles.id
    AND user_roles.role = 'agent'
  )
);