import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { LocationAgentWidget } from "@/components/LocationAgentWidget";

export default function MainLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar onOpenProfile={() => setIsProfileOpen(true)} />
        <SidebarInset>
          <header className="sticky top-0 z-40 border-b">
            <HeaderWrapper onOpenTrip={() => setIsProfileOpen(true)} />
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <ProfileDrawer open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <LocationAgentWidget />
    </SidebarProvider>
  );
}
