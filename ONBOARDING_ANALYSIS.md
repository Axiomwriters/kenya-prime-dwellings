# Savanah Dwelling - Onboarding, Verification & Account Analysis

## Project Overview

**Project Name:** Savanah Dwelling (formerly PataHome)

**Type:** Full-stack Real Estate Platform with Multiple User Roles

**Technology Stack:**
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Authentication:** Clerk Auth
- **State Management:** TanStack React Query
- **UI Components:** Radix UI + shadcn/ui components

**Core Features:**
- Property listings (buying, renting, land)
- Real estate agent management
- Short-stay/Airbnb hosting
- Professional services marketplace (architects, contractors, etc.)
- Building materials shopping
- AI Genie concierge
- Escrow transaction system
- Trust score system

---

## Account Creation Counts

**Current System:** The app tracks accounts in the `profiles` table via Supabase. The Admin Dashboard (`AdminDashboard.tsx:80`) fetches `totalAccounts` dynamically from `profiles.count`. To get the **exact number**, you'd need to check your Supabase dashboard or run:

```sql
SELECT COUNT(*) FROM profiles;
```

The Admin Accounts page shows real-time counts filtered by role (agents, hosts, etc.) and verification status.

---

## Key Files Reference

### Onboarding Flows

| File Path | Description |
|-----------|-------------|
| `src/pages/SignUp.tsx` | Main signup page with role selection (tenant, agent, host, professional) |
| `src/pages/onboarding/sync.tsx` | Profile sync page after Clerk authentication |
| `src/utils/role-selection.ts` | Role persistence utilities for onboarding |

### Agent Onboarding

| File Path | Description |
|-----------|-------------|
| `src/pages/BecomeAgent.tsx` | Form for existing users to become agents |
| `src/pages/AgentDashboard/NewAgentDashboard.tsx` | Agent dashboard overview |
| `src/routes/agentRoutes.tsx` | Agent dashboard route definitions |
| `src/components/AgentSidebar.tsx` | Agent navigation sidebar |
| `src/pages/AgentDashboard/AgentProfile.tsx` | Agent profile setup |

### Short-Stay Host Onboarding

| File Path | Description |
|-----------|-------------|
| `src/pages/HostDashboard.tsx` | Main host dashboard container |
| `src/pages/HostDashboard/DashboardOverview.tsx` | Host dashboard welcome/overview |
| `src/pages/HostDashboard/AddProperty.tsx` | Add new property for short-stay |
| `src/pages/HostDashboard/Properties.tsx` | Host's properties management |

### Professional Onboarding

| File Path | Description |
|-----------|-------------|
| `src/pages/ProfessionalLanding.tsx` | Professional landing page (public-facing) |
| `src/pages/ProfessionalDashboard.tsx` | Professional dashboard container |
| `src/pages/ProfessionalDashboard/DashboardOverview.tsx` | Professional command center overview |
| `src/pages/ProfessionalDashboard/Profile.tsx` | Professional profile setup |
| `src/pages/ProfessionalDashboard/Projects.tsx` | Build projects management |

### Verification Systems

| File Path | Description |
|-----------|-------------|
| `src/pages/Verification/VerificationPage.tsx` | Full verification flow |
| `src/pages/Admin/AdminVerifications.tsx` | Admin panel to review/approve/reject verifications |

### Verification Database Tables (Migrations)

| File Path | Description |
|-----------|-------------|
| `supabase/migrations/20260327000001_verification_sessions.sql` | Creates `verification_sessions` table |
| `supabase/migrations/20260327000002_verification_storage.sql` | Creates `verification-docs` storage bucket |
| `supabase/migrations/20260402_001_add_otp_hash_and_professional_role.sql` | Adds OTP hash and professional role |

### Verification Edge Functions

| File Path | Description |
|-----------|-------------|
| `supabase/functions/send-verification-otp/index.ts` | Sends OTP via SMS for phone verification |

---

## AGENT Onboarding - Detailed Analysis

### COMPLETED Components

1. **BecomeAgent.tsx** (141 lines)
   - Basic registration form with fields: agency_name, license_number, bio, whatsapp_number
   - Creates entry in `agents` table
   - Updates user role to "agent"
   - Refreshes local auth state
   - Navigates to agent dashboard

2. **AgentProfile.tsx** - Profile setup page

3. **NewAgentDashboard.tsx** - Dashboard overview

4. **MyListings.tsx** - Listings management

5. **CreateListing.tsx** - Create listing flow

6. **AgentTrips.tsx** - Trip/viewing management

7. **AgentSettings.tsx** - Settings page

8. **AgencyDashboard.tsx** - Agency mode

### REMAINING / INCOMPLETE

1. **Multi-step Agent Onboarding Wizard**
   - No guided 3-4 step flow
   - Missing steps: intro → license upload → profile → completion
   - Should redirect new agents through onboarding before dashboard access

2. **License Document Upload**
   - Form has `license_number` field (text input) but no actual document upload
   - No upload to `agent_verifications` table
   - Missing: license photo, certification document

3. **Location Fields Missing**
   - `agents` table has `city` and `county` columns
   - `BecomeAgent.tsx` does not insert these values
   - Missing fields in form

4. **Agent Listing Stats**
   - `AgentPerformance` table exists in schema but no integration
   - Should track: total_listings, active_listings, sold_properties, etc.

5. **Trust Score Display**
   - `TrustBlock.tsx` in AgentDashboard is empty placeholder
   - Should display verification badge, transaction score, ratings

6. **Analytics Dashboard**
   - Needs real data integration from `agent_performance` table
   - Current stats show hardcoded placeholder data

7. **Agent-Specific Verification**
   - `agent_verifications` table exists in schema
   - No dedicated upload flow for agents
   - Missing document review workflow

### Agent Profile Components (AgentDashboard)

| Component | Status |
|-----------|--------|
| VerificationSection.tsx | ? |
| TrustBlock.tsx | Empty placeholder |
| SmartAssistantSettings.tsx | Empty placeholder |
| PublicProfilePreview.tsx | Empty placeholder |
| PerformanceSnapshot.tsx | ? |
| IdentitySelector.tsx | ? |
| FinancialSettings.tsx | ? |
| ContactLayer.tsx | Empty placeholder |

---

## SHORT-STAY HOST Onboarding - Detailed Analysis

### COMPLETED Components

1. **HostDashboard.tsx** - Main container

2. **DashboardOverview.tsx** - Welcome/overview page

3. **AddProperty.tsx** (208 lines) - Multi-tab property form:
   - Details tab: title, type, guests, beds, baths, size, description, address
   - Amenities tab: checkboxes for WiFi, Kitchen, Washer, etc.
   - Photos tab: image upload with preview
   - Pricing tab: nightly price, weekend price, cleaning fee, deposit, extra guest fee

4. **Properties.tsx** - Property listing page

5. **Reservations.tsx** - Booking management (needs backend)

6. **Financials.tsx** - Finance tracking

7. **Insights.tsx** - Analytics

8. **CalendarSync.tsx** - Calendar integration

9. **Team.tsx** - Team management

10. **Guidebook.tsx** - Host guidebook

11. **Integrations.tsx** - External integrations

### REMAINING / INCOMPLETE

1. **Host Onboarding Wizard**
   - No guided flow introducing hosts to platform
   - Should include: welcome → property basics → pricing tips → completion

2. **Host Profile Setup**
   - No dedicated profile page for hosts
   - Missing: host bio, response time settings, house rules template

3. **Property Submission to Database**
   - **CRITICAL:** `AddProperty.tsx` has full UI but NO `supabase.insert()` call
   - Should save to `short_stay_listings` table
   - Current state: form is decorative only

4. **Booking Management Logic**
   - `Reservations.tsx` needs backend integration
   - Should connect to `short_stay_bookings` table
   - Missing: booking confirmations, guest communication

5. **Calendar Availability**
   - Needs actual calendar data integration
   - Should show blocked dates, bookings
   - Missing: real-time sync with Airbnb, Booking.com

6. **Payment Integration**
   - No M-Pesa or payment flow for bookings
   - Missing: deposit collection, payout schedule
   - Should integrate with `escrow_transactions` table

7. **Review/Rating System**
   - No guest review flow
   - Missing: post-stay review request, host response

8. **Operations Automation**
   - `Operations.tsx` exists but likely placeholder
   - Missing: automated messaging, cleaning schedules

---

## PROFESSIONAL Onboarding - Detailed Analysis

### COMPLETED Components

1. **ProfessionalLanding.tsx** - Public landing page

2. **ProfessionalDashboard.tsx** - Container

3. **DashboardOverview.tsx** - Command center

4. **Profile.tsx** (161 lines) - Profile settings:
   - Header banner with gradient
   - Avatar upload
   - Basic profile fields (name, phone, bio)
   - Specializations (placeholder)
   - Experience level
   - Languages
   - CRM Settings section
   - AI Settings section
   - Public Profile Preview section

5. **Projects.tsx** - Build projects

6. **Clients.tsx** - Client management

7. **Analytics.tsx** - Analytics

8. **Add Project Modal Flow:**
   - ProjectTypePicker.tsx
   - ProjectDetailsForm.tsx
   - ProjectMediaForm.tsx
   - AddProjectModal.tsx

### REMAINING / INCOMPLETE

1. **Professional Registration Wizard**
   - No guided onboarding flow
   - Should include: welcome → professional body → license upload → profile → completion

2. **Professional License Verification**
   - `professional_verifications` table exists with fields:
     - professional_body (EBK, BORAQS, ISK, LSK, IEK, ACIK)
     - license_number
     - license_expiry
     - business_name
     - business_registration_number
     - kra_pin
   - No dedicated upload UI for professional credentials
   - Missing: license document, business certificate, ID document upload

3. **TrustBlock Component** - Empty placeholder
   - Should display: verification status, badge, overall trust score

4. **ContactLayer Component** - Empty placeholder
   - Should display: phone, email, WhatsApp, booking settings

5. **PublicProfilePreview Component** - Empty placeholder
   - Should show: how profile appears to public users

6. **SmartAssistantSettings Component** - Empty placeholder
   - Should show: AI reply settings, price optimization, follow-up reminders

7. **Service Request Flow**
   - `service_requests` table exists
   - No UI to create/manage service requests
   - Missing: request form, professional response workflow

8. **Build Project Full Flow**
   - `build_projects` table exists with all specifications
   - Limited integration with UI
   - Missing: project creation form, progress tracking, linked professionals

9. **Materials Ordering**
   - `building_materials`, `project_materials`, `materials_orders` tables exist
   - No UI for browsing or ordering materials

10. **Professional CRMHub Component**
    - Needs integration with `service_requests` for client management

---

## ACCOUNT VERIFICATION - Detailed Analysis

### COMPLETED Components

**VerificationPage.tsx** (1250 lines) - Full 4-step flow:

1. **Welcome Step**
   - Explains verification requirements
   - Shows 48-hour time limit warning

2. **ID Upload Step**
   - Front and back of ID
   - File validation (5MB max, image only)
   - Preview before upload
   - Upload to `verification-docs` storage

3. **Selfie Step**
   - Camera capture
   - File validation
   - Preview

4. **Phone OTP Step**
   - Phone number input with +254 prefix
   - OTP generation and hashing (SHA-256)
   - SMS sending via edge function
   - 5-minute expiry
   - 5 attempts max
   - Resend functionality

5. **Completion Step**
   - Success message
   - Redirect to dashboard

**AdminVerifications.tsx** (320 lines)
- Lists pending verification requests
- Search by name/email
- Approve/Reject buttons
- Detail dialog (empty document display)

**Database:**
- `verification_sessions` table - tracks all verification steps
- `verification-docs` storage bucket
- OTP hash storage with expiry

### REMAINING / INCOMPLETE

1. **Admin Review of Uploaded Documents**
   - **CRITICAL:** AdminVerifications shows profile list but verification documents not displayed
   - Documents are stored but admin has no way to view them
   - Missing: document gallery in detail dialog

2. **Manual Document Review UI**
   - No way for admin to zoom/pan through uploaded ID images
   - Missing: side-by-side ID and selfie comparison
   - Missing: approve with notes, request re-upload

3. **Rejection with Feedback**
   - Can reject verification but no reason field
   - User gets no feedback on why rejected
   - Missing: rejection reason input, email notification to user

4. **Verification Status Sync**
   - Completing verification sets `verification_sessions.status = 'completed'`
   - Does NOT auto-update `profiles.verification_status`
   - Missing: trigger to update profile status after verification

5. **Role-Based Verification Gates**
   - Missing enforcement - users can access features without verification
   - Should block: agent dashboard access until verified, host listing until verified
   - Missing: middleware/guard for verification status

6. **Trust Score Integration**
   - Completing verification should trigger trust score calculation
   - Should update `trust_scores` table with +30 verification points
   - Missing: backend trigger after verification completion

7. **Email Notifications**
   - No notification when verification is submitted
   - No notification when verification approved/rejected
   - Missing: email templates and sending logic

8. **Verification Expiry Handling**
   - Session expiry (48 hours) works
   - No re-verification prompt after expiry
   - Missing: "Start new verification" flow with proper state reset

9. **Professional Verification**
   - Current verification is generic (ID + selfie)
   - Professionals need additional: license verification, professional body check
   - Missing: professional-specific verification flow

---

## Admin Dashboard - Stats Analysis

### Current State in AdminDashboard.tsx

```typescript
// Line 79-90
const fetchStats = async () => {
  const [accountsRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  setStats({
    totalAccounts: accountsRes.count || 0,  // ✅ WORKS
    totalListings: 0,                        // ❌ HARDCODED
    pendingVerifications: 0,                // ❌ HARDCODED
    activeViewings: 0,                       // ❌ HARDCODED
    totalTrips: 0,                           // ❌ HARDCODED
    verifiedAgents: Math.floor(... * 0.7),    // ❌ FAKE CALCULATION
  });
};
```

### What Needs to Be Implemented

| Stat | Current | Needed |
|------|---------|--------|
| totalAccounts | ✅ Real query | - |
| totalListings | ❌ 0 | Query `agent_listings` count |
| pendingVerifications | ❌ 0 | Query `profiles` WHERE verification_status = 'pending' |
| activeViewings | ❌ 0 | Query `property_trips` WHERE status = 'scheduled' |
| totalTrips | ❌ 0 | Query `property_trips` count |
| verifiedAgents | ❌ Fake | Query `profiles` WHERE role = 'agent' AND verification_status = 'verified' |

### Recent Accounts Section

- Lines 286-304 show placeholder data with `User 1`, `User 2`, etc.
- Should query real recent profiles ordered by created_at DESC

---

## Database Schema Summary

### Core Tables

| Table | Purpose | Status |
|-------|---------|--------|
| profiles | User accounts | Implemented |
| agents | Agent profiles | Partial |
| professional_verifications | Professional credentials | Empty |
| verification_sessions | Verification tracking | Implemented |
| agent_verifications | Agent documents | Empty |
| trust_scores | Trust calculation | Implemented |

### Host Tables

| Table | Purpose | Status |
|-------|---------|--------|
| short_stay_listings | Rental properties | Schema exists |
| short_stay_bookings | Bookings | Schema exists |
| property_trips | Viewing trips | Implemented |

### Professional Tables

| Table | Purpose | Status |
|-------|---------|--------|
| service_requests | Client requests | Schema exists |
| build_projects | Construction projects | Partial |
| building_materials | Material catalog | Schema exists |
| project_materials | Project materials | Schema exists |
| materials_orders | Material orders | Schema exists |

### Transaction Tables

| Table | Purpose | Status |
|-------|---------|--------|
| escrow_transactions | Payment tracking | Implemented |
| agent_performance | Agent metrics | Schema exists |

---

## Summary Table

| Component | Completion | Key Gaps |
|-----------|-----------|----------|
| **Agent Onboarding** | ~65% | License doc upload, onboarding wizard, city/county, trust display |
| **Host Onboarding** | ~50% | Property save to DB, booking flow, payments, profile setup |
| **Professional Onboarding** | ~45% | License verification, profile components, service requests |
| **Verification (User)** | ~80% | Admin doc review, status sync, notifications |
| **Verification (Admin)** | ~40% | Doc viewing, rejection reasons, bulk actions |
| **Admin Dashboard** | ~50% | Real stats queries, recent accounts data |

---

## Quick Wins Priority

### Priority 1 - Critical

1. **Connect AddProperty to database**
   - Add `supabase.from('short_stay_listings').insert()` to AddProperty.tsx
   - Most impactful for host onboarding

2. **Fix Verification Status Sync**
   - After verification completion, update `profiles.verification_status`
   - This is a simple database update in handleComplete()

3. **Add Admin Document Review**
   - Display uploaded documents in AdminVerifications detail dialog
   - Use `verification_sessions.id_front_url`, etc.

### Priority 2 - High

4. **Implement profile components**
   - TrustBlock.tsx
   - ContactLayer.tsx
   - PublicProfilePreview.tsx
   - SmartAssistantSettings.tsx

5. **Fix AdminDashboard stats queries**
   - Query real counts for all metrics
   - Replace placeholder recent accounts with real data

6. **Build Agent Onboarding Wizard**
   - Multi-step guided flow
   - Include license document upload

### Priority 3 - Medium

7. **Professional License Verification UI**
   - Create form for professional_verifications table
   - Include document uploads

8. **Rejection Feedback**
   - Add rejection reason field
   - Send notification to user

9. **Host Profile Page**
   - Create dedicated profile setup for hosts

---

## Route Reference

| Route | Component | Description |
|-------|-----------|-------------|
| `/onboarding/sync` | SyncPage | Post-signup profile sync |
| `/verification` | VerificationPage | Identity verification |
| `/agent/*` | AgentDashboard routes | Agent portal |
| `/dashboard/short-stay` | HostDashboard | Short-stay host portal |
| `/professionalDashboard` | ProfessionalDashboard | Professional portal |
| `/admin/*` | Admin pages | Admin command center |
| `/admin/accounts` | AdminAccounts | Account management |
| `/admin/verifications` | AdminVerifications | Verification review |

---

## Next Steps

1. **Audit current database** - Run the SQL query to get exact account counts
2. **Review verification flow** - Test the complete verification process
3. **Identify integration points** - Where does UI need to connect to database
4. **Build missing components** - Start with Priority 1 items
5. **Test end-to-end** - Verify full onboarding flows work
