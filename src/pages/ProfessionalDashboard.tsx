import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfessionalSidebar } from "@/components/ProfessionalSidebar";
import { TopHeaderBar } from "@/components/TopHeaderBar";
import { DashboardHeader } from "@/components/DashboardHeader";
import DashboardOverview from "./AgentDashboard/DashboardOverview"; // Reusing for now, will need specific one later
import AgentProfile from "./AgentDashboard/AgentProfile"; // Reusing for now
import Notifications from "./AgentDashboard/Notifications"; // Reusing for now
import AgentSettings from "./AgentDashboard/AgentSettings"; // Reusing for now

export default function ProfessionalDashboard() {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <ProfessionalSidebar />

                <SidebarInset className="flex-1 overflow-x-hidden">
                    <TopHeaderBar />
                    <DashboardHeader />

                    <main className="p-6">
                        <Routes>
                            <Route index element={<DashboardOverview />} />
                            <Route path="profile" element={<AgentProfile />} />
                            <Route path="services" element={<div className="p-4">Services Management (Coming Soon)</div>} />
                            <Route path="projects" element={<div className="p-4">Projects Portfolio (Coming Soon)</div>} />
                            <Route path="requests" element={<div className="p-4">Service Requests (Coming Soon)</div>} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="settings" element={<AgentSettings />} />
                        </Routes>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
