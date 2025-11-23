-- Add function for admins to assign roles (security definer)
CREATE OR REPLACE FUNCTION public.admin_assign_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Add function for admins to approve agent verification
CREATE OR REPLACE FUNCTION public.admin_approve_agent_verification(_verification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Only allow if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve verifications';
  END IF;
  
  -- Get user_id from verification
  SELECT user_id INTO _user_id
  FROM agent_verifications
  WHERE id = _verification_id;
  
  -- Update verification status
  UPDATE agent_verifications
  SET status = 'approved',
      verified_at = now(),
      verified_by = auth.uid()
  WHERE id = _verification_id;
  
  -- Assign agent role
  INSERT INTO user_roles (user_id, role)
  VALUES (_user_id, 'agent')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create notification for user
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (_user_id, 'verification_approved', 'Agent Verification Approved', 'Congratulations! Your agent verification has been approved. You can now create listings.');
END;
$$;

-- Add function for admins to reject agent verification
CREATE OR REPLACE FUNCTION public.admin_reject_agent_verification(_verification_id uuid, _reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Only allow if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject verifications';
  END IF;
  
  -- Get user_id from verification
  SELECT user_id INTO _user_id
  FROM agent_verifications
  WHERE id = _verification_id;
  
  -- Update verification status
  UPDATE agent_verifications
  SET status = 'rejected',
      rejection_reason = _reason,
      verified_by = auth.uid()
  WHERE id = _verification_id;
  
  -- Create notification for user
  INSERT INTO notifications (user_id, type, title, message)
  VALUES (_user_id, 'verification_rejected', 'Agent Verification Rejected', 'Your agent verification was not approved. Reason: ' || _reason);
END;
$$;

-- Add function for admins to approve listing
CREATE OR REPLACE FUNCTION public.admin_approve_listing(_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _agent_id uuid;
BEGIN
  -- Only allow if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve listings';
  END IF;
  
  -- Get agent_id from listing
  SELECT agent_id INTO _agent_id
  FROM agent_listings
  WHERE id = _listing_id;
  
  -- Update listing status
  UPDATE agent_listings
  SET status = 'approved',
      published_at = now()
  WHERE id = _listing_id;
  
  -- Create notification for agent
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (_agent_id, 'listing_approved', 'Listing Approved', 'Your listing has been approved and is now live!', '/agents/my-listings');
END;
$$;

-- Add function for admins to reject listing
CREATE OR REPLACE FUNCTION public.admin_reject_listing(_listing_id uuid, _reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _agent_id uuid;
BEGIN
  -- Only allow if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject listings';
  END IF;
  
  -- Get agent_id from listing
  SELECT agent_id INTO _agent_id
  FROM agent_listings
  WHERE id = _listing_id;
  
  -- Update listing status
  UPDATE agent_listings
  SET status = 'rejected',
      rejection_reason = _reason
  WHERE id = _listing_id;
  
  -- Create notification for agent
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (_agent_id, 'listing_rejected', 'Listing Rejected', 'Your listing was not approved. Reason: ' || _reason, '/agents/my-listings');
END;
$$;