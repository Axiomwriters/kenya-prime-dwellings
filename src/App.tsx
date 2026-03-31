import { useState, useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Preloader } from "@/components/Preloader";
import { ScrollToTopHandler } from "@/components/ScrollToTopHandler";
import { ScrollToTop } from "@/components/ScrollToTop";
import { TripProvider } from "@/contexts/TripContext";
import { LocationAgentProvider } from "@/contexts/LocationAgentContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { agentRoutes } from "@/routes/agentRoutes";

// Layouts
import MainLayout from "@/components/MainLayout";
import ShortStayLayout from "@/components/layouts/ShortStayLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AgentSidebar } from "@/components/AgentSidebar";
import { AdminSidebar } from "@/components/AdminSidebarNew";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";

// Page Components
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminAccounts = lazy(() => import("./pages/Admin/AdminAccounts"));
const AdminVerifications = lazy(() => import("./pages/Admin/AdminVerifications"));
const AdminListings = lazy(() => import("./pages/Admin/AdminListings"));
const AdminTrips = lazy(() => import("./pages/Admin/AdminTrips"));
const AdminViewings = lazy(() => import("./pages/Admin/AdminViewings"));
const AdminAgents = lazy(() => import("./pages/Admin/AdminAgents"));
const AdminLandlords = lazy(() => import("./pages/Admin/AdminLandlords"));
const AdminAgencies = lazy(() => import("./pages/Admin/AdminAgencies"));
const AdminHosts = lazy(() => import("./pages/Admin/AdminHosts"));
const AdminInsights = lazy(() => import("./pages/Admin/AdminInsights"));
const AdminReports = lazy(() => import("./pages/Admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings"));
const AffordabilityPage = lazy(() => import("./pages/AffordabilityPage"));
const AgentProfile = lazy(() => import("./pages/AgentProfile"));
const Auth = lazy(() => import("./pages/Auth"));
const BecomeAgent = lazy(() => import("./pages/BecomeAgent"));
const BookingCheckout = lazy(() => import("./pages/ShortStay/BookingCheckout"));
const BookingConfirmation = lazy(() => import("./pages/ShortStay/BookingConfirmation"));
const BuildingMaterialsShop = lazy(() => import("./pages/Shop/BuildingMaterialsShop"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const GuestDashboard = lazy(() => import("./pages/ShortStay/GuestDashboard"));
const HostDashboard = lazy(() => import("./pages/HostDashboard"));
const HydrateData = lazy(() => import("./pages/HydrateData"));
const Listings = lazy(() => import("./pages/Listings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfessionalDashboard = lazy(() => import("./pages/ProfessionalDashboard"));
const ProfessionalLanding = lazy(() => import("./pages/ProfessionalLanding"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const RedirectPage = lazy(() => import('./pages/Redirect'));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SSOCallback = lazy(() => import("./pages/SSOCallback"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const ShortStayDetails = lazy(() => import("./pages/ShortStay/ShortStayDetails"));
const ShortStaySearch = lazy(() => import("./pages/ShortStay/ShortStaySearch"));
const SignInPage = lazy(() => import("./pages/SignIn"));
const SignUpPage = lazy(() => import("./pages/SignUp"));
const SyncPage = lazy(() => import('./pages/onboarding/sync'));
const TripDetails = lazy(() => import("./pages/ShortStay/TripDetails"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const UserProfileSettings = lazy(() => import("./pages/UserProfileSettings"));
const VerificationPage = lazy(() => import("./pages/Verification/VerificationPage"));
const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
const AdminEmailConfirmations = lazy(() => import("./pages/Admin/AdminEmailConfirmations"));
const OnboardingDemo = lazy(() => import("./pages/OnboardingDemo"));

const queryClient = new QueryClient();

// Main App Routes (with Clerk Auth)
function MainApp() {
  return (
    <AuthProvider>
      <ScrollToTopHandler />
      <ScrollToTop />
      <ErrorBoundary fallback={<div>Something went wrong. Please refresh.</div>}>
        <Suspense fallback={<Preloader />}>
          <Routes>
            {/* --- Admin Routes --- */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><DashboardLayout sidebar={<AdminSidebar isMobileOpen={false} onMobileToggle={() => {}} />} showHeader={false} /></AdminProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="verifications" element={<AdminVerifications />} />
              <Route path="email-confirmations" element={<AdminEmailConfirmations />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="trips" element={<AdminTrips />} />
              <Route path="viewings" element={<AdminViewings />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="landlords" element={<AdminLandlords />} />
              <Route path="agencies" element={<AdminAgencies />} />
              <Route path="hosts" element={<AdminHosts />} />
              <Route path="insights" element={<AdminInsights />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/" element={<Navigate to="/professional" replace />} />
            <Route path="/professional" element={<ProfessionalLanding />} />

            {/* --- Main Layout Routes --- */}
            <Route element={<MainLayout />}>
              <Route path="/explore/:category" element={<ExplorePage />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<PropertyDetail />} />
              <Route path="/affordability" element={<AffordabilityPage />} />
              <Route path="/shop/building-materials" element={<BuildingMaterialsShop />} />
            </Route>

            {/* --- Auth Routes --- */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset" element={<ResetPassword />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/sso-callback" element={<SSOCallback />} />
            <Route path="/redirect" element={<RedirectPage />} />
            <Route path="/onboarding/sync" element={<SyncPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/onboarding-demo" element={<OnboardingDemo />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/email-confirmed" element={<EmailConfirmation />} />

            {/* --- Account Routes --- */}
            <Route path="/profile/settings" element={<UserProfileSettings />} />
            <Route path="/saved-properties" element={<SavedProperties />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/agents/profile/:id" element={<AgentProfile />} />

            {/* --- Legacy/Protected Dashboards --- */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/professionalDashboard" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
            <Route path="/become-agent" element={<ProtectedRoute><BecomeAgent /></ProtectedRoute>} />
            <Route path="/dashboard/short-stay" element={<ProtectedRoute><HostDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/tenant" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* --- Scalable Agent Dashboard --- */}
            <Route path="/agent" element={<ProtectedRoute><DashboardLayout sidebar={<AgentSidebar isMobileOpen={false} onMobileToggle={() => {}} />} /></ProtectedRoute>}>
              {agentRoutes.map((route, index) => (
                <Route key={index} index={route.index} path={route.path} element={route.element} />
              ))}
            </Route>

            {/* --- Short Stay Routes --- */}
            <Route path="/short-stay" element={<ShortStayLayout />}>
              <Route index element={<ShortStaySearch />} />
              <Route path=":id" element={<ShortStayDetails />} />
              <Route path="book/:id" element={<BookingCheckout />} />
              <Route path="confirmation" element={<BookingConfirmation />} />
              <Route path="trips" element={<GuestDashboard />} />
              <Route path="trips/:id" element={<TripDetails />} />
            </Route>

            {/* --- Utility & Fallback --- */}
            <Route path="/hydrate" element={<HydrateData />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <TripProvider>
            <LocationAgentProvider>
              {isLoading && <Preloader />}
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <MainApp />
              </BrowserRouter>
            </LocationAgentProvider>
          </TripProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
