import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/AgentSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import DashboardOverview from "./AgentDashboard/DashboardOverview";
import AgentProfile from "./AgentDashboard/AgentProfile";
import MyListings from "./AgentDashboard/MyListings";
import CreateListing from "./AgentDashboard/CreateListing";
import Notifications from "./AgentDashboard/Notifications";
import AgentSettings from "./AgentDashboard/AgentSettings";
import { cn } from "@/lib/utils";

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
            <HeaderWrapper />
          </div>

          <main className={cn("p-6 transition-all duration-300")}>
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<AgentProfile />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="listings/new" element={<CreateListing />} />
              <Route path="listings/edit/:id" element={<CreateListing />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<AgentSettings />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
