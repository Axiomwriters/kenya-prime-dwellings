import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import TodaysFocus from "./components/TodaysFocus";
import PerformanceRadar from "./components/PerformanceRadar";
import MarketIntelligence from "./components/MarketIntelligence";
import CRMHub from "./components/CRMHub";
import AgencyModeToggle from "./components/AgencyModeToggle";
import { EmptyListingState } from "./components/command-center/EmptyListingState";
import { AddListingModal } from "./components/add-listing-modal/AddListingModal";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);

  useEffect(() => {
    // Simulate loading for effect
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
      {/* Header with Agency Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Command Center</h1>
          <p className="text-muted-foreground">
            Track your performance and manage your deals.
          </p>
        </div>
        <AgencyModeToggle />
      </div>

      {/* 1. Today's Focus (Hero Section) */}
      <section>
        <TodaysFocus />
      </section>

      {/* 2. Performance & Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[400px]">
        <PerformanceRadar />
        <MarketIntelligence />
      </div>

      {/* 3. CRM Hub */}
      <section>
        <CRMHub />
      </section>

      {/* 4. Agent Success Roadmap (Moved from My Listings) */}
      <section>
        <EmptyListingState onAddListing={() => setIsAddListingOpen(true)} />
      </section>

      <AddListingModal open={isAddListingOpen} onOpenChange={setIsAddListingOpen} />
    </div>
  );
}
