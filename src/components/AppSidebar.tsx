import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  MapPin,
  Users,
  TrendingUp,
  Settings,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserProfileCard } from "@/components/UserProfileCard";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Properties",
    url: "/properties",
    icon: MapPin,
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
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const { isAdmin } = useAuth();
  const isCollapsed = state === "collapsed" && !isMobile;
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Sidebar
        collapsible="icon"
        className={cn(
          "border-r border-primary/10 z-50 fixed left-0 shadow-2xl transition-all duration-75",
          isScrolled ? "top-[64px] h-[calc(100vh-64px)]" : "top-[104px] h-[calc(100vh-104px)]"
        )}
      >
        <SidebarContent className={cn(
          "bg-background/95 backdrop-blur-xl",
          isMobile ? "pt-6" : "pt-9"
        )}>
          {/* Navigation Menu */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
              <div className="flex items-center justify-between w-full">
                <span>Navigation</span>
                <button
                  onClick={() => {
                    const trigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
                    trigger?.click();
                  }}
                  className="hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          transition-all duration-200
                          ${isActive
                            ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary'
                            : 'hover:bg-primary/5 hover:text-primary'
                          }
                        `}
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                          {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* Testing Links - Always visible for usability testing */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/agent')}
                    className={`
                      transition-all duration-200
                      ${location.pathname.startsWith('/agent')
                        ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary'
                        : 'hover:bg-primary/5 hover:text-primary'
                      }
                    `}
                    tooltip={isCollapsed ? "Agent Dashboard" : undefined}
                  >
                    <Link to="/agent" className="flex items-center gap-3">
                      <Users className={`w-5 h-5 ${location.pathname.startsWith('/agent') ? 'text-primary' : ''}`} />
                      {!isCollapsed && <span>Agent Dashboard</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/professional')}
                    className={`
                      transition-all duration-200
                      ${location.pathname.startsWith('/professional')
                        ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary'
                        : 'hover:bg-primary/5 hover:text-primary'
                      }
                    `}
                    tooltip={isCollapsed ? "Professional Dashboard" : undefined}
                  >
                    <Link to="/professional" className="flex items-center gap-3">
                      <Users className={`w-5 h-5 ${location.pathname.startsWith('/professional') ? 'text-primary' : ''}`} />
                      {!isCollapsed && <span>Professional Dashboard</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/host')}
                    className={`
                      transition-all duration-200
                      ${location.pathname.startsWith('/host')
                        ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary'
                        : 'hover:bg-primary/5 hover:text-primary'
                      }
                    `}
                    tooltip={isCollapsed ? "Host Dashboard" : undefined}
                  >
                    <Link to="/host" className="flex items-center gap-3">
                      <Home className={`w-5 h-5 ${location.pathname.startsWith('/host') ? 'text-primary' : ''}`} />
                      {!isCollapsed && <span>Host Dashboard</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile Card at Bottom */}
        <SidebarFooter className="mt-auto border-t border-primary/10 bg-background/95 backdrop-blur-xl p-0">
          <UserProfileCard onOpenProfile={() => setIsProfileDrawerOpen(true)} />
        </SidebarFooter>
      </Sidebar>

      {/* Profile Drawer */}
      <ProfileDrawer
        open={isProfileDrawerOpen}
        onOpenChange={setIsProfileDrawerOpen}
      />
    </>
  );
}
