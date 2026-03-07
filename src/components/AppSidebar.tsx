import { cn } from "@/lib/utils";


import {
  Home,
  Users,
  TrendingUp,
  FileText,
  ChevronLeft,
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
import { useSidebar } from "./ui/sidebar";

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
  const { isAdmin } = useAuth();
  const { open: isOpen, toggleSidebar } = useSidebar();
  const isCollapsed = !isOpen;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-background/95 backdrop-blur-xl border-r border-primary/10 shadow-2xl z-50 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <span className={cn("font-bold text-lg", isCollapsed && "sr-only")}>Savanah</span>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <nav className="flex-1 px-2 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.url) && item.url !== "/";
            const isDashboardActive = item.url === "/" && location.pathname === "/";

            if (item.isCollapsible && item.items) {
              return (
                <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                  <>
                    <CollapsibleTrigger asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center justify-between w-full p-2 rounded-md transition-all duration-200",
                          isActive ? "text-primary" : "hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </Link>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-2 space-y-2">
                      {item.items.map((subItem) => {
                        const isSubActive = location.pathname === subItem.url;
                        return (
                          <Link
                            key={subItem.title}
                            to={subItem.url}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-md transition-all duration-200",
                              isSubActive ? "text-primary font-medium bg-primary/10" : "hover:text-primary"
                            )}
                          >
                            <subItem.icon className="w-4 h-4 opacity-70" />
                            <span>{subItem.title}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-all duration-200",
                  (isDashboardActive || (isActive && !item.isCollapsible))
                    ? "bg-primary/10 text-primary hover:bg-primary/15 font-semibold"
                    : "hover:bg-primary/5 hover:text-primary"
                )}
              >
                <item.icon className={cn("w-5 h-5", (isDashboardActive || (isActive && !item.isCollapsible)) && "text-primary")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-2">
          <UserProfileCard onOpenProfile={onOpenProfile} isCollapsed={isCollapsed} />
        </div>
      </div>
    </aside>
  );
}
