import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedAgentRoute } from "@/components/agent/ProtectedAgentRoute";
import { Loader2 } from "lucide-react";

// Agent Dashboard Components
const NewAgentDashboard = lazy(() => import("../pages/AgentDashboard/NewAgentDashboard"));
const AgencyDashboard = lazy(() => import("../pages/AgentDashboard/AgencyDashboard"));
const AgentDashboardProfile = lazy(() => import("../pages/AgentDashboard/AgentProfile"));
const MyListings = lazy(() => import("../pages/AgentDashboard/MyListings"));
const AgentTrips = lazy(() => import("../pages/AgentDashboard/AgentTrips"));
const Notifications = lazy(() => import("../pages/AgentDashboard/Notifications"));
const AgentSettings = lazy(() => import("../pages/AgentDashboard/AgentSettings"));
const AgentOnboardingComplete = lazy(() => import("../pages/AgentDashboard/AgentOnboardingComplete"));

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

function AgentIndexRoute() {
  return <NewAgentDashboard />;
}

export const agentRoutes = [
  {
    index: true,
    element: <NewAgentDashboard />,
  },
  {
    path: "agency",
    element: (
      <ProtectedAgentRoute>
        <Suspense fallback={<LoadingFallback />}>
          <AgencyDashboard />
        </Suspense>
      </ProtectedAgentRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedAgentRoute>
        <Suspense fallback={<LoadingFallback />}>
          <AgentDashboardProfile />
        </Suspense>
      </ProtectedAgentRoute>
    ),
  },
  {
    path: "listings",
    element: (
      <ProtectedAgentRoute>
        <Suspense fallback={<LoadingFallback />}>
          <MyListings />
        </Suspense>
      </ProtectedAgentRoute>
    ),
  },
  {
    path: "trips",
    element: (
      <ProtectedAgentRoute>
        <Suspense fallback={<LoadingFallback />}>
          <AgentTrips />
        </Suspense>
      </ProtectedAgentRoute>
    ),
  },
  {
    path: "notifications",
    element: (
      <ProtectedAgentRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Notifications />
        </Suspense>
      </ProtectedAgentRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <ProtectedAgentRoute>
        <Suspense fallback={<LoadingFallback />}>
          <AgentSettings />
        </Suspense>
      </ProtectedAgentRoute>
    ),
  },
  {
    path: "onboarding-complete",
    element: <AgentOnboardingComplete />,
  },
];
