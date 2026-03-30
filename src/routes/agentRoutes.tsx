import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Agent Dashboard Components
const NewAgentDashboard = lazy(() => import("../pages/AgentDashboard/NewAgentDashboard"));
const AgencyDashboard = lazy(() => import("../pages/AgentDashboard/AgencyDashboard"));
const AgentDashboardProfile = lazy(() => import("../pages/AgentDashboard/AgentProfile"));
const MyListings = lazy(() => import("../pages/AgentDashboard/MyListings"));
const AgentTrips = lazy(() => import("../pages/AgentDashboard/AgentTrips"));
const Notifications = lazy(() => import("../pages/AgentDashboard/Notifications"));
const AgentSettings = lazy(() => import("../pages/AgentDashboard/AgentSettings"));

// Wrapper to handle agency mode redirection
function AgentIndexRoute() {
  const isAgencyMode = localStorage.getItem("agency_mode") === "true";
  if (isAgencyMode) {
    return <Navigate to="/agent/agency" replace />;
  }
  return <NewAgentDashboard />;
}

export const agentRoutes = [
  {
    index: true,
    element: <AgentIndexRoute />,
  },
  {
    path: "agency",
    element: <AgencyDashboard />,
  },
  {
    path: "profile",
    element: <AgentDashboardProfile />,
  },
  {
    path: "listings",
    element: <MyListings />,
  },
  {
    path: "trips",
    element: <AgentTrips />,
  },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    path: "settings",
    element: <AgentSettings />,
  },
];
