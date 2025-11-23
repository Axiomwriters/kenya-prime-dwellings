-- Create role enum
CREATE TYPE public.app_role AS ENUM ('user', 'agent', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  whatsapp text,
  avatar_url text,
  bio text,
  county text,
  city text,
  town text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create verification status enum
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Create agent_verifications table
CREATE TABLE public.agent_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  id_front_url text,
  id_back_url text,
  status verification_status default 'pending',
  rejection_reason text,
  verified_at timestamptz,
  submitted_at timestamptz default now(),
  verified_by uuid references auth.users(id)
);

ALTER TABLE public.agent_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verification"
  ON agent_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification"
  ON agent_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verification"
  ON agent_verifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications"
  ON agent_verifications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update verifications"
  ON agent_verifications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create listing status and category enums
CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
CREATE TYPE property_category AS ENUM ('house', 'apartment', 'land', 'commercial', 'villa', 'bungalow');
CREATE TYPE listing_type AS ENUM ('sale', 'rent');

-- Create agent_listings table
CREATE TABLE public.agent_listings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category property_category not null,
  listing_type listing_type not null,
  price numeric not null,
  location text not null,
  county text,
  city text,
  bedrooms int,
  bathrooms int,
  land_size text,
  amenities jsonb,
  images text[],
  status listing_status default 'draft',
  rejection_reason text,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

ALTER TABLE public.agent_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view own listings"
  ON agent_listings FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can insert own listings"
  ON agent_listings FOR INSERT
  WITH CHECK (auth.uid() = agent_id AND public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Agents can update own listings"
  ON agent_listings FOR UPDATE
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete own listings"
  ON agent_listings FOR DELETE
  USING (auth.uid() = agent_id);

CREATE POLICY "Public can view approved listings"
  ON agent_listings FOR SELECT
  USING (status = 'approved');

-- Create notification type enum
CREATE TYPE notification_type AS ENUM (
  'listing_approved', 
  'listing_rejected', 
  'verification_approved', 
  'verification_rejected',
  'new_message',
  'system_announcement'
);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type notification_type not null,
  title text not null,
  message text not null,
  read boolean default false,
  link text,
  created_at timestamptz default now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('id-documents', 'id-documents', false),
  ('property-images', 'property-images', true);

-- Avatar storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ID documents storage policies
CREATE POLICY "Users can view own ID documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'id-documents' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Users can upload own ID documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'id-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Property images storage policies
CREATE POLICY "Property images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Agents can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images' 
    AND public.has_role(auth.uid(), 'agent')
  );

CREATE POLICY "Agents can delete property images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images' 
    AND public.has_role(auth.uid(), 'agent')
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_listings_updated_at
  BEFORE UPDATE ON public.agent_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();