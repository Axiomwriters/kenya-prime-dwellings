import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Baby, // For Family Homes
  Coins, // For Investment
  Shield, // For Gated Communities
  Sparkles, // For First-Time Buyers
  Crown, // For Luxury Living
  Warehouse, // For Warehouses
  Building2, // For Mixed-Use
  Compass,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Explore", // Renamed from Properties
    url: "/properties",
    icon: Compass, // Changed icon to Compass to represent exploration
    isCollapsible: true, // Flag to identify dropdown
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
    ]
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
  isScrolled: boolean;
  onOpenProfile: () => void;
}

export function AppSidebar({ isScrolled, onOpenProfile }: AppSidebarProps) {
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const { isAdmin } = useAuth();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <>
      <Sidebar
        collapsible="icon"
        className={cn(
          "border-r border-primary/10 z-50 fixed left-0 shadow-2xl transition-all duration-150 ease-out",
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
                  const isActive = location.pathname.startsWith(item.url) && item.url !== '/';
                  // Dashboard special case
                  const isDashboardActive = item.url === '/' && location.pathname === '/';

                  if (item.isCollapsible && item.items) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={isCollapsed ? item.title : undefined}
                              className={cn(
                                "transition-all duration-200 group-data-[state=open]/collapsible:bg-primary/5",
                                isActive ? 'text-primary' : 'hover:bg-primary/5 hover:text-primary'
                              )}
                            >
                              <item.icon className="w-5 h-5" />
                              {!isCollapsed && (
                                <>
                                  <span>{item.title}</span>
                                  <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </>
                              )}
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => {
                                const isSubActive = location.pathname === subItem.url || location.search.includes(subItem.url.split('?')[1] || 'non-existent-param');
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className={cn(
                                        "transition-all duration-200",
                                        isSubActive ? 'text-primary font-medium bg-primary/10' : 'hover:text-primary'
                                      )}
                                    >
                                      <Link to={subItem.url} className="flex items-center gap-2">
                                        <subItem.icon className="w-4 h-4 opacity-70" />
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isDashboardActive || (isActive && !item.isCollapsible)}
                        className={`
                          transition-all duration-200
                          ${(isDashboardActive || (isActive && !item.isCollapsible))
                            ? 'bg-primary/10 text-primary hover:bg-primary/15 font-semibold border-l-2 border-primary'
                            : 'hover:bg-primary/5 hover:text-primary'
                          }
                        `}
                        tooltip={isCollapsed ? item.title : undefined}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${(isDashboardActive || (isActive && !item.isCollapsible)) ? 'text-primary' : ''}`} />
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
          <UserProfileCard onOpenProfile={onOpenProfile} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
