import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { LocationAgentWidget } from "@/components/LocationAgentWidget";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function MainLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider open={isDesktop}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar onOpenProfile={() => setIsProfileOpen(true)} />
        <SidebarInset className="w-full">
          <header className="sticky top-0 z-40 border-b">
            <HeaderWrapper onOpenTrip={() => setIsProfileOpen(true)} isScrolled={isScrolled} />
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <ProfileDrawer open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <LocationAgentWidget />
    </SidebarProvider>
  );
}
