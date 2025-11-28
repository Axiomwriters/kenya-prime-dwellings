import { SidebarProvider } from "@/components/ui/sidebar";
import { HostSidebar } from "@/components/HostSidebar";
import { Outlet } from "react-router-dom";

export default function HostDashboardLayout() {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-50/50">
                <HostSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
