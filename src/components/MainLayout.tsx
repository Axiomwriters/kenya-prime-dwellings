import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { LocationAgentWidget } from "@/components/LocationAgentWidget";

export default function MainLayout() {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
            isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <AppSidebar 
          onOpenProfile={() => setIsProfileOpen(true)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        
        {/* Main Content */}
        <SidebarInset className="w-full">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
            <HeaderWrapper 
              onOpenTrip={() => setIsProfileOpen(true)} 
              isScrolled={isScrolled}
              isMobileSidebarOpen={isMobileSidebarOpen}
              onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            />
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <ProfileDrawer open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      <LocationAgentWidget />
    </SidebarProvider>
  );
}
