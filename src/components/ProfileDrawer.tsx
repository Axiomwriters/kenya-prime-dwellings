import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Settings, X, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import new widgets
import { IdentityCard } from "./profile-drawer/IdentityCard";
import { ViewingTrips } from "./profile-drawer/ViewingTrips";
import { PaymentsCenter } from "./profile-drawer/PaymentsCenter";
import { AiChatHistory } from "./profile-drawer/AiChatHistory";
import { PropertyIntelligence } from "./profile-drawer/PropertyIntelligence";
import { FinancingGateway, SavedAssets, SmartNotifications } from "./profile-drawer/DashboardWidgets";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDrawer({ open, onOpenChange }: ProfileDrawerProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user && open) {
      fetchProfileData();
    }
  }, [user, open]);

  const fetchProfileData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      // console.error('Error fetching profile data:', error);
    }
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    // Prevent any default behavior/bubbling if event is passed
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Sign Out initiated");

    try {
      // Close drawer immediately for immediate feedback
      onOpenChange(false);

      // Perform sign out
      await signOut();

      toast.success("Logged out successfully");
      // Navigation is handled within signOut, but as a safety net:
      if (window.location.pathname !== '/auth') {
        navigate('/auth');
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback
      window.location.href = '/auth';
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className="flex flex-col h-full w-full sm:w-[450px] ml-auto !border-l-0 !border-none bg-background/95 backdrop-blur-2xl shadow-2xl pt-0"
      >
        <div className="flex-none pt-10 pb-2 px-6 border-b border-border/40 relative z-10 bg-background/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 mt-2">
              My Real Estate Hub
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6" className="space-y-6 pb-20">
          {/* 1. Identity & Trust Layer */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IdentityCard user={user} profile={profile} />
          </section>

          {/* 2. Primary Block: Trips & Viewings */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <ViewingTrips />
          </section>

          {/* 3. Payments Center */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <PaymentsCenter />
          </section>

          <Separator className="bg-border/50" />

          {/* 4. AI Chat History */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <AiChatHistory />
          </section>

          {/* 5. Recommended Properties */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <PropertyIntelligence />
          </section>

          {/* 6. Saved Assets */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <SavedAssets />
          </section>

          {/* 7. Financing */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <FinancingGateway />
          </section>

          {/* 8. Notifications */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <SmartNotifications />
          </section>

          <Separator className="bg-border/50" />

          {/* 9. Settings & Footer */}
          <section className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
            <Button
              variant="ghost"
              className="w-full justify-between h-auto py-3 px-3 hover:bg-primary/5 hover:text-primary transition-all group"
              onClick={() => handleNavigation('/account/settings')}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium text-sm">Account Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-3 hover:bg-red-500/5 hover:text-red-500 transition-all text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="font-medium text-sm">Sign Out</span>
            </Button>
          </section>

          <div className="text-center pt-8 pb-4">
            <p className="text-[10px] text-muted-foreground/40 font-mono">Real Estate OS v2.0</p>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
