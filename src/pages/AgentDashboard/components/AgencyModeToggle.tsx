import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Building2, User, Loader2 } from "lucide-react";

interface AgencyModeToggleProps {
  onModeChange?: (isAgency: boolean) => void;
}

export default function AgencyModeToggle({ onModeChange }: AgencyModeToggleProps) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAgencyMode, setIsAgencyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.log("Profile not found, using default mode");
        }
        
        const isAgency = data?.user_type === 'agency';
        setIsAgencyMode(isAgency);
        onModeChange?.(isAgency);
      } catch (err) {
        console.log("Error fetching user type:", err);
        setIsAgencyMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserType();
  }, [isLoaded, user, onModeChange]);

  const handleToggle = async (isToggled: boolean) => {
    if (!user) return;

    const newMode = isToggled ? 'agency' : 'individual';
    setIsAgencyMode(isToggled);
    onModeChange?.(isToggled);

    // Save to localStorage for immediate UI update
    localStorage.setItem("agency_mode", String(isToggled));

    // Navigate to appropriate route
    if (isToggled) {
      navigate("/agent/agency");
    } else {
      navigate("/agent");
    }

    try {
      await supabase
        .from('profiles')
        .update({ user_type: newMode })
        .eq('id', user.id);
    } catch (err) {
      console.error("Error updating user type:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-full border">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-full border">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${!isAgencyMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Agent</span>
      </div>

      <Switch
        checked={isAgencyMode}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary"
      />

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${isAgencyMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
        <Building2 className="w-4 h-4" />
        <span className="hidden sm:inline">Agency</span>
      </div>
    </div>
  );
}
