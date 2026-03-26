import { useState, cloneElement } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  isMobileSidebarOpen?: boolean;
  onMobileToggle?: () => void;
}

export function DashboardLayout({ sidebar }: DashboardLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // This component no longer relies on the window scroll event.
  // The scroll event is handled by the main content area.

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-background overflow-hidden">
        {cloneElement(sidebar as React.ReactElement, {
          isMobileOpen: isMobileSidebarOpen,
          onMobileToggle: () => setIsMobileSidebarOpen(!isMobileSidebarOpen)
        })}

        <SidebarInset className="flex-1 w-full flex flex-col">
          <div className="shrink-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b">
            <HeaderWrapper 
              isScrolled={isScrolled} 
              hideLogo={true} 
              hideSearchBar={true} 
              hideThemeSwitcher={true} 
              isAgentDashboard={true}
              isMobileSidebarOpen={isMobileSidebarOpen}
              onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            />
          </div>

          <main 
            className={cn("flex-1 overflow-y-auto p-6 lg:p-8")}
            onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 5)}
          >
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
