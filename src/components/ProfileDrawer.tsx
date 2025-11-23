import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { 
  Home, 
  Heart, 
  Settings, 
  LogOut, 
  X, 
  CheckCircle,
  Calendar,
  Mail,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDrawer({ open, onOpenChange }: ProfileDrawerProps) {
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "user@example.com";
  const userInitials = userName.split(' ').map(n => n[0]).join('');
  const joinedDate = "January 2024"; // This could come from user data
  const isVerified = true; // This could come from user data

  const stats = {
    myListings: 3,
    savedProperties: 12,
    reviews: 5
  };

  const handleLogout = async () => {
    await signOut();
    onOpenChange(false);
    toast.success("Logged out successfully");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent 
        className="h-full w-full sm:w-[420px] ml-auto glass-card border-l border-primary/20 bg-background/95 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 50%, hsl(var(--card)) 100%)',
        }}
      >
        <DrawerHeader className="relative border-b border-primary/10 pb-6">
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
          
          <div className="flex flex-col items-center pt-4">
            {/* Large Avatar */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-hero rounded-full blur-xl opacity-40 animate-pulse"></div>
              <Avatar className="relative w-24 h-24 border-4 border-primary/30 ring-4 ring-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <AvatarFallback className="bg-gradient-hero text-white font-bold text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-lg border-2 border-background">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <DrawerTitle className="text-2xl font-bold text-foreground mb-1">
              {userName}
            </DrawerTitle>
            <DrawerDescription className="flex items-center gap-2 text-muted-foreground mb-2">
              <Mail className="w-4 h-4" />
              {userEmail}
            </DrawerDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinedDate}</span>
            </div>
            {isVerified && (
              <Badge 
                variant="outline" 
                className="mt-3 bg-primary/10 text-primary border-primary/30"
              >
                Verified User
              </Badge>
            )}
          </div>
        </DrawerHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-primary/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.myListings}</div>
            <div className="text-xs text-muted-foreground mt-1">My Listings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.savedProperties}</div>
            <div className="text-xs text-muted-foreground mt-1">Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.reviews}</div>
            <div className="text-xs text-muted-foreground mt-1">Reviews</div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => {
              toast.info("My Listings coming soon!");
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">My Listings</div>
                <div className="text-xs text-muted-foreground">Manage your properties</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => {
              toast.info("Saved Properties coming soon!");
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Saved Properties</div>
                <div className="text-xs text-muted-foreground">Your favorite homes</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => {
              toast.info("Settings coming soon!");
              onOpenChange(false);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Account Settings</div>
                <div className="text-xs text-muted-foreground">Privacy & preferences</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        </div>

        <Separator className="bg-border/50" />

        {/* Footer with Logout */}
        <DrawerFooter className="p-6">
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-hero text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 h-12 text-base font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
