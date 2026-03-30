import { useState, useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AgencyRouteWrapperProps {
  children: ReactNode;
}

export function AgencyRouteWrapper({ children }: AgencyRouteWrapperProps) {
  const [isAgencyMode, setIsAgencyMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for agency mode
    const saved = localStorage.getItem("agency_mode");
    setIsAgencyMode(saved === "true");
  }, []);

  // Show nothing while loading
  if (isAgencyMode === null) {
    return null;
  }

  // If agency mode is on, redirect to /agent/agency
  if (isAgencyMode) {
    return <Navigate to="/agent/agency" replace />;
  }

  // Otherwise show the agent dashboard
  return <>{children}</>;
}
