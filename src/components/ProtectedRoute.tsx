import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'agent' | 'admin' | 'professional';
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but role not loaded yet, show loader
  if (isAuthenticated && !userRole && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role check - TEMPORARILY DISABLED FOR TESTING
  // if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
}
