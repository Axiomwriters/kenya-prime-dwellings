
// src/App.tsx — CORRECTED FILE
import { useState, useEffect, Suspense } from "react";
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
import Dashboard from "./pages/Dashboard";
import ExplorePage from "./pages/ExplorePage";
import BecomeAgent from "./pages/BecomeAgent";
import HydrateData from "./pages/HydrateData";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import AffordabilityPage from "./pages/AffordabilityPage";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AgentDashboard from "./pages/AgentDashboard";
import NewAgentDashboard from "./pages/AgentDashboard/NewAgentDashboard";
import AgentProfile from "./pages/AgentProfile";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import HostDashboard from "./pages/HostDashboard";
import MainLayout from "@/components/MainLayout";
import UserProfileSettings from "./pages/UserProfileSettings";
import SavedProperties from "./pages/SavedProperties";
import AccountSettings from "./pages/AccountSettings";
import BuildingMaterialsShop from "./pages/Shop/BuildingMaterialsShop";
import ShortStayLayout from "@/components/layouts/ShortStayLayout";
import ShortStaySearch from "./pages/ShortStay/ShortStaySearch";
import ShortStayDetails from "./pages/ShortStay/ShortStayDetails";
import BookingCheckout from "./pages/ShortStay/BookingCheckout";
import BookingConfirmation from "./pages/ShortStay/BookingConfirmation";
import GuestDashboard from "./pages/ShortStay/GuestDashboard";
import TripDetails from "./pages/ShortStay/TripDetails";
import ProfessionalLanding from "./pages/ProfessionalLanding";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import SSOCallback from "./pages/SSOCallback";
import SyncPage from './pages/onboarding/sync';
import RedirectPage from './pages/Redirect';

const queryClient = new QueryClient();

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
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AuthProvider>
                  <ScrollToTopHandler />
                  <ScrollToTop />

                  <ErrorBoundary fallback={<div>Something went wrong. Please refresh.</div>}>
                    <Suspense fallback={<Preloader />}>
                      <Routes>
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

                        {/* --- Account Routes --- */}
                        <Route path="/profile/settings" element={<UserProfileSettings />} />
                        <Route path="/saved-properties" element={<SavedProperties />} />
                        <Route path="/account/settings" element={<AccountSettings />} />
                        <Route path="/agents/profile/:id" element={<AgentProfile />} />

                        {/* --- Protected Dashboards --- */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/professionalDashboard" element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>} />
                        <Route path="/become-agent" element={<ProtectedRoute><BecomeAgent /></ProtectedRoute>} />
                        <Route path="/dashboard/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
                        <Route path="/agent/dashboard" element={<ProtectedRoute><NewAgentDashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/short-stay" element={<ProtectedRoute><HostDashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/tenant" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

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
              </BrowserRouter>
            </LocationAgentProvider>
          </TripProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
