
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Shield, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

const ADMIN_EMAILS = [
  "admin@savanahdwelling.com",
  "admin@properthub.com",
  "njorogejames802@gmail.com"
];

export default function AdminLogin() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
      const isAdminEmail = ADMIN_EMAILS.some(adminEmail => email === adminEmail.toLowerCase());
      
      if (isAdminEmail) {
        const userRole = user.unsafeMetadata?.role;
        if (userRole === "admin") {
          navigate(from, { replace: true });
        } else {
          toast.error("Access denied. Admin role required.");
        }
      } else {
        toast.error("This portal is for administrators only.");
      }
    }
  }, [isLoaded, isSignedIn, user, navigate, from]);

  const handleAdminSignIn = () => {
    setIsVerifying(true);
    window.location.href = "/sign-in?redirect_url=" + encodeURIComponent("/admin");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-zinc-800 rounded-full"></div>
          <div className="h-4 w-32 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (isSignedIn && user) {
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
    const isAdminEmail = ADMIN_EMAILS.some(adminEmail => email === adminEmail.toLowerCase());
    
    if (!isAdminEmail) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
          <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl text-white">Access Denied</CardTitle>
              <CardDescription className="text-zinc-400">
                This portal is restricted to administrators only.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Main Site
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md relative z-10 border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-emerald-900/20">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Savannah Dwellings Admin
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Owners Only — Secure Command Center Access
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div className="text-center text-sm text-zinc-500 mb-6">
            <p>Authorized personnel only. All access attempts are logged.</p>
          </div>
          
          {isSignedIn ? (
            <div className="text-center space-y-4">
              <p className="text-zinc-400">Welcome back, {user?.fullName || user?.firstName}</p>
              <Button 
                onClick={() => navigate(from)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Enter Admin Command Center
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleAdminSignIn}
              disabled={isVerifying}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
            >
              <Lock className="h-4 w-4" />
              {isVerifying ? "Authenticating..." : "Sign In with Clerk"}
            </Button>
          )}
        </CardContent>
        
        <CardFooter className="justify-center border-t border-zinc-800 pt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
