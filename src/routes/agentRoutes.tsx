import { lazy } from "react";

// Agent Dashboard Components
const NewAgentDashboard = lazy(() => import("../pages/AgentDashboard/NewAgentDashboard"));
const AgentDashboardProfile = lazy(() => import("../pages/AgentDashboard/AgentProfile"));
const MyListings = lazy(() => import("../pages/AgentDashboard/MyListings"));
const AgentTrips = lazy(() => import("../pages/AgentDashboard/AgentTrips"));
const Notifications = lazy(() => import("../pages/AgentDashboard/Notifications"));
const AgentSettings = lazy(() => import("../pages/AgentDashboard/AgentSettings"));

export const agentRoutes = [
  {
    index: true,
    element: <NewAgentDashboard />,
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
