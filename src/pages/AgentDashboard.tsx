import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/AgentSidebar";
import { TopHeaderBar } from "@/components/TopHeaderBar";
import { DashboardHeader } from "@/components/DashboardHeader";
import DashboardOverview from "./AgentDashboard/DashboardOverview";
import AgentProfile from "./AgentDashboard/AgentProfile";
import MyListings from "./AgentDashboard/MyListings";
import CreateListing from "./AgentDashboard/CreateListing";
import Notifications from "./AgentDashboard/Notifications";
import AgentSettings from "./AgentDashboard/AgentSettings";

export default function AgentDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AgentSidebar />
        
        <SidebarInset className="flex-1 overflow-x-hidden">
          <TopHeaderBar />
          <DashboardHeader />
          
          <main className="p-6">
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
