# 🧪 PATAHOME DATABASE TEST SUITE
# Complete testing guide for all database tables and functions

## Prerequisites

```bash
# Install PostgreSQL client if not already installed
# Ubuntu/Debian:
sudo apt-get install postgresql-client

# macOS:
brew install postgresql

# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

---

## TEST 1: ESCROW TRANSACTIONS SYSTEM ✅

### Test Scenario: Complete Property Purchase Flow

```sql
-- Step 1: Create test users (if not exists)
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'buyer@test.com'),
  ('22222222-2222-2222-2222-222222222222', 'agent@test.com'),
  ('33333333-3333-3333-3333-333333333333', 'admin@test.com')
ON CONFLICT DO NOTHING;

-- Step 2: Assign roles
INSERT INTO user_roles (user_id, role) VALUES
  ('22222222-2222-2222-2222-222222222222', 'agent'),
  ('33333333-3333-3333-3333-333333333333', 'admin')
ON CONFLICT DO NOTHING;

-- Step 3: Create test property listing
INSERT INTO agent_listings (
  id,
  agent_id,
  title,
  description,
  category,
  listing_type,
  location,
  price,
  status
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  '22222222-2222-2222-2222-222222222222',
  'Test Property - 3BR House Milimani',
  'Beautiful test property for escrow testing',
  'house',
  'sale',
  'Milimani, Nakuru',
  5000000,
  'approved'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title;

-- Step 4: Create escrow transaction
INSERT INTO escrow_transactions (
  id,
  transaction_type,
  user_id,
  agent_id,
  property_id,
  total_amount,
  platform_commission,
  payment_method,
  payment_reference,
  status
) VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'property_purchase',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '99999999-9999-9999-9999-999999999999',
  5000000,
  1250000, -- 25% platform commission
  'mpesa',
  'TEST123456',
  'initiated'
);

-- Step 5: Verify net_payout was auto-calculated
SELECT 
  id,
  total_amount,
  platform_commission,
  net_payout,
  status
FROM escrow_transactions
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

-- Expected: net_payout should be 3,750,000 (5M - 1.25M)

-- Step 6: Simulate escrow status progression
UPDATE escrow_transactions
SET 
  status = 'funded',
  funded_at = NOW()
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

UPDATE escrow_transactions
SET 
  status = 'in_progress',
  in_progress_at = NOW()
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

UPDATE escrow_transactions
SET 
  status = 'completed',
  completed_at = NOW()
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

-- Step 7: Admin approves release
UPDATE escrow_transactions
SET 
  status = 'released',
  released_at = NOW(),
  approved_by = '33333333-3333-3333-3333-333333333333',
  approval_notes = 'Property transfer confirmed'
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

-- Step 8: Verify final state
SELECT 
  transaction_type,
  total_amount,
  platform_commission,
  net_payout,
  status,
  funded_at IS NOT NULL as was_funded,
  released_at IS NOT NULL as was_released,
  approved_by IS NOT NULL as admin_approved
FROM escrow_transactions
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

-- ✅ TEST PASSES IF:
-- 1. net_payout = 3,750,000
-- 2. status = 'released'
-- 3. All timestamp fields populated
-- 4. approved_by = admin UUID
```

### Test RLS Policies

```sql
-- Test: User can view their own escrow
SET LOCAL role = 'authenticated';
SET LOCAL request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT * FROM escrow_transactions
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Should return the escrow transaction

-- Test: User cannot view other's escrow
SELECT * FROM escrow_transactions
WHERE user_id != '11111111-1111-1111-1111-111111111111';

-- Should return empty

-- Test: Admin can view all
SET LOCAL request.jwt.claims = '{"sub": "33333333-3333-3333-3333-333333333333"}';

SELECT COUNT(*) FROM escrow_transactions;

-- Should return all escrow records
```

---

## TEST 2: TRUST SCORE SYSTEM ✅

```sql
-- Step 1: Create agent verification
INSERT INTO agent_verifications (
  user_id,
  id_front_url,
  id_back_url,
  status
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'https://example.com/id_front.jpg',
  'https://example.com/id_back.jpg',
  'approved'
)
ON CONFLICT (user_id) DO UPDATE SET
  status = 'approved';

-- Step 2: Calculate initial trust score
SELECT calculate_trust_score(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'agent'
);

-- Step 3: View trust score
SELECT 
  entity_id,
  entity_type,
  overall_score,
  verification_score,
  transaction_score,
  rating_score,
  response_score,
  dispute_score,
  total_transactions,
  successful_transactions
FROM trust_scores
WHERE entity_id = '22222222-2222-2222-2222-222222222222';

-- Expected: 
-- overall_score ~= 30-40 (new agent with verification)
-- verification_score = 30 (approved)
-- transaction_score = 0 (no transactions yet)

-- Step 4: Simulate completed transaction (should trigger auto-update)
-- (Already done in escrow test - trust score should auto-update)

-- Step 5: Recalculate after transaction
SELECT calculate_trust_score(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'agent'
);

-- Step 6: Verify score increased
SELECT 
  overall_score,
  transaction_score,
  total_transactions,
  successful_transactions
FROM trust_scores
WHERE entity_id = '22222222-2222-2222-2222-222222222222';

-- ✅ TEST PASSES IF:
-- 1. overall_score increased from previous
-- 2. transaction_score > 0
-- 3. total_transactions = 1
-- 4. successful_transactions = 1
```

---

## TEST 3: PROFESSIONAL VERIFICATION SYSTEM ✅

```sql
-- Step 1: Create professional user
INSERT INTO auth.users (id, email) VALUES
  ('44444444-4444-4444-4444-444444444444', 'architect@test.com')
ON CONFLICT DO NOTHING;

-- Step 2: Submit professional verification
INSERT INTO professional_verifications (
  user_id,
  professional_body,
  license_number,
  license_expiry,
  business_name,
  specializations,
  service_areas,
  status
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'BORAQS',
  'ARCH/2024/001234',
  '2027-12-31',
  'KenyaArch Design Studio',
  ARRAY['residential_design', 'commercial_design', 'interior_design'],
  ARRAY['Nakuru', 'Nairobi', 'Kiambu'],
  'pending'
);

-- Step 3: Verify professional can view their own verification
SELECT 
  professional_body,
  license_number,
  status,
  specializations,
  service_areas
FROM professional_verifications
WHERE user_id = '44444444-4444-4444-4444-444444444444';

-- Step 4: Admin approves verification
UPDATE professional_verifications
SET 
  status = 'approved',
  verified_at = NOW(),
  verified_by = '33333333-3333-3333-3333-333333333333'
WHERE user_id = '44444444-4444-4444-4444-444444444444';

-- Step 5: Assign professional role
INSERT INTO user_roles (user_id, role) VALUES
  ('44444444-4444-4444-4444-444444444444', 'professional')
ON CONFLICT DO NOTHING;

-- Step 6: Calculate professional trust score
SELECT calculate_trust_score(
  '44444444-4444-4444-4444-444444444444'::uuid,
  'professional'
);

-- Step 7: Verify trust score created
SELECT * FROM trust_scores
WHERE entity_id = '44444444-4444-4444-4444-444444444444';

-- ✅ TEST PASSES IF:
-- 1. Verification status = 'approved'
-- 2. Professional role assigned
-- 3. Trust score created with verification_score = 30
```

---

## TEST 4: BUILD PROJECTS & MATERIALS ✅

```sql
-- Step 1: Create build project
INSERT INTO build_projects (
  id,
  user_id,
  project_name,
  project_type,
  county,
  city,
  estimated_budget,
  specifications,
  status
) VALUES (
  'pppppppp-pppp-pppp-pppp-pppppppppppp',
  '11111111-1111-1111-1111-111111111111',
  '3-Bedroom Bungalow Project',
  'residential',
  'Nakuru',
  'Nakuru City',
  3500000,
  '{"bedrooms": 3, "bathrooms": 2, "floors": 1, "roofing": "iron_sheets"}'::jsonb,
  'planning'
);

-- Step 2: Create material supplier
INSERT INTO auth.users (id, email) VALUES
  ('55555555-5555-5555-5555-555555555555', 'supplier@test.com')
ON CONFLICT DO NOTHING;

-- Step 3: Add building materials
INSERT INTO building_materials (
  id,
  name,
  category,
  supplier_name,
  supplier_id,
  price_per_unit,
  unit,
  stock_quantity,
  specifications,
  delivery_areas
) VALUES 
  (
    'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmm01',
    'Bamburi Cement 50kg',
    'cement',
    'BuildMart Supplies',
    '55555555-5555-5555-5555-555555555555',
    750,
    'bags',
    5000,
    '{"brand": "Bamburi", "grade": "32.5R", "packaging": "50kg"}'::jsonb,
    ARRAY['Nakuru', 'Nairobi']
  ),
  (
    'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmm02',
    'Y12 Steel Bars 6m',
    'steel',
    'BuildMart Supplies',
    '55555555-5555-5555-5555-555555555555',
    1200,
    'pieces',
    3000,
    '{"size": "12mm", "length": "6m", "grade": "Y12"}'::jsonb,
    ARRAY['Nakuru', 'Nairobi']
  );

-- Step 4: Add materials to project ("Add to Project" not cart!)
INSERT INTO project_materials (
  project_id,
  material_id,
  quantity,
  unit,
  unit_price,
  status
) VALUES
  (
    'pppppppp-pppp-pppp-pppp-pppppppppppp',
    'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmm01',
    200,
    'bags',
    750,
    'cart'
  ),
  (
    'pppppppp-pppp-pppp-pppp-pppppppppppp',
    'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmm02',
    100,
    'pieces',
    1200,
    'cart'
  );

-- Step 5: View project with materials
SELECT 
  bp.project_name,
  bp.status,
  COUNT(pm.id) as materials_count,
  SUM(pm.total_price) as cart_total
FROM build_projects bp
LEFT JOIN project_materials pm ON pm.project_id = bp.id
WHERE bp.id = 'pppppppp-pppp-pppp-pppp-pppppppppppp'
GROUP BY bp.id, bp.project_name, bp.status;

-- Expected:
-- materials_count = 2
-- cart_total = 270,000 (200*750 + 100*1200)

-- Step 6: Create materials order (checkout from project)
INSERT INTO materials_orders (
  id,
  project_id,
  user_id,
  order_number,
  subtotal,
  delivery_fee,
  total_amount,
  delivery_county,
  delivery_address,
  delivery_phone,
  status
) VALUES (
  'oooooooo-oooo-oooo-oooo-oooooooooooo',
  'pppppppp-pppp-pppp-pppp-pppppppppppp',
  '11111111-1111-1111-1111-111111111111',
  generate_order_number(),
  270000,
  5000,
  275000,
  'Nakuru',
  'Plot 123, Milimani Estate',
  '+254712345678',
  'pending'
);

-- Step 7: Update project materials to 'ordered'
UPDATE project_materials
SET 
  status = 'ordered',
  ordered_at = NOW()
WHERE project_id = 'pppppppp-pppp-pppp-pppp-pppppppppppp';

-- Step 8: Verify order created
SELECT 
  order_number,
  total_amount,
  status,
  delivery_county
FROM materials_orders
WHERE id = 'oooooooo-oooo-oooo-oooo-oooooooooooo';

-- ✅ TEST PASSES IF:
-- 1. Order created with valid order_number
-- 2. total_amount = 275,000
-- 3. Materials status updated to 'ordered'
-- 4. Project linked correctly
```

---

## TEST 5: SERVICE REQUESTS (PROFESSIONAL BOOKINGS) ✅

```sql
-- Step 1: User creates service request
INSERT INTO service_requests (
  id,
  user_id,
  service_type,
  title,
  description,
  project_id,
  budget_min,
  budget_max,
  county,
  urgency,
  status
) VALUES (
  'ssssssss-ssss-ssss-ssss-ssssssssssss',
  '11111111-1111-1111-1111-111111111111',
  'architect',
  'Need Architect for 3BR Bungalow',
  'Looking for experienced architect to design a modern 3-bedroom bungalow in Nakuru',
  'pppppppp-pppp-pppp-pppp-pppppppppppp',
  150000,
  300000,
  'Nakuru',
  'within_month',
  'pending'
);

-- Step 2: Professional views pending requests
SELECT 
  sr.title,
  sr.description,
  sr.budget_min,
  sr.budget_max,
  sr.county,
  sr.urgency,
  bp.project_name
FROM service_requests sr
LEFT JOIN build_projects bp ON bp.id = sr.project_id
WHERE sr.service_type = 'architect'
AND sr.status = 'pending'
ORDER BY sr.created_at DESC;

-- Step 3: Professional accepts request
UPDATE service_requests
SET 
  professional_id = '44444444-4444-4444-4444-444444444444',
  status = 'accepted',
  responded_at = NOW(),
  accepted_at = NOW()
WHERE id = 'ssssssss-ssss-ssss-ssss-ssssssssssss';

-- Step 4: Update project with assigned architect
UPDATE build_projects
SET architect_id = '44444444-4444-4444-4444-444444444444'
WHERE id = 'pppppppp-pppp-pppp-pppp-pppppppppppp';

-- Step 5: Professional marks service as in progress
UPDATE service_requests
SET 
  status = 'in_progress',
  started_at = NOW()
WHERE id = 'ssssssss-ssss-ssss-ssss-ssssssssssss';

-- Step 6: Professional completes service
UPDATE service_requests
SET 
  status = 'completed',
  completed_at = NOW()
WHERE id = 'ssssssss-ssss-ssss-ssss-ssssssssssss';

-- Step 7: User rates professional
UPDATE service_requests
SET 
  rating = 5,
  review = 'Excellent architect, very professional and creative designs!'
WHERE id = 'ssssssss-ssss-ssss-ssss-ssssssssssss';

-- Step 8: Recalculate professional trust score
SELECT calculate_trust_score(
  '44444444-4444-4444-4444-444444444444'::uuid,
  'professional'
);

-- Step 9: Verify trust score includes rating
SELECT 
  overall_score,
  rating_score,
  average_rating,
  total_ratings
FROM trust_scores
WHERE entity_id = '44444444-4444-4444-4444-444444444444';

-- ✅ TEST PASSES IF:
-- 1. Service request status = 'completed'
-- 2. Professional assigned to project
-- 3. Rating recorded (5 stars)
-- 4. Trust score increased (rating_score > 0)
```

---

## TEST 6: TRIPS & VIEWINGS ✅

```sql
-- Step 1: User creates trip
INSERT INTO property_trips (
  id,
  user_id,
  trip_name,
  planned_date,
  status
) VALUES (
  'tttttttt-tttt-tttt-tttt-tttttttttttt',
  '11111111-1111-1111-1111-111111111111',
  'Nakuru Properties Viewing - Feb 2026',
  '2026-02-15',
  'planning'
);

-- Step 2: Add properties to trip
INSERT INTO trip_properties (trip_id, property_id, visit_order) VALUES
  ('tttttttt-tttt-tttt-tttt-tttttttttttt', '99999999-9999-9999-9999-999999999999', 1);

-- Step 3: View trip with properties
SELECT 
  pt.trip_name,
  pt.planned_date,
  pt.status,
  COUNT(tp.id) as properties_count
FROM property_trips pt
LEFT JOIN trip_properties tp ON tp.trip_id = pt.id
WHERE pt.id = 'tttttttt-tttt-tttt-tttt-tttttttttttt'
GROUP BY pt.id, pt.trip_name, pt.planned_date, pt.status;

-- Step 4: User requests representative
UPDATE property_trips
SET 
  representative_requested = true,
  status = 'scheduled'
WHERE id = 'tttttttt-tttt-tttt-tttt-tttttttttttt';

-- Step 5: Admin assigns representative
UPDATE property_trips
SET representative_assigned_id = '22222222-2222-2222-2222-222222222222'
WHERE id = 'tttttttt-tttt-tttt-tttt-tttttttttttt';

-- ✅ TEST PASSES IF:
-- 1. Trip created with properties
-- 2. Representative requested and assigned
-- 3. User can view their trips
```

---

## TEST 7: SAVED PROPERTIES ✅

```sql
-- User saves property to watchlist
INSERT INTO saved_properties (
  user_id,
  property_id,
  notes,
  tags
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '99999999-9999-9999-9999-999999999999',
  'Great location, need to negotiate price',
  ARRAY['favorite', 'high_priority']
);

-- View saved properties with listing details
SELECT 
  sp.notes,
  sp.tags,
  sp.created_at as saved_at,
  al.title,
  al.price,
  al.location
FROM saved_properties sp
JOIN agent_listings al ON al.id = sp.property_id
WHERE sp.user_id = '11111111-1111-1111-1111-111111111111';

-- ✅ TEST PASSES IF: Property appears in saved list
```

---

## TEST 8: AI GENIE CONTEXT & STATE ✅

```sql
-- Step 1: Create genie conversation
INSERT INTO genie_conversations (
  id,
  user_id,
  session_id,
  current_mode,
  intent,
  context
) VALUES (
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  '11111111-1111-1111-1111-111111111111',
  'session_' || gen_random_uuid()::text,
  'DISCOVERY',
  'buy_land',
  '{"location": "Nakuru", "transaction_type": "buy", "property_type": "land", "budget_range": [500000, 2000000]}'::jsonb
);

-- Step 2: Add user message
INSERT INTO genie_messages (
  conversation_id,
  role,
  content,
  detected_intent,
  intent_confidence
) VALUES (
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  'user',
  'I want to buy land in Nakuru around 1 million',
  'buy_land',
  0.95
);

-- Step 3: Add AI response
INSERT INTO genie_messages (
  conversation_id,
  role,
  content,
  message_type,
  structured_data
) VALUES (
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  'assistant',
  'Based on Nakuru and your budget of around KES 1M, I found several land options. Here are properties that match your request:',
  'property_results',
  '{"results_count": 5, "properties": []}'::jsonb
);

-- Step 4: View conversation with context
SELECT 
  gc.current_mode,
  gc.intent,
  gc.context,
  gc.message_count,
  COUNT(gm.id) as actual_message_count
FROM genie_conversations gc
LEFT JOIN genie_messages gm ON gm.conversation_id = gc.id
WHERE gc.id = 'gggggggg-gggg-gggg-gggg-gggggggggggg'
GROUP BY gc.id, gc.current_mode, gc.intent, gc.context, gc.message_count;

-- ✅ TEST PASSES IF:
-- 1. Context stored as JSONB with location, budget, etc.
-- 2. Messages linked to conversation
-- 3. Intent and mode tracked
```

---

## TEST 9: SECURITY - BYPASS DETECTION ✅

```sql
-- Simulate agent sharing phone number in message
INSERT INTO genie_messages (
  conversation_id,
  role,
  content
) VALUES (
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  'assistant',
  'You can reach me directly at +254712345678 or 0712345678 for faster response'
);

-- Check if bypass flag was auto-created
SELECT 
  flag_type,
  evidence,
  flagged_at
FROM platform_bypass_flags
WHERE evidence LIKE '%254712345678%'
OR evidence LIKE '%0712345678%';

-- ✅ TEST PASSES IF: Bypass flag created automatically

-- Check for admin alert on multiple flags
-- (Already tested in trigger, should create alert if >= 2 flags)
SELECT 
  alert_type,
  severity,
  title,
  description
FROM admin_alerts
WHERE alert_type = 'bypass_attempt'
ORDER BY created_at DESC
LIMIT 5;
```

---

## TEST 10: PROPERTY VIEWS TRACKING ✅

```sql
-- Track property view
INSERT INTO property_views (
  property_id,
  user_id,
  session_id,
  ip_address,
  view_duration_seconds
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  '11111111-1111-1111-1111-111111111111',
  'sess_' || gen_random_uuid()::text,
  '102.168.1.1'::inet,
  45
);

-- Verify view count incremented on listing
SELECT 
  title,
  view_count
FROM agent_listings
WHERE id = '99999999-9999-9999-9999-999999999999';

-- ✅ TEST PASSES IF: view_count incremented by 1
```

---

## COMPLETE SYSTEM TEST - RUN ALL ✅

```sql
-- This script runs a comprehensive test of the entire system

DO $$
DECLARE
  test_passed boolean := true;
  test_name text;
  test_result text;
BEGIN
  -- Test 1: Escrow net payout calculation
  test_name := 'Escrow Net Payout Calculation';
  SELECT net_payout = 3750000 INTO test_passed
  FROM escrow_transactions
  WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
  
  IF test_passed THEN
    RAISE NOTICE '✅ PASS: %', test_name;
  ELSE
    RAISE NOTICE '❌ FAIL: %', test_name;
  END IF;
  
  -- Test 2: Trust score exists
  test_name := 'Trust Score Creation';
  SELECT EXISTS (
    SELECT 1 FROM trust_scores
    WHERE entity_id = '22222222-2222-2222-2222-222222222222'
  ) INTO test_passed;
  
  IF test_passed THEN
    RAISE NOTICE '✅ PASS: %', test_name;
  ELSE
    RAISE NOTICE '❌ FAIL: %', test_name;
  END IF;
  
  -- Test 3: Professional verification
  test_name := 'Professional Verification';
  SELECT status = 'approved' INTO test_passed
  FROM professional_verifications
  WHERE user_id = '44444444-4444-4444-4444-444444444444';
  
  IF test_passed THEN
    RAISE NOTICE '✅ PASS: %', test_name;
  ELSE
    RAISE NOTICE '❌ FAIL: %', test_name;
  END IF;
  
  -- Test 4: Build project with materials
  test_name := 'Build Project Materials';
  SELECT COUNT(*) = 2 INTO test_passed
  FROM project_materials
  WHERE project_id = 'pppppppp-pppp-pppp-pppp-pppppppppppp';
  
  IF test_passed THEN
    RAISE NOTICE '✅ PASS: %', test_name;
  ELSE
    RAISE NOTICE '❌ FAIL: %', test_name;
  END IF;
  
  -- Test 5: Service request completed
  test_name := 'Service Request Flow';
  SELECT status = 'completed' INTO test_passed
  FROM service_requests
  WHERE id = 'ssssssss-ssss-ssss-ssss-ssssssssssss';
  
  IF test_passed THEN
    RAISE NOTICE '✅ PASS: %', test_name;
  ELSE
    RAISE NOTICE '❌ FAIL: %', test_name;
  END IF;
  
  -- Test 6: Genie conversation context
  test_name := 'Genie Context Storage';
  SELECT context ? 'location' INTO test_passed
  FROM genie_conversations
  WHERE id = 'gggggggg-gggg-gggg-gggg-gggggggggggg';
  
  IF test_passed THEN
    RAISE NOTICE '✅ PASS: %', test_name;
  ELSE
    RAISE NOTICE '❌ FAIL: %', test_name;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 PATAHOME DATABASE TEST SUITE COMPLETE';
  RAISE NOTICE '========================================';
END $$;
```

---

## CLEANUP TEST DATA

```sql
-- Run this to remove all test data after testing

DELETE FROM genie_messages WHERE conversation_id = 'gggggggg-gggg-gggg-gggg-gggggggggggg';
DELETE FROM genie_conversations WHERE id = 'gggggggg-gggg-gggg-gggg-gggggggggggg';
DELETE FROM trip_properties WHERE trip_id = 'tttttttt-tttt-tttt-tttt-tttttttttttt';
DELETE FROM property_trips WHERE id = 'tttttttt-tttt-tttt-tttt-tttttttttttt';
DELETE FROM saved_properties WHERE user_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM materials_orders WHERE id = 'oooooooo-oooo-oooo-oooo-oooooooooooo';
DELETE FROM project_materials WHERE project_id = 'pppppppp-pppp-pppp-pppp-pppppppppppp';
DELETE FROM service_requests WHERE id = 'ssssssss-ssss-ssss-ssss-ssssssssssss';
DELETE FROM build_projects WHERE id = 'pppppppp-pppp-pppp-pppp-pppppppppppp';
DELETE FROM building_materials WHERE supplier_id = '55555555-5555-5555-5555-555555555555';
DELETE FROM professional_verifications WHERE user_id = '44444444-4444-4444-4444-444444444444';
DELETE FROM trust_scores WHERE entity_id IN (
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444'
);
DELETE FROM escrow_transactions WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
DELETE FROM agent_listings WHERE id = '99999999-9999-9999-9999-999999999999';
DELETE FROM user_roles WHERE user_id IN (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);
DELETE FROM platform_bypass_flags WHERE agent_id = '22222222-2222-2222-2222-222222222222';
DELETE FROM admin_alerts WHERE entity_id = '22222222-2222-2222-2222-222222222222';

-- Note: auth.users are not deleted as they might be real test accounts
-- Delete manually from Supabase dashboard if needed
```

---

## NEXT STEPS AFTER TESTS PASS

1. ✅ All tests pass → Database ready for production
2. 🔧 Generate seed data (100+ realistic listings)
3. 🤖 Set up n8n AI Genie workflows
4. 🎨 Update frontend to use new tables
5. 🚀 Deploy to production
