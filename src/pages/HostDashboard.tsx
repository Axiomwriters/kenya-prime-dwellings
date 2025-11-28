import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HostSidebar } from "@/components/HostSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import DashboardOverview from "./HostDashboard/DashboardOverview";
import Properties from "./HostDashboard/Properties";
import AddProperty from "./HostDashboard/AddProperty";
import CalendarSync from "./HostDashboard/CalendarSync";
import Reservations from "./HostDashboard/Reservations";
import AutoReply from "./HostDashboard/AutoReply";
import Operations from "./HostDashboard/Operations";
import Financials from "./HostDashboard/Financials";
import Insights from "./HostDashboard/Insights";
import Integrations from "./HostDashboard/Integrations";
import Guidebook from "./HostDashboard/Guidebook";
import Team from "./HostDashboard/Team";

// Placeholder components for now
const UnifiedInbox = () => <div>Inbox Page</div>;
const Settings = () => <div>Settings Page</div>;

export default function HostDashboard() {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <HostSidebar />

                <SidebarInset className="flex-1 w-full">
                    <HeaderWrapper />

                    <main className="p-6">
                        <Routes>
                            <Route index element={<DashboardOverview />} />
                            <Route path="properties" element={<Properties />} />
                            <Route path="properties/new" element={<AddProperty />} />
                            <Route path="properties/edit/:id" element={<AddProperty />} />
                            <Route path="calendar" element={<CalendarSync />} />
                            <Route path="inbox" element={<UnifiedInbox />} />
                            <Route path="reservations" element={<Reservations />} />
                            <Route path="automation" element={<AutoReply />} />
                            <Route path="operations" element={<Operations />} />
                            <Route path="financials" element={<Financials />} />
                            <Route path="insights" element={<Insights />} />
                            <Route path="integrations" element={<Integrations />} />
                            <Route path="guidebook" element={<Guidebook />} />
                            <Route path="team" element={<Team />} />
                            <Route path="settings" element={<Settings />} />
                        </Routes>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
