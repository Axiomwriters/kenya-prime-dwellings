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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [showRegistration, setShowRegistration] = useState(false);
  const isAgent = userRole === "agent" || userRole === "admin";

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return (
      <div className="p-3">
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
            <div className="p-3 cursor-pointer" onClick={onOpenProfile}>
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 bg-gradient-hero rounded-full animate-pulse opacity-50"></div>
                <Avatar className="relative w-12 h-12 border-2 border-primary/50 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                  <AvatarFallback className="bg-gradient-hero text-white font-semibold">
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
          <DropdownMenu>
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
              className="glass-card border-primary/20 bg-background/95 backdrop-blur-xl"
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
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info("Edit profile coming soon!");
                }}
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              {!isAgent && (
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    setShowRegistration(true);
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Become an Agent
                  </DropdownMenuItem>
                </>
              )}
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
