import { useState } from "react";
import {
  Home,
  MapPin,
  Users,
  TrendingUp,
  Settings,
  FileText,
  X,
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
  const { state } = useSidebar();
  const { isAdmin } = useAuth();
  const isCollapsed = state === "collapsed";
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-primary/10 z-[60] fixed left-0 top-0 bottom-0 h-screen shadow-2xl">
        <SidebarContent className="bg-background/95 backdrop-blur-xl">
          {/* Close Button */}
          <SidebarGroup>
            <div className="px-4 py-4 flex justify-end">
              <button
                onClick={() => {
                  const trigger = document.querySelector('[data-sidebar="trigger"]') as HTMLButtonElement;
                  trigger?.click();
                }}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </SidebarGroup>

          {/* Navigation Menu */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
              Navigation
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

                {/* Admin Dashboard Link - Always visible for testing */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith('/admin')}
                    className={`
                      transition-all duration-200
                      ${location.pathname.startsWith('/admin')
                        ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary'
                        : 'hover:bg-primary/5 hover:text-primary'
                      }
                    `}
                    tooltip={isCollapsed ? "Admin Dashboard" : undefined}
                  >
                    <Link to="/admin" className="flex items-center gap-3">
                      <Shield className={`w-5 h-5 ${location.pathname.startsWith('/admin') ? 'text-primary' : ''}`} />
                      {!isCollapsed && <span>Admin Dashboard</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* User Profile Card at Bottom */}
        <SidebarFooter className="mt-auto border-t border-primary/10 bg-background/95 backdrop-blur-xl">
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
