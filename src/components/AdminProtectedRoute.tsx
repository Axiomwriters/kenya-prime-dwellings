import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();
  const session = localStorage.getItem("admin_session");

  useEffect(() => {
    if (!session) {
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      if (sessionData.expiresAt < Date.now()) {
        localStorage.removeItem("admin_session");
        window.location.href = "/admin/login";
      }
    } catch {
      localStorage.removeItem("admin_session");
    }
  }, [session]);

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
