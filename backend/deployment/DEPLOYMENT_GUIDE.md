# PATAHOME DATABASE DEPLOYMENT GUIDE

## Step-by-Step: From Local to Production

---

## PHASE 1: LOCAL SETUP & TESTING (30 minutes)

### Step 1: Navigate to Project Directory

```bash
cd /path/to/kenya-prime-dwellings

# Verify you're in the right directory
ls -la supabase/migrations/
# Should see: 20260205000001_complete_patahome_schema.sql
```

### Step 2: Set Up Supabase Locally (Optional but Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# When prompted, enter your database password
```

### Step 3: Test Migration Locally

```bash
# Start local Supabase
supabase start

# Apply migration
supabase db push

# Check for errors
supabase db diff

# If successful, you'll see:
# ✅ Migration applied successfully
```

### Step 4: Run Test Suite

```bash
# Connect to local database
psql postgresql://postgres:postgres@localhost:54322/postgres

# Copy-paste tests from TEST_SUITE.md
# Or run the complete test script:
\i supabase/TEST_SUITE.md
```

**Expected Output:**
```
✅ PASS: Escrow Net Payout Calculation
✅ PASS: Trust Score Creation
✅ PASS: Professional Verification
✅ PASS: Build Project Materials
✅ PASS: Service Request Flow
✅ PASS: Genie Context Storage

========================================
🎉 PATAHOME DATABASE TEST SUITE COMPLETE
========================================
```

---

## PHASE 2: GIT COMMIT & PUSH (10 minutes)

### Step 1: Check Git Status

```bash
cd /path/to/kenya-prime-dwellings

git status
```

**Expected Output:**
```
Changes not staged for commit:
  modified:   supabase/migrations/
  new file:   supabase/migrations/20260205000001_complete_patahome_schema.sql
  new file:   supabase/TEST_SUITE.md
```

### Step 2: Review Changes

```bash
# View what changed
git diff supabase/migrations/20260205000001_complete_patahome_schema.sql

# Verify it's your new migration file
```

### Step 3: Stage Changes

```bash
# Add new migration file
git add supabase/migrations/20260205000001_complete_patahome_schema.sql

# Add test suite
git add supabase/TEST_SUITE.md

# Add deployment guide
git add supabase/DEPLOYMENT_GUIDE.md

# Verify staged files
git status
```

**Expected Output:**
```
Changes to be committed:
  new file:   supabase/migrations/20260205000001_complete_patahome_schema.sql
  new file:   supabase/TEST_SUITE.md
  new file:   supabase/DEPLOYMENT_GUIDE.md
```

### Step 4: Commit Changes

```bash
git commit -m "feat: Complete PataHome database schema

- Add escrow transaction system with auto-payout calculation
- Implement trust score system with weighted formulas
- Add professional verification for EBK, BORAQS, ISK, LSK
- Create build projects & materials (project-aware cart)
- Add service request system for professional bookings
- Implement trips & viewings for property tours
- Add AI Genie conversation state & context memory
- Create security features: bypass detection, admin alerts
- Add property views tracking & analytics
- Implement market insights & agent performance tables
- Add automated triggers for trust score updates
- Include comprehensive RLS policies for all tables
- Add 25+ new tables, 50+ policies, 10+ triggers

Tests:
- All test suite scenarios pass ✅
- RLS policies verified ✅
- Trust score calculations validated ✅
- Escrow flow tested end-to-end ✅

Breaking Changes:
- None (additive only, backward compatible)

Related:
- Implements PRD requirements for escrow & trust system
- Enables AI Genie context persistence
- Prepares for n8n workflow integration"
```

### Step 5: Push to GitHub

```bash
# If you have a remote named 'origin'
git push origin main

# If you're on a different branch
git push origin <your-branch-name>

# If this is your first push
git push -u origin main
```

**Expected Output:**
```
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Delta compression using up to 8 threads
Compressing objects: 100% (8/8), done.
Writing objects: 100% (9/9), 45.23 KiB | 2.26 MiB/s, done.
Total 9 (delta 3), reused 0 (delta 0)
To https://github.com/Axiomwriters/kenya-prime-dwellings.git
   abc1234..def5678  main -> main
```

### Step 6: Verify on GitHub

1. Go to https://github.com/Axiomwriters/kenya-prime-dwellings
2. Click on `supabase/migrations/`
3. Verify you see:
   - `20260205000001_complete_patahome_schema.sql`
   - `TEST_SUITE.md`
   - `DEPLOYMENT_GUIDE.md`

---

## PHASE 3: DEPLOY TO SUPABASE PRODUCTION (15 minutes)

### Method A: Supabase CLI (Recommended)

```bash
# Make sure you're linked to production project
supabase link --project-ref YOUR_PRODUCTION_REF

# Apply migration to production
supabase db push

# Confirm when prompted:
# "Do you want to push these migrations to the remote database? (y/N)"
# Type: y
```

**Expected Output:**
```
Applying migration 20260205000001_complete_patahome_schema.sql...
✅ Migration applied successfully
```

### Method B: Supabase Dashboard (Alternative)

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy entire contents of `20260205000001_complete_patahome_schema.sql`
5. Paste into editor
6. Click **Run** button
7. Wait for completion (may take 30-60 seconds)

**Expected Output in Console:**
```
✅ 216de6e3-42ec-43fa-8548-a1c63fa105dd
✅ PataHome Complete Schema Migration Successful!
```

### Step 2: Verify Deployment

```bash
# Connect to production database
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Check tables were created
\dt public.*

# Should see all new tables:
# escrow_transactions
# trust_scores
# professional_verifications
# build_projects
# building_materials
# ... etc.

# Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

# Should show 25+ tables with RLS enabled
```

### Step 3: Run Production Tests

```bash
# Copy test suite to clipboard
cat supabase/TEST_SUITE.md | pbcopy

# Connect to production
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Paste and run tests
# (Paste from clipboard)

# Cleanup test data after verification
# (Use cleanup script from TEST_SUITE.md)
```

---

## PHASE 4: UPDATE FRONTEND CODE (2-3 hours)

### Step 1: Update Supabase Types

```bash
# Generate TypeScript types from database
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Or from production:
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

### Step 2: Create React Hooks for New Tables

Example: `/src/hooks/useEscrow.ts`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEscrowTransaction(transactionId: string) {
  return useQuery({
    queryKey: ['escrow', transactionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateEscrow() {
  return useMutation({
    mutationFn: async (escrowData: any) => {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .insert(escrowData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}
```

### Step 3: Update Components to Use New Tables

Example: Update `src/components/ListingCard.tsx` to show Trust Score

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function AgentTrustBadge({ agentId }: { agentId: string }) {
  const { data: trustScore } = useQuery({
    queryKey: ['trust-score', agentId],
    queryFn: async () => {
      const { data } = await supabase
        .from('trust_scores')
        .select('overall_score, badges')
        .eq('entity_id', agentId)
        .single();
      return data;
    },
  });

  if (!trustScore) return null;

  return (
    <Badge variant={trustScore.overall_score >= 80 ? 'success' : 'default'}>
      Trust Score: {Math.round(trustScore.overall_score)}
    </Badge>
  );
}
```

### Step 4: Test Frontend Integration

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173

# Test key flows:
# 1. View property listings with trust scores
# 2. Add property to trip
# 3. Create build project
# 4. Add materials to project
# 5. Create service request
```

---

## PHASE 5: SEED PRODUCTION DATA (1 hour)

### Create Seed Data Script

Create `/supabase/seed.sql`:

```sql
-- Seed 10 verified agents
INSERT INTO agent_verifications (user_id, id_front_url, id_back_url, status)
SELECT 
  id,
  'https://storage.example.com/id_front_' || id::text || '.jpg',
  'https://storage.example.com/id_back_' || id::text || '.jpg',
  'approved'
FROM auth.users
WHERE email LIKE 'agent%@patahome.co.ke'
LIMIT 10;

-- Calculate trust scores for all agents
DO $$
DECLARE
  agent_record RECORD;
BEGIN
  FOR agent_record IN 
    SELECT user_id FROM agent_verifications WHERE status = 'approved'
  LOOP
    PERFORM calculate_trust_score(agent_record.user_id, 'agent');
  END LOOP;
END $$;

-- Seed 100 property listings
-- (Add your property data here)

-- Seed building materials catalog
-- (Add materials data here)
```

Run seed script:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_REF.supabase.co:5432/postgres" < supabase/seed.sql
```

---

## PHASE 6: MONITORING & ALERTS

### Set Up Database Monitoring

1. **Supabase Dashboard Metrics**
   - Go to Project Settings → Database
   - Enable Daily Reports
   - Set up alert emails

2. **Custom Monitoring Query**

```sql
-- Save as view for easy monitoring
CREATE OR REPLACE VIEW monitoring_dashboard AS
SELECT 
  'Escrow Transactions' as metric,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  SUM(total_amount) FILTER (WHERE status = 'completed') as total_gmv
FROM escrow_transactions
UNION ALL
SELECT 
  'Trust Scores',
  COUNT(*),
  COUNT(*) FILTER (WHERE overall_score < 50),
  COUNT(*) FILTER (WHERE overall_score >= 80),
  AVG(overall_score)
FROM trust_scores
UNION ALL
SELECT 
  'Bypass Flags',
  COUNT(*),
  COUNT(*) FILTER (WHERE NOT reviewed),
  COUNT(*) FILTER (WHERE action_taken = 'ban'),
  NULL
FROM platform_bypass_flags;

-- Query dashboard
SELECT * FROM monitoring_dashboard;
```

---

## TROUBLESHOOTING

### Problem: Migration Fails with "relation already exists"

**Solution:**
```bash
# Check existing tables
psql -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"

# If table exists, drop and retry (CAREFUL!)
psql -c "DROP TABLE IF EXISTS escrow_transactions CASCADE;"

# Or skip existing tables in migration
```

### Problem: RLS Policies Block Queries

**Solution:**
```sql
-- Temporarily disable RLS for testing (NEVER IN PRODUCTION!)
ALTER TABLE escrow_transactions DISABLE ROW LEVEL SECURITY;

-- Test query
SELECT * FROM escrow_transactions;

-- Re-enable RLS
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'escrow_transactions';
```

### Problem: Functions Not Found

**Solution:**
```sql
-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'calculate_trust_score';

-- Recreate function if needed
-- (Copy from migration file)
```

### Problem: Git Push Rejected

**Solution:**
```bash
# Pull latest changes first
git pull origin main

# Resolve conflicts if any
git status

# Push again
git push origin main
```

---

## ROLLBACK PROCEDURE (Emergency Only)

If migration causes critical issues:

```sql
-- Drop all new tables (CAREFUL!)
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'escrow_transactions',
      'trust_scores',
      'professional_verifications',
      'build_projects',
      'building_materials',
      'project_materials',
      'materials_orders',
      'service_requests',
      'property_trips',
      'trip_properties',
      'saved_properties',
      'property_views',
      'platform_bypass_flags',
      'admin_alerts',
      'user_agreements',
      'genie_conversations',
      'genie_messages',
      'market_insights',
      'agent_performance'
    )
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || table_name || ' CASCADE';
  END LOOP;
END $$;

-- Drop new enums
DROP TYPE IF EXISTS escrow_status CASCADE;
DROP TYPE IF EXISTS professional_body CASCADE;
DROP TYPE IF EXISTS service_type CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;
DROP TYPE IF EXISTS material_unit CASCADE;
```

---

## POST-DEPLOYMENT CHECKLIST

- [ ] All migrations applied successfully
- [ ] Test suite passes in production
- [ ] RLS policies verified
- [ ] Trust score calculations working
- [ ] Frontend integrated with new tables
- [ ] Seed data loaded
- [ ] Monitoring dashboard set up
- [ ] Team trained on new features
- [ ] Documentation updated
- [ ] Backup created

---

## NEXT STEPS

After successful deployment:

1. ✅ Database schema complete
2. 🤖 Set up n8n AI Genie workflows (next task)
3. 🎨 Update frontend components
4. 🧪 Full system integration testing
5. 🚀 Soft launch to beta users

---

## SUPPORT

If you encounter issues:

1. Check logs in Supabase Dashboard
2. Review error messages carefully
3. Consult TEST_SUITE.md for debugging
4. Check GitHub issues for similar problems
5. Contact team lead or DevOps

**Emergency Contact:**
- Database Issues: [email protected]
- Deployment Issues: [email protected]
