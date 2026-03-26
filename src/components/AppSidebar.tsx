import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  TrendingUp,
  FileText,
  ChevronRight,
  GraduationCap,
  Baby,
  Coins,
  Shield,
  Sparkles,
  Crown,
  Warehouse,
  Building2,
  Compass,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "./ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Compass,
    isCollapsible: true,
    items: [
      {
        title: "Student Housing",
        url: "/explore/student-housing",
        icon: GraduationCap,
      },
      {
        title: "Family Homes",
        url: "/explore/family-homes",
        icon: Baby,
      },
      {
        title: "Investment",
        url: "/explore/investment",
        icon: Coins,
      },
      {
        title: "Gated Communities",
        url: "/explore/gated-communities",
        icon: Shield,
      },
      {
        title: "First-Time Buyers",
        url: "/explore/first-time-buyers",
        icon: Sparkles,
      },
      {
        title: "Luxury Living",
        url: "/explore/luxury-living",
        icon: Crown,
      },
      {
        title: "Warehouses",
        url: "/explore/warehouses",
        icon: Warehouse,
      },
      {
        title: "Mixed-Use",
        url: "/explore/mixed-use",
        icon: Building2,
      },
    ],
  },
  {
    title: "Short Stay",
    url: "/short-stay",
    icon: Home,
  },
  {
    title: "Agents",
    url: "/agent",
    icon: Users,
  },
  {
    title: "Market Trends",
    url: "/market",
    icon: TrendingUp,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

interface AppSidebarProps {
  onOpenProfile: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function AppSidebar({ onOpenProfile, isMobileOpen = false, onMobileToggle }: AppSidebarProps) {
  const location = useLocation();
  const { open: isSidebarOpen, setOpen } = useSidebar();

  // Handle mobile sidebar state
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setOpen(false); // Disable Radix sidebar on mobile
    } else {
      setOpen(true); // Enable Radix sidebar on desktop
    }
  }, [setOpen]);

  // Debug logging
  useEffect(() => {
    console.log('AppSidebar: isMobileOpen =', isMobileOpen);
  }, [isMobileOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsible="icon" variant="inset">
          <SidebarHeader className="h-14 justify-between px-3">
            <img 
              src="/logo.svg" 
              alt="Savanah Dwelling" 
              className={cn("h-6 transition-all duration-300", !isSidebarOpen && "h-8 w-8")} 
            />
            <SidebarTrigger className="[&>svg]:size-5" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.url) && item.url !== "/";
                const isDashboardActive = item.url === "/" && location.pathname === "/";

                if (item.isCollapsible && item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible defaultOpen={isActive}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon />
                            <span className={cn("ml-2 transition-all duration-300", !isSidebarOpen && "opacity-0 w-0")}>
                              {item.title}
                            </span>
                            <ChevronRightIcon className={cn(
                              "ml-auto transition-transform duration-300",
                              !isSidebarOpen && "opacity-0 w-0"
                            )} />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubButton 
                                key={subItem.title} 
                                isActive={location.pathname === subItem.url}
                              >
                                <Link to={subItem.url}>
                                  <subItem.icon />
                                  <span className={cn("ml-2 transition-all duration-300", !isSidebarOpen && "opacity-0 w-0")}>
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isDashboardActive || (isActive && !item.isCollapsible)}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span className={cn("ml-2 transition-all duration-300", !isSidebarOpen && "opacity-0 w-0")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <UserProfileCard onOpenProfile={onOpenProfile} isCollapsed={!isSidebarOpen} />
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Mobile Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-background border-r border-border/50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Savanah Dwelling" className="h-8" />
            <h1 className="text-lg font-bold">Savanah Dwelling</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileToggle}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.url) && item.url !== "/";
            const isDashboardActive = item.url === "/" && location.pathname === "/";

            if (item.isCollapsible && item.items) {
              return (
                <Collapsible key={item.title} defaultOpen={isActive}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 transform transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.url}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
                            location.pathname === subItem.url 
                              ? "bg-accent text-accent-foreground" 
                              : "hover:bg-accent"
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  (isDashboardActive || isActive) 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background/90">
          <UserProfileCard onOpenProfile={onOpenProfile} isCollapsed={false} />
        </div>
      </div>
    </>
  );
}
