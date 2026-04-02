import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedAgentRouteProps {
  children: React.ReactNode;
}

export function ProtectedAgentRoute({ children }: ProtectedAgentRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkVerification = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type, verification_status")
          .eq("id", user.id)
          .single();

        const { data: agent } = await supabase
          .from("agents")
          .select("is_verified")
          .eq("id", user.id)
          .single();

        const status = profile?.verification_status;
        const verifiedAgent = agent?.is_verified;

        if (status === "verified" || verifiedAgent) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Error checking verification:", error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!isVerified) {
    return <Navigate to="/agent/onboarding-complete" replace />;
  }

  return <>{children}</>;
}
