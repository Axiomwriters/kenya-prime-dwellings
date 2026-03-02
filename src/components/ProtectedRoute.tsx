import { useAuth, useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "agent" | "admin" | "professional" | "host" | "buyer";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If authenticated but role not loaded yet, show loader
  
  const userRole = user?.unsafeMetadata?.role as string | undefined;

  // Role check
  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
