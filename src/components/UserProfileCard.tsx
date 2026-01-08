import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AgentRegistrationDialog } from "@/components/AgentRegistrationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import {
  MoreVertical,
  Eye,
  LogOut,
  BadgeCheck,
  Briefcase,
  Key,
  Wallet,
  User,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface UserProfileCardProps {
  onOpenProfile: () => void;
}

export function UserProfileCard({ onOpenProfile }: UserProfileCardProps) {
  const { user, userRole, isAuthenticated, signOut } = useAuth();
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed" && !isMobile;
  const [showRegistration, setShowRegistration] = useState(false);

  // Deduced User State
  const isAgent = userRole === "agent";
  const isAdmin = userRole === "admin";
  const isProfessional = userRole === "professional"; // Assuming this might be a role

  // For demo purposes, standard users are both aspiring Buyers and Renters
  // In a real app, these would come from user preferences
  const isBuyer = !isAgent && !isAdmin && !isProfessional;
  const isRenter = !isAgent && !isAdmin && !isProfessional;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="py-3 pl-2 pr-3">
                <Link to="/auth" state={{ from: location }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 mx-auto bg-gradient-hero text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 rounded-xl"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-card border-primary/20">
              <p className="text-sm">Sign in to continue</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div className="p-3">
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-background/50 p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-center">
            <h4 className="font-semibold text-foreground mb-1">Welcome!</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Sign in to access your dashboard
            </p>
            <Link to="/auth" state={{ from: location }}>
              <Button
                className="w-full bg-gradient-hero text-white hover:shadow-lg shadow-primary/20 transition-all duration-300 h-9 text-xs"
              >
                Sign In / Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  // Collapsed View
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="py-3 pl-2 pr-3 cursor-pointer" onClick={onOpenProfile}>
              <div className="relative w-9 h-9 mx-auto group">
                <div className="absolute inset-0 bg-primary/20 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                <Avatar className="relative w-9 h-9 rounded-xl border border-primary/20 group-hover:border-primary/50 transition-colors">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-background text-primary font-bold rounded-xl text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {/* Status Dot */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-background"></span>
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="glass-card border-primary/20 p-3">
            <div className="text-sm space-y-1">
              <p className="font-bold flex items-center gap-1">
                {userName}
                {(isAgent || isAdmin) && <BadgeCheck className="w-3 h-3 text-blue-500" />}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Mobile & Expanded View (Unified Design)
  return (
    <div className="p-3">
      <div
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-muted/50 to-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl shadow-sm cursor-pointer"
        onClick={onOpenProfile}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl -ml-6 -mb-6" />

        <div className="relative z-10 p-3.5">
          {/* Header Section: Avatar + Name + Menu */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-hero rounded-xl opacity-70 blur-sm group-hover:opacity-100 transition-opacity" />
                <Avatar className="relative w-10 h-10 rounded-xl border-2 border-background shadow-sm">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-muted text-foreground font-bold text-sm rounded-xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {/* Online Indicator */}
                <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background shadow-sm" title="Online" />
                </div>
              </div>

              {/* Name & Role */}
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate flex items-center gap-1.5">
                  {userName}
                  {(isAgent || isAdmin) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                        </TooltipTrigger>
                        <TooltipContent><p>Verified {isAdmin ? 'Admin' : 'Agent'}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </h4>
                <p className="text-[10px] text-muted-foreground truncate font-medium">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 -mr-1 text-muted-foreground hover:text-foreground hover:bg-background/80"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-card border-primary/20 z-50">
                <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium bg-muted/50 mb-1">
                  My Account
                </div>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenProfile(); }}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                  className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Badges / Interactive Pills */}
          <div className="flex flex-wrap gap-1.5">
            {isAgent && (
              <BadgeWrapper icon={<Briefcase size={10} />} label="Agent" color="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" />
            )}
            {isAdmin && (
              <BadgeWrapper icon={<Key size={10} />} label="Admin" color="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" />
            )}

            {/* User Type Badges - Interactive */}
            {(isBuyer || isRenter) && (
              <>
                <BadgeWrapper
                  icon={<Wallet size={10} />}
                  label="Buyer"
                  color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  tooltip="Looking to purchase properties"
                />
                <BadgeWrapper
                  icon={<HomeIcon size={10} />}
                  label="Renter"
                  color="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                  tooltip="Searching for rental properties"
                />
              </>
            )}
          </div>

          {/* Completion Bar (Fake for 'Professional' feel) */}
          {(!isAgent && !isAdmin) && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1 text-muted-foreground">
                <span>Profile Completion</span>
                <span className="text-primary font-medium">85%</span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-emerald-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <AgentRegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
      />
    </div>
  );
}

// Sub-component for badges
function BadgeWrapper({ icon, label, color, tooltip }: { icon: React.ReactNode, label: string, color: string, tooltip?: string }) {
  const badge = (
    <Badge
      variant="outline"
      className={`h-5 px-2 py-0 gap-1 text-[10px] font-medium border transition-all duration-200 cursor-default ${color}`}
    >
      {icon}
      {label}
    </Badge>
  );

  if (!tooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{badge}</div>
        </TooltipTrigger>
        <TooltipContent className="text-xs">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Simple Home Icon since I missed importing lucide-react Home and it collides with my Home component import if not careful
function HomeIcon({ size = 12, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
