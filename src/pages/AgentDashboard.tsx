import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/AgentSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Imports from DashboardOverview
import { useAuth } from "@/hooks/useAuth";
import TodaysFocus from "./AgentDashboard/components/TodaysFocus";
import PerformanceRadar from "./AgentDashboard/components/PerformanceRadar";
import MarketIntelligence from "./AgentDashboard/components/MarketIntelligence";
import CRMHub from "./AgentDashboard/components/CRMHub";
import AgencyModeToggle from "./AgentDashboard/components/AgencyModeToggle";
import { EmptyListingState } from "./AgentDashboard/components/command-center/EmptyListingState";
import { AddListingModal } from "./AgentDashboard/components/add-listing-modal/AddListingModal";

const AgentProfile = lazy(() => import("./AgentDashboard/AgentProfile"));
const MyListings = lazy(() => import("./AgentDashboard/MyListings"));
const CreateListing = lazy(() => import("./AgentDashboard/CreateListing"));
const Notifications = lazy(() => import("./AgentDashboard/Notifications"));
const AgentSettings = lazy(() => import("./AgentDashboard/AgentSettings"));
const AgentTripsPanel = lazy(() => import("./AgentDashboard/components/AgentTripsPanel"));

const DashboardOverview = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAddListingOpen, setIsAddListingOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h1 className="text-3xl font-bold mb-1">Command Center</h1>
                <p className="text-muted-foreground">
                    Track your performance and manage your deals.
                </p>
                </div>
                <AgencyModeToggle />
            </div>
            <section>
                <TodaysFocus />
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[400px]">
                <PerformanceRadar />
                <MarketIntelligence />
            </div>
            <section>
                <CRMHub />
            </section>
            <section>
                <EmptyListingState onAddListing={() => setIsAddListingOpen(true)} />
            </section>
            <AddListingModal open={isAddListingOpen} onOpenChange={setIsAddListingOpen} />
        </div>
    );
};

export default function AgentDashboard() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AgentSidebar />

        <SidebarInset className="flex-1 w-full relative">
          <div className="sticky top-0 z-50 w-full transition-all duration-300">
            <HeaderWrapper isScrolled={isScrolled} hideLogo={true} hideSearchBar={true} hideThemeSwitcher={false} />
          </div>

          <main className={cn("p-6 transition-all duration-300")}>
            <Suspense fallback={
              <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="profile" element={<AgentProfile />} />
                <Route
                path="listings"
                element={
                <ProtectedRoute requiredRole="agent">
                  <MyListings />
                </ProtectedRoute>
              }
                />
                <Route path="listings/new" element={<CreateListing />} />
                <Route path="listings/edit/:id" element={<CreateListing />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="trips" element={<AgentTripsPanel />} />
                <Route
                 path="settings"
                element={
                  <ProtectedRoute requiredRole="agent">
                    <AgentSettings />
                  </ProtectedRoute>
                }
                />
              </Routes>
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}