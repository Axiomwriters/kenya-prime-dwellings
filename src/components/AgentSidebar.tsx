import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  User,
  Home as HomeIcon,
  Map,
  Bell,
  Settings,
  ArrowLeft,
  HelpCircle,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SponsoredSpotlight } from "./agent-sidebar-widgets/SponsoredSpotlight";
import { AccountTierWidget } from "./agent-sidebar-widgets/AccountTierWidget";

const mainItems = [
  { title: "Dashboard", url: ".", icon: LayoutDashboard },
  { title: "My Profile", url: "profile", icon: User },
  { title: "My Listings", url: "listings", icon: HomeIcon },
  { title: "Trips & Viewings", url: "trips", icon: Map },
  { title: "Notifications", url: "notifications", icon: Bell },
  { title: "Settings", url: "settings", icon: Settings },
];

const supportItems = [
    { title: "Help Center", url: "help-center", icon: HelpCircle },
    { title: "Contact Support", url: "mailto:support@savanahdwelling.com", icon: Mail },
];

interface AgentSidebarContentProps {
  onNavigate?: () => void;
}

interface AgentSidebarProps {
  onNavigate?: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function AgentSidebarContent({ onNavigate }: AgentSidebarContentProps = {}) {
  const { user, isLoaded } = useUser();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) fetchCounts();
  }, [user]);

  const fetchCounts = async () => {
    // ... (fetch logic remains the same)
  };

  if (!isLoaded) return null;

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full overflow-hidden">
      <div className="flex justify-center px-6 py-5 border-b shrink-0">
        <img
          src="/Savanahdwell.png"
          alt="Savanah Dwelling"
          className="h-14 object-contain"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Agent Dashboard
          </p>
          {mainItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "."} // Ensures only exact match for Dashboard
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{item.title}</span>
              {item.title === "My Listings" && pendingCount > 0 && (
                <Badge className="ml-auto bg-yellow-500 text-white text-xs">
                  {pendingCount}
                </Badge>
              )}
              {item.title === "Notifications" && unreadCount > 0 && (
                <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </NavLink>
          ))}
          
          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Help & Support
          </p>
          {supportItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.title}</span>
            </a>
          ))}
        </nav>
        <div className="px-3 py-4 space-y-3 border-t">
          <SponsoredSpotlight />
          <AccountTierWidget />
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      </div>
      <div className="shrink-0 border-t px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <UserButton />
          <div className="flex-1 min-w-0 text-left text-sm leading-tight">
            <p className="truncate font-semibold">
              {user?.fullName || user?.firstName || "Agent"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentSidebar({ onNavigate, isMobileOpen = false, onMobileToggle }: AgentSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AgentSidebarContent onNavigate={onNavigate} />
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
            <img src="/Savanahdwell.png" alt="Savanah Dwelling" className="h-8" />
            <h1 className="text-lg font-bold">Agent Dashboard</h1>
          </div>
          <button
            onClick={onMobileToggle}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Agent Dashboard
            </p>
            {mainItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "."}
                onClick={() => {
                  onNavigate?.();
                  onMobileToggle?.();
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
            
            <p className="px-2 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Help & Support
            </p>
            {supportItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                onClick={() => {
                  onNavigate?.();
                  onMobileToggle?.();
                }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
                  "hover:bg-accent"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background/90">
          <div className="space-y-3">
            <SponsoredSpotlight />
            <AccountTierWidget />
            <Link
              to="/"
              onClick={() => {
                onNavigate?.();
                onMobileToggle?.();
              }}
              className="flex items-center gap-3 p-3 rounded-lg text-sm transition-colors hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onMobileToggle}
      />
    </>
  );
}
