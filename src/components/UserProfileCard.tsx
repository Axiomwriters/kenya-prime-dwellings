import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { MoreVertical, Eye, Edit, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface UserProfileCardProps {
  onOpenProfile: () => void;
}

export function UserProfileCard({ onOpenProfile }: UserProfileCardProps) {
  const { user, userRole, isAuthenticated, signOut } = useAuth();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const [showRegistration, setShowRegistration] = useState(false);
  const isAgent = userRole === "agent" || userRole === "admin";

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
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 mx-auto bg-gradient-hero text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
                  >
                    <span className="text-xs font-bold">SI</span>
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
      <div className="py-3 pl-2 pr-3">
        <div className="glass-card rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all duration-300">
          <p className="text-sm text-center text-muted-foreground mb-3">
            Sign in to continue
          </p>
          <Link to="/auth">
            <Button
              className="w-full bg-gradient-hero text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
              size="sm"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "user@example.com";
  const userInitials = userName.split(' ').map(n => n[0]).join('');
  const userRoleDisplay = userRole === "agent" ? "Agent" : userRole === "admin" ? "Admin" : "Buyer";
  const isAdminUser = userRole === "admin";

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="py-3 pl-2 pr-3 cursor-pointer" onClick={onOpenProfile}>
              <div className="relative w-9 h-9 mx-auto">
                <div className="absolute inset-0 bg-gradient-hero rounded-full animate-pulse opacity-50"></div>
                <Avatar className="relative w-9 h-9 border-2 border-primary/50 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                  <AvatarFallback className="bg-gradient-hero text-white font-semibold text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="glass-card border-primary/20">
            <div className="text-sm">
              <p className="font-semibold">{userName}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-primary">{userRoleDisplay}</p>
                {isAdminUser && (
                  <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded">Admin</span>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isMobile) {
    return (
      <div className="p-4">
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted border border-primary/20 p-4 shadow-lg"
          onClick={onOpenProfile}
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{userName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">ID: {user?.id?.slice(0, 8) || "Guest"}</span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {userRoleDisplay}
                </span>
              </div>
            </div>

            {/* Mobile Actions Menu */}
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors relative z-20"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-card border-primary/20 bg-background/95 backdrop-blur-xl z-[200]"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProfile();
                    }}
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div
        className="glass-card glass-hover rounded-xl p-4 border border-primary/20 cursor-pointer transition-all duration-300"
        onClick={onOpenProfile}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-hero rounded-full animate-pulse opacity-30"></div>
            <Avatar className="relative w-12 h-12 border-2 border-primary/50 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
              <AvatarFallback className="bg-gradient-hero text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {userName}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-primary truncate">{userRoleDisplay}</p>
              {isAdminUser && (
                <span className="text-xs bg-primary/20 px-1.5 py-0.5 rounded font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>


          {/* Actions Menu */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="glass-card border-primary/20 bg-background/95 backdrop-blur-xl z-[200]"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile();
                }}
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AgentRegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
      />
    </div>
  );
}
