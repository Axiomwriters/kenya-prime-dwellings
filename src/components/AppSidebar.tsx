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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
}

export function AppSidebar({ onOpenProfile }: AppSidebarProps) {
  const location = useLocation();
  const { open: isSidebarOpen } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <img src="/logo.svg" alt="Savanah" className={cn("h-6", !isSidebarOpen && "sr-only")} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.url) && item.url !== "/";
            const isDashboardActive = item.url === "/" && location.pathname === "/";

            if (item.isCollapsible && item.items) {
              return (
                <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-2 space-y-2">
                      <SidebarMenu>
                        {item.items.map((subItem) => {
                          const isSubActive = location.pathname === subItem.url;
                          return (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild isActive={isSubActive}>
                                <Link to={subItem.url}>
                                  <subItem.icon className="w-4 h-4 opacity-70" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isDashboardActive || (isActive && !item.isCollapsible)}>
                  <Link to={item.url}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
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
  );
}
