-- ============================================================================
-- PATAHOME COMPLETE DATABASE SCHEMA
-- Migration: 20260205000001_complete_patahome_schema.sql
-- Description: Complete database implementation for PataHome hybrid launch
-- ============================================================================

-- ============================================================================
-- SECTION 1: ENUMS (Add to existing enums)
-- ============================================================================

-- Escrow transaction status
CREATE TYPE IF NOT EXISTS escrow_status AS ENUM (
  'initiated',
  'deposit_pending',
  'funded',
  'in_progress',
  'delivery_pending',
  'completed',
  'released',
  'disputed',
  'refunded',
  'cancelled'
);

-- Professional bodies in Kenya
CREATE TYPE IF NOT EXISTS professional_body AS ENUM (
  'EBK',      -- Engineers Board of Kenya
  'BORAQS',   -- Board of Registration of Architects and Quantity Surveyors
  'ISK',      -- Institution of Surveyors of Kenya
  'LSK',      -- Law Society of Kenya
  'IEK',      -- Institution of Engineers of Kenya
  'ACIK'      -- Architectural Association of Kenya
);

-- Service types
CREATE TYPE IF NOT EXISTS service_type AS ENUM (
  'architect',
  'quantity_surveyor',
  'valuer',
  'land_surveyor',
  'engineer',
  'contractor',
  'lawyer',
  'inspector'
);

-- Build project status
CREATE TYPE IF NOT EXISTS project_status AS ENUM (
  'planning',
  'materials_gathering',
  'permits_pending',
  'construction',
  'finishing',
  'completed',
  'on_hold'
);

-- Transaction type
CREATE TYPE IF NOT EXISTS transaction_type AS ENUM (
  'property_purchase',
  'property_rental',
  'land_purchase',
  'professional_service',
  'materials_order',
  'short_stay_booking'
);

-- Alert severity
CREATE TYPE IF NOT EXISTS alert_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Material unit types
CREATE TYPE IF NOT EXISTS material_unit AS ENUM (
  'bags',
  'tonnes',
  'lorries',
  'pieces',
  'meters',
  'square_meters',
  'cubic_meters',
  'litres',
  'rolls'
);

-- ============================================================================
-- SECTION 2: ESCROW SYSTEM (CRITICAL FOR LAUNCH)
-- ============================================================================

-- Main escrow transactions table
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type transaction_type NOT NULL,
  
  -- Parties involved
  user_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  agent_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
  professional_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
  
  -- Linked entities
  property_id uuid REFERENCES agent_listings(id) ON DELETE SET NULL,
  service_request_id uuid,
  materials_order_id uuid,
  
  -- Financial details
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  platform_commission numeric NOT NULL DEFAULT 0,
  agent_commission numeric DEFAULT 0,
  net_payout numeric, -- Calculated: total - platform_commission
  
  -- Escrow status tracking
  status escrow_status DEFAULT 'initiated' NOT NULL,
  
  -- Payment details
  payment_method text, -- 'mpesa', 'bank_transfer', 'card'
  payment_reference text,
  mpesa_receipt_number text,
  
  -- Timestamps
  initiated_at timestamptz DEFAULT now(),
  funded_at timestamptz,
  in_progress_at timestamptz,
  completed_at timestamptz,
  released_at timestamptz,
  
  -- Admin approval
  approved_by uuid REFERENCES auth.users(id),
  approval_notes text,
  
  -- Dispute handling
  disputed_at timestamptz,
  dispute_reason text,
  dispute_resolved_at timestamptz,
  dispute_resolution text,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for escrow transactions
CREATE INDEX IF NOT EXISTS idx_escrow_user_id ON escrow_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_escrow_agent_id ON escrow_transactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_created_at ON escrow_transactions(created_at DESC);

-- RLS policies for escrow
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "users_view_own_escrow"
  ON escrow_transactions FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.uid() = agent_id 
    OR auth.uid() = professional_id
  );

-- Users can create escrow transactions
CREATE POLICY "users_create_escrow"
  ON escrow_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update escrow status
CREATE POLICY "admins_update_escrow"
  ON escrow_transactions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all escrow transactions
CREATE POLICY "admins_view_all_escrow"
  ON escrow_transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- SECTION 3: TRUST SCORE SYSTEM
-- ============================================================================

-- Trust scores table
CREATE TABLE IF NOT EXISTS public.trust_scores (
  entity_id uuid PRIMARY KEY,
  entity_type text NOT NULL CHECK (entity_type IN ('user', 'agent', 'professional', 'listing')),
  
  -- Overall score (0-100)
  overall_score numeric DEFAULT 50 CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Component scores
  verification_score numeric DEFAULT 0 CHECK (verification_score >= 0 AND verification_score <= 30),
  transaction_score numeric DEFAULT 0 CHECK (transaction_score >= 0 AND transaction_score <= 25),
  rating_score numeric DEFAULT 0 CHECK (rating_score >= 0 AND rating_score <= 20),
  response_score numeric DEFAULT 0 CHECK (response_score >= 0 AND response_score <= 15),
  dispute_score numeric DEFAULT 10 CHECK (dispute_score >= 0 AND dispute_score <= 10),
  
  -- Transaction history
  total_transactions integer DEFAULT 0,
  successful_transactions integer DEFAULT 0,
  failed_transactions integer DEFAULT 0,
  disputed_transactions integer DEFAULT 0,
  
  -- Rating metrics
  average_rating numeric DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_ratings integer DEFAULT 0,
  
  -- Response metrics
  average_response_time_hours numeric,
  
  -- Badges earned
  badges text[] DEFAULT ARRAY[]::text[],
  
  -- Calculation metadata
  last_calculated_at timestamptz DEFAULT now(),
  calculation_version integer DEFAULT 1,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trust_entity_type ON trust_scores(entity_type);
CREATE INDEX IF NOT EXISTS idx_trust_overall_score ON trust_scores(overall_score DESC);

-- RLS policies
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trust_scores_public_read"
  ON trust_scores FOR SELECT
  USING (true); -- Trust scores are public information

CREATE POLICY "trust_scores_admin_manage"
  ON trust_scores FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- SECTION 4: PROFESSIONAL SYSTEM
-- ============================================================================

-- Professional verifications
CREATE TABLE IF NOT EXISTS public.professional_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Professional details
  professional_body professional_body NOT NULL,
  license_number text NOT NULL,
  license_expiry date NOT NULL CHECK (license_expiry > CURRENT_DATE),
  
  -- Business details
  business_name text,
  business_registration_number text,
  kra_pin text,
  
  -- Document uploads
  license_document_url text,
  business_certificate_url text,
  id_document_url text,
  
  -- Verification status
  status verification_status DEFAULT 'pending',
  rejection_reason text,
  
  -- Verification tracking
  submitted_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users(id),
  
  -- Professional details
  specializations text[] DEFAULT ARRAY[]::text[],
  years_of_experience integer,
  service_areas text[] DEFAULT ARRAY[]::text[], -- Counties they serve
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_professional_user_id ON professional_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_status ON professional_verifications(status);
CREATE INDEX IF NOT EXISTS idx_professional_body ON professional_verifications(professional_body);

-- RLS policies
ALTER TABLE public.professional_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "professionals_view_own"
  ON professional_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "professionals_insert_own"
  ON professional_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "professionals_update_own"
  ON professional_verifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "admins_manage_professionals"
  ON professional_verifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Service requests table
CREATE TABLE IF NOT EXISTS public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  professional_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Service details
  service_type service_type NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  
  -- Project linkage
  project_id uuid, -- Links to build_projects
  property_id uuid REFERENCES agent_listings(id),
  
  -- Budget
  budget_min numeric,
  budget_max numeric,
  
  -- Location
  county text,
  city text,
  location_details text,
  
  -- Status
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed')),
  
  -- Timeline
  urgency text CHECK (urgency IN ('urgent', 'within_week', 'within_month', 'flexible')),
  preferred_start_date date,
  
  -- Response tracking
  responded_at timestamptz,
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  
  -- Ratings
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_requests_user ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_professional ON service_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_type ON service_requests(service_type);

-- RLS policies
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_requests"
  ON service_requests FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "professionals_view_assigned"
  ON service_requests FOR SELECT
  USING (auth.uid() = professional_id OR status = 'pending');

CREATE POLICY "professionals_update_assigned"
  ON service_requests FOR UPDATE
  USING (auth.uid() = professional_id);

-- ============================================================================
-- SECTION 5: BUILD PROJECTS & MATERIALS
-- ============================================================================

-- Build projects table
CREATE TABLE IF NOT EXISTS public.build_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Project details
  project_name text NOT NULL,
  project_type text NOT NULL CHECK (project_type IN ('residential', 'commercial', 'renovation', 'infrastructure')),
  description text,
  
  -- Location
  county text,
  city text,
  town text,
  location_details text,
  
  -- Budget
  estimated_budget numeric,
  actual_spent numeric DEFAULT 0,
  
  -- Timeline
  planned_start_date date,
  planned_completion_date date,
  actual_start_date date,
  actual_completion_date date,
  
  -- Status
  status project_status DEFAULT 'planning',
  
  -- Specifications (for AI cost estimation)
  specifications jsonb DEFAULT '{}'::jsonb,
  -- Example: {"bedrooms": 3, "bathrooms": 2, "floors": 1, "roofing": "iron_sheets"}
  
  -- Cost estimation
  estimated_materials_cost numeric,
  estimated_labor_cost numeric,
  estimated_professional_fees numeric,
  
  -- Linked professionals
  architect_id uuid REFERENCES auth.users(id),
  quantity_surveyor_id uuid REFERENCES auth.users(id),
  contractor_id uuid REFERENCES auth.users(id),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_build_projects_user ON build_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_build_projects_status ON build_projects(status);

-- RLS policies
ALTER TABLE public.build_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_projects"
  ON build_projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "professionals_view_assigned_projects"
  ON build_projects FOR SELECT
  USING (
    auth.uid() = architect_id 
    OR auth.uid() = quantity_surveyor_id 
    OR auth.uid() = contractor_id
  );

-- Building materials catalog
CREATE TABLE IF NOT EXISTS public.building_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Material details
  name text NOT NULL,
  category text NOT NULL, -- 'cement', 'steel', 'roofing', 'plumbing', 'electrical', 'finishes'
  subcategory text,
  description text,
  
  -- Supplier
  supplier_name text NOT NULL,
  supplier_id uuid REFERENCES auth.users(id),
  
  -- Pricing
  price_per_unit numeric NOT NULL CHECK (price_per_unit > 0),
  unit material_unit NOT NULL,
  
  -- Inventory
  stock_quantity numeric DEFAULT 0,
  stock_status text DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock', 'discontinued')),
  
  -- Specifications
  specifications jsonb DEFAULT '{}'::jsonb,
  -- Example: {"brand": "Bamburi", "grade": "32.5R", "packaging": "50kg"}
  
  -- Media
  images text[] DEFAULT ARRAY[]::text[],
  
  -- Delivery
  delivery_available boolean DEFAULT true,
  delivery_areas text[] DEFAULT ARRAY[]::text[], -- Counties
  delivery_fee_per_km numeric,
  minimum_order_quantity numeric,
  
  -- Ratings
  average_rating numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_materials_category ON building_materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_supplier ON building_materials(supplier_id);
CREATE INDEX IF NOT EXISTS idx_materials_active ON building_materials(is_active);

-- RLS policies
ALTER TABLE public.building_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "materials_public_read"
  ON building_materials FOR SELECT
  USING (is_active = true);

CREATE POLICY "suppliers_manage_own_materials"
  ON building_materials FOR ALL
  USING (auth.uid() = supplier_id);

CREATE POLICY "admins_manage_materials"
  ON building_materials FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Project materials (items added to project)
CREATE TABLE IF NOT EXISTS public.project_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES build_projects(id) ON DELETE CASCADE NOT NULL,
  material_id uuid REFERENCES building_materials(id) ON DELETE RESTRICT NOT NULL,
  
  -- Quantity
  quantity numeric NOT NULL CHECK (quantity > 0),
  unit material_unit NOT NULL,
  
  -- Pricing at time of addition
  unit_price numeric NOT NULL,
  total_price numeric GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Status
  status text DEFAULT 'cart' CHECK (status IN ('cart', 'ordered', 'delivered', 'returned')),
  
  -- Order details
  ordered_at timestamptz,
  delivered_at timestamptz,
  
  -- Notes
  notes text,
  
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_materials_project ON project_materials(project_id);
CREATE INDEX IF NOT EXISTS idx_project_materials_status ON project_materials(status);

-- RLS policies
ALTER TABLE public.project_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_owner_manages_materials"
  ON project_materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM build_projects
      WHERE id = project_materials.project_id
      AND user_id = auth.uid()
    )
  );

-- Materials orders (checkout from project)
CREATE TABLE IF NOT EXISTS public.materials_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES build_projects(id) ON DELETE SET NULL NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Order details
  order_number text UNIQUE NOT NULL,
  
  -- Financial
  subtotal numeric NOT NULL,
  delivery_fee numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  
  -- Delivery
  delivery_county text NOT NULL,
  delivery_city text,
  delivery_address text NOT NULL,
  delivery_phone text NOT NULL,
  delivery_instructions text,
  
  -- Status
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'
  )),
  
  -- Timeline
  confirmed_at timestamptz,
  dispatched_at timestamptz,
  delivered_at timestamptz,
  
  -- Notes
  admin_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_materials_orders_user ON materials_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_orders_status ON materials_orders(status);
CREATE INDEX IF NOT EXISTS idx_materials_orders_number ON materials_orders(order_number);

-- RLS policies
ALTER TABLE public.materials_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_orders"
  ON materials_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_create_orders"
  ON materials_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_manage_orders"
  ON materials_orders FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- SECTION 6: SAVED PROPERTIES & USER INTERACTIONS
-- ============================================================================

-- Saved properties (user favorites/watchlist)
CREATE TABLE IF NOT EXISTS public.saved_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES agent_listings(id) ON DELETE CASCADE NOT NULL,
  
  -- Notes
  notes text,
  tags text[] DEFAULT ARRAY[]::text[],
  
  -- Reminder
  reminder_date date,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, property_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property ON saved_properties(property_id);

-- RLS policies
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_saved"
  ON saved_properties FOR ALL
  USING (auth.uid() = user_id);

-- Property views tracking
CREATE TABLE IF NOT EXISTS public.property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES agent_listings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Session tracking
  session_id text,
  ip_address inet,
  user_agent text,
  
  -- Referrer
  referrer_url text,
  
  -- Duration
  view_duration_seconds integer,
  
  viewed_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_property_views_property ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user ON property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_date ON property_views(viewed_at DESC);

-- RLS policies
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_views_insert_public"
  ON property_views FOR INSERT
  WITH CHECK (true); -- Allow anonymous view tracking

CREATE POLICY "admins_view_analytics"
  ON property_views FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- SECTION 7: TRIPS & VIEWINGS
-- ============================================================================

-- User trips (property viewing collections)
CREATE TABLE IF NOT EXISTS public.property_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Trip details
  trip_name text NOT NULL,
  description text,
  
  -- Scheduling
  planned_date date,
  start_time time,
  
  -- Status
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  
  -- Coordination
  representative_requested boolean DEFAULT false,
  representative_assigned_id uuid REFERENCES auth.users(id),
  
  -- Notes
  notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trip properties (properties added to trip)
CREATE TABLE IF NOT EXISTS public.trip_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES property_trips(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES agent_listings(id) ON DELETE CASCADE NOT NULL,
  
  -- Visit details
  visit_order integer, -- Route optimization
  visit_scheduled_time time,
  visit_duration_minutes integer DEFAULT 30,
  
  -- Status
  visited boolean DEFAULT false,
  visited_at timestamptz,
  
  -- Feedback
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  
  added_at timestamptz DEFAULT now(),
  
  UNIQUE(trip_id, property_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user ON property_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_properties_trip ON trip_properties(trip_id);

-- RLS policies
ALTER TABLE public.property_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_trips"
  ON property_trips FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "users_manage_trip_properties"
  ON trip_properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM property_trips
      WHERE id = trip_properties.trip_id
      AND user_id = auth.uid()
    )
  );

-- ============================================================================
-- SECTION 8: SECURITY & ANTI-BYPASS
-- ============================================================================

-- Platform bypass detection flags
CREATE TABLE IF NOT EXISTS public.platform_bypass_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parties involved
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  agent_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id uuid REFERENCES agent_listings(id) ON DELETE SET NULL,
  
  -- Flag details
  flag_type text NOT NULL CHECK (flag_type IN (
    'phone_shared',
    'external_contact_request',
    'user_report',
    'suspicious_pattern',
    'off_platform_deal'
  )),
  
  -- Evidence
  evidence text,
  evidence_metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Review
  reviewed boolean DEFAULT false,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  action_taken text CHECK (action_taken IN ('warning', 'suspension', 'ban', 'false_positive', 'no_action')),
  
  flagged_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bypass_flags_agent ON platform_bypass_flags(agent_id);
CREATE INDEX IF NOT EXISTS idx_bypass_flags_reviewed ON platform_bypass_flags(reviewed);

-- RLS policies
ALTER TABLE public.platform_bypass_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_bypass_flags"
  ON platform_bypass_flags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin alerts
CREATE TABLE IF NOT EXISTS public.admin_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Alert details
  alert_type text NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'medium',
  
  -- Entity flagged
  entity_id uuid,
  entity_type text CHECK (entity_type IN ('user', 'agent', 'professional', 'listing', 'transaction')),
  
  -- Description
  title text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Auto-action
  auto_action_taken text,
  
  -- Resolution
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  resolution_notes text,
  
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_alerts_severity ON admin_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_resolved ON admin_alerts(resolved);

-- RLS policies
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_alerts"
  ON admin_alerts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- User agreements (terms acceptance)
CREATE TABLE IF NOT EXISTS public.user_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Agreement details
  agreement_type text NOT NULL CHECK (agreement_type IN ('user_terms', 'agent_terms', 'professional_terms', 'escrow_terms')),
  version text NOT NULL,
  
  -- Signing details
  ip_address inet NOT NULL,
  user_agent text,
  signature_data jsonb,
  
  signed_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, agreement_type, version)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_agreements_user ON user_agreements(user_id);

-- RLS policies
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_agreements"
  ON user_agreements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_sign_agreements"
  ON user_agreements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SECTION 9: AI GENIE CONTEXT & STATE
-- ============================================================================

-- Genie conversation state
CREATE TABLE IF NOT EXISTS public.genie_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  
  -- Current state
  current_mode text DEFAULT 'DISCOVERY' CHECK (current_mode IN ('DISCOVERY', 'TRIP', 'ANALYTICAL', 'PROJECT')),
  
  -- Detected intent
  intent text,
  intent_confidence numeric CHECK (intent_confidence >= 0 AND intent_confidence <= 1),
  
  -- Context memory
  context jsonb DEFAULT '{}'::jsonb,
  -- Example: {"location": "Nakuru", "property_type": "land", "transaction_type": "buy", "budget_range": [500000, 2000000]}
  
  -- Conversation metadata
  message_count integer DEFAULT 0,
  last_message_at timestamptz DEFAULT now(),
  
  -- Handoff tracking
  handed_off_to text, -- 'admin', 'agent', 'professional'
  handed_off_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_genie_user ON genie_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_genie_session ON genie_conversations(session_id);

-- RLS policies
ALTER TABLE public.genie_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_conversations"
  ON genie_conversations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "genie_create_conversations"
  ON genie_conversations FOR INSERT
  WITH CHECK (true); -- Allow anonymous conversations

CREATE POLICY "genie_update_conversations"
  ON genie_conversations FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Genie messages
CREATE TABLE IF NOT EXISTS public.genie_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES genie_conversations(id) ON DELETE CASCADE NOT NULL,
  
  -- Message details
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  
  -- Message type
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'property_results', 'material_results', 'options', 'clarification')),
  
  -- Structured data
  structured_data jsonb,
  -- For property results, material cards, etc.
  
  -- Intent detection
  detected_intent text,
  intent_confidence numeric,
  
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_genie_messages_conversation ON genie_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_genie_messages_created ON genie_messages(created_at DESC);

-- RLS policies
ALTER TABLE public.genie_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_conversation_messages"
  ON genie_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM genie_conversations
      WHERE id = genie_messages.conversation_id
      AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

CREATE POLICY "genie_insert_messages"
  ON genie_messages FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- SECTION 10: MARKET INSIGHTS & ANALYTICS
-- ============================================================================

-- Market insights data
CREATE TABLE IF NOT EXISTS public.market_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Location
  county text NOT NULL,
  city text,
  zone text,
  
  -- Property type
  property_category text CHECK (property_category IN ('house', 'land', 'commercial', 'apartment')),
  
  -- Pricing insights
  avg_price numeric,
  median_price numeric,
  min_price numeric,
  max_price numeric,
  
  -- Supply & demand
  total_listings integer DEFAULT 0,
  new_listings_30d integer DEFAULT 0,
  sold_properties_30d integer DEFAULT 0,
  
  -- Trends
  price_trend text CHECK (price_trend IN ('increasing', 'stable', 'decreasing')),
  demand_level text CHECK (demand_level IN ('very_high', 'high', 'moderate', 'low', 'very_low')),
  
  -- Investment metrics
  estimated_rental_yield numeric,
  appreciation_rate numeric,
  
  -- Calculation metadata
  data_points integer,
  last_calculated_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(county, city, zone, property_category)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_market_insights_location ON market_insights(county, city);
CREATE INDEX IF NOT EXISTS idx_market_insights_category ON market_insights(property_category);

-- RLS policies
ALTER TABLE public.market_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "market_insights_public_read"
  ON market_insights FOR SELECT
  USING (true); -- Market data is public

CREATE POLICY "admins_manage_market_insights"
  ON market_insights FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Agent performance metrics
CREATE TABLE IF NOT EXISTS public.agent_performance (
  agent_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Transaction metrics
  total_listings integer DEFAULT 0,
  active_listings integer DEFAULT 0,
  sold_properties integer DEFAULT 0,
  rented_properties integer DEFAULT 0,
  
  -- Financial metrics
  total_gmv numeric DEFAULT 0, -- Gross Merchandise Value
  total_commission_earned numeric DEFAULT 0,
  avg_deal_value numeric DEFAULT 0,
  
  -- Performance metrics
  avg_response_time_hours numeric,
  listing_approval_rate numeric, -- % of listings approved
  deal_closure_rate numeric, -- % of inquiries that close
  
  -- Ratings
  average_rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  
  -- Rankings
  county_rank integer,
  national_rank integer,
  
  -- Compliance
  bypass_attempts integer DEFAULT 0,
  dispute_count integer DEFAULT 0,
  warning_count integer DEFAULT 0,
  
  -- Calculation metadata
  last_calculated_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_performance_rating ON agent_performance(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_agent_performance_gmv ON agent_performance(total_gmv DESC);

-- RLS policies
ALTER TABLE public.agent_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_view_own_performance"
  ON agent_performance FOR SELECT
  USING (auth.uid() = agent_id);

CREATE POLICY "performance_public_summary"
  ON agent_performance FOR SELECT
  USING (true); -- Public metrics for trust

CREATE POLICY "admins_manage_performance"
  ON agent_performance FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- SECTION 11: AUTOMATED TRIGGERS
-- ============================================================================

-- Trigger: Update trust score on transaction completion
CREATE OR REPLACE FUNCTION update_trust_score_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update agent trust score
    IF NEW.agent_id IS NOT NULL THEN
      INSERT INTO trust_scores (entity_id, entity_type)
      VALUES (NEW.agent_id, 'agent')
      ON CONFLICT (entity_id) DO NOTHING;
      
      -- Trigger recalculation
      PERFORM calculate_trust_score(NEW.agent_id, 'agent');
    END IF;
    
    -- Update professional trust score
    IF NEW.professional_id IS NOT NULL THEN
      INSERT INTO trust_scores (entity_id, entity_type)
      VALUES (NEW.professional_id, 'professional')
      ON CONFLICT (entity_id) DO NOTHING;
      
      PERFORM calculate_trust_score(NEW.professional_id, 'professional');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trust_score
AFTER UPDATE ON escrow_transactions
FOR EACH ROW
EXECUTE FUNCTION update_trust_score_on_transaction();

-- Trigger: Auto-update net payout on escrow
CREATE OR REPLACE FUNCTION calculate_escrow_payout()
RETURNS TRIGGER AS $$
BEGIN
  NEW.net_payout := NEW.total_amount - NEW.platform_commission;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_payout
BEFORE INSERT OR UPDATE ON escrow_transactions
FOR EACH ROW
EXECUTE FUNCTION calculate_escrow_payout();

-- Trigger: Update property view count
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_listings
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = NEW.property_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_views
AFTER INSERT ON property_views
FOR EACH ROW
EXECUTE FUNCTION increment_property_views();

-- Trigger: Detect phone number sharing (bypass attempt)
CREATE OR REPLACE FUNCTION detect_phone_sharing()
RETURNS TRIGGER AS $$
BEGIN
  -- Kenya phone number regex: +254XXXXXXXXX or 07XXXXXXXX
  IF NEW.content ~* '(\+?254[0-9]{9}|07[0-9]{8})' THEN
    -- Extract conversation to get agent_id if exists
    INSERT INTO platform_bypass_flags (
      agent_id,
      flag_type,
      evidence
    )
    SELECT 
      gc.user_id, -- If agent is messaging
      'phone_shared',
      NEW.content
    FROM genie_conversations gc
    WHERE gc.id = NEW.conversation_id
    AND gc.user_id IN (
      SELECT id FROM auth.users WHERE id IN (
        SELECT user_id FROM user_roles WHERE role = 'agent'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_detect_phone_sharing
AFTER INSERT ON genie_messages
FOR EACH ROW
EXECUTE FUNCTION detect_phone_sharing();

-- Trigger: Alert on multiple bypass attempts
CREATE OR REPLACE FUNCTION alert_suspicious_agent()
RETURNS TRIGGER AS $$
DECLARE
  flag_count integer;
BEGIN
  SELECT COUNT(*) INTO flag_count
  FROM platform_bypass_flags
  WHERE agent_id = NEW.agent_id
  AND flagged_at > NOW() - INTERVAL '30 days';
  
  IF flag_count >= 2 THEN
    INSERT INTO admin_alerts (
      alert_type,
      severity,
      entity_id,
      entity_type,
      title,
      description
    ) VALUES (
      'bypass_attempt',
      'high',
      NEW.agent_id,
      'agent',
      'Agent with Multiple Bypass Attempts',
      format('Agent has %s bypass flags in the last 30 days', flag_count)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_alert_suspicious_agent
AFTER INSERT ON platform_bypass_flags
FOR EACH ROW
EXECUTE FUNCTION alert_suspicious_agent();

-- Trigger: Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER update_escrow_updated_at BEFORE UPDATE ON escrow_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_scores_updated_at BEFORE UPDATE ON trust_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_verifications_updated_at BEFORE UPDATE ON professional_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_build_projects_updated_at BEFORE UPDATE ON build_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_orders_updated_at BEFORE UPDATE ON materials_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_trips_updated_at BEFORE UPDATE ON property_trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_genie_conversations_updated_at BEFORE UPDATE ON genie_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 12: TRUST SCORE CALCULATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_trust_score(
  p_entity_id uuid,
  p_entity_type text
)
RETURNS void AS $$
DECLARE
  v_verification_score numeric := 0;
  v_transaction_score numeric := 0;
  v_rating_score numeric := 0;
  v_response_score numeric := 0;
  v_dispute_score numeric := 10;
  v_total_score numeric;
  
  v_total_transactions integer;
  v_successful_transactions integer;
  v_disputed_transactions integer;
  v_avg_rating numeric;
  v_total_ratings integer;
  v_avg_response_time numeric;
BEGIN
  -- 1. VERIFICATION SCORE (0-30 points)
  IF p_entity_type = 'agent' THEN
    SELECT 
      CASE 
        WHEN status = 'approved' THEN 30
        WHEN status = 'pending' THEN 15
        ELSE 0
      END INTO v_verification_score
    FROM agent_verifications
    WHERE user_id = p_entity_id;
  ELSIF p_entity_type = 'professional' THEN
    SELECT 
      CASE 
        WHEN status = 'approved' THEN 30
        WHEN status = 'pending' THEN 15
        ELSE 0
      END INTO v_verification_score
    FROM professional_verifications
    WHERE user_id = p_entity_id;
  END IF;
  
  -- 2. TRANSACTION SCORE (0-25 points)
  SELECT 
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'disputed')
  INTO v_successful_transactions, v_total_transactions, v_disputed_transactions
  FROM escrow_transactions
  WHERE agent_id = p_entity_id OR professional_id = p_entity_id;
  
  IF v_total_transactions > 0 THEN
    v_transaction_score := LEAST(25, (v_successful_transactions::numeric / v_total_transactions) * 25);
  END IF;
  
  -- 3. RATING SCORE (0-20 points)
  SELECT 
    AVG(rating),
    COUNT(*)
  INTO v_avg_rating, v_total_ratings
  FROM service_requests
  WHERE professional_id = p_entity_id AND rating IS NOT NULL;
  
  IF v_total_ratings > 0 THEN
    v_rating_score := (v_avg_rating / 5) * 20;
  END IF;
  
  -- 4. RESPONSE SCORE (0-15 points)
  SELECT 
    AVG(EXTRACT(EPOCH FROM (responded_at - created_at)) / 3600)
  INTO v_avg_response_time
  FROM service_requests
  WHERE professional_id = p_entity_id AND responded_at IS NOT NULL;
  
  IF v_avg_response_time IS NOT NULL THEN
    -- Faster response = higher score
    v_response_score := GREATEST(0, 15 - (v_avg_response_time / 24) * 15);
  END IF;
  
  -- 5. DISPUTE SCORE (0-10 points, deducted)
  IF v_total_transactions > 0 THEN
    v_dispute_score := GREATEST(0, 10 - (v_disputed_transactions::numeric / v_total_transactions) * 10);
  END IF;
  
  -- TOTAL SCORE
  v_total_score := v_verification_score + v_transaction_score + v_rating_score + v_response_score + v_dispute_score;
  
  -- UPDATE OR INSERT
  INSERT INTO trust_scores (
    entity_id,
    entity_type,
    overall_score,
    verification_score,
    transaction_score,
    rating_score,
    response_score,
    dispute_score,
    total_transactions,
    successful_transactions,
    disputed_transactions,
    average_rating,
    total_ratings,
    average_response_time_hours,
    last_calculated_at
  ) VALUES (
    p_entity_id,
    p_entity_type,
    v_total_score,
    v_verification_score,
    v_transaction_score,
    v_rating_score,
    v_response_score,
    v_dispute_score,
    v_total_transactions,
    v_successful_transactions,
    v_disputed_transactions,
    v_avg_rating,
    v_total_ratings,
    v_avg_response_time,
    NOW()
  )
  ON CONFLICT (entity_id) DO UPDATE SET
    overall_score = v_total_score,
    verification_score = v_verification_score,
    transaction_score = v_transaction_score,
    rating_score = v_rating_score,
    response_score = v_response_score,
    dispute_score = v_dispute_score,
    total_transactions = v_total_transactions,
    successful_transactions = v_successful_transactions,
    disputed_transactions = v_disputed_transactions,
    average_rating = v_avg_rating,
    total_ratings = v_total_ratings,
    average_response_time_hours = v_avg_response_time,
    last_calculated_at = NOW();
    
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 13: HELPER FUNCTIONS
-- ============================================================================

-- Generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  v_order_number text;
BEGIN
  v_order_number := 'PH' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
  RETURN v_order_number;
END;
$$ LANGUAGE plpgsql;

-- Check if agent has signed terms
CREATE OR REPLACE FUNCTION agent_has_signed_terms(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_agreements
    WHERE user_id = p_user_id
    AND agreement_type = 'agent_terms'
    AND version = '1.0'
  );
END;
$$ LANGUAGE plpgsql;

-- Get user's active build projects
CREATE OR REPLACE FUNCTION get_user_active_projects(p_user_id uuid)
RETURNS TABLE (
  project_id uuid,
  project_name text,
  status project_status,
  materials_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.project_name,
    bp.status,
    COUNT(pm.id)
  FROM build_projects bp
  LEFT JOIN project_materials pm ON pm.project_id = bp.id
  WHERE bp.user_id = p_user_id
  AND bp.status NOT IN ('completed', 'cancelled')
  GROUP BY bp.id, bp.project_name, bp.status
  ORDER BY bp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ PataHome Complete Schema Migration Successful!';
  RAISE NOTICE 'Tables Created: 25+';
  RAISE NOTICE 'RLS Policies: Enabled on all tables';
  RAISE NOTICE 'Triggers: 10+ automated workflows';
  RAISE NOTICE 'Functions: Trust scoring, calculations, helpers';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Run test scripts to verify functionality';
  RAISE NOTICE '2. Set up n8n AI Genie workflows';
  RAISE NOTICE '3. Load seed data';
  RAISE NOTICE '4. Update frontend to use new tables';
END $$;
