import { useAuth, useUser } from '@clerk/clerk-react';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AppRole, isProfessionalTier } from '@/utils/AuthRedirectHandler';
import { resolveRoleFromMetadata } from '@/utils/roleRedirect';

type RequiredRole = Exclude<AppRole, null | undefined> | 'professional-tier';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: RequiredRole;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/sign-in',
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

  const userRole = user?.unsafeMetadata?.role as AppRole;

  if (!requiredRole) {
    return <>{children}</>;
  }

  if (!userRole) {
    return <Navigate to="/redirect" replace />;
  }

  if (requiredRole === 'professional-tier') {
    return isProfessionalTier(userRole)
      ? <>{children}</>
      : <Navigate to={resolveRoleFromMetadata(userRole)} replace />;
  }

  if (requiredRole === userRole || userRole === 'admin') {
    return <>{children}</>;
  }

  return <Navigate to={resolveRoleFromMetadata(userRole)} replace />;
}
