import { lazy } from "react";

const AdminDashboardPage = lazy(() => import("../pages/Admin/AdminDashboard"));
const AdminAccountsPage = lazy(() => import("../pages/Admin/AdminAccounts"));
const AdminVerificationsPage = lazy(() => import("../pages/Admin/AdminVerifications"));
const AdminListingsPage = lazy(() => import("../pages/Admin/AdminListings"));
const AdminTripsPage = lazy(() => import("../pages/Admin/AdminTrips"));
const AdminViewingsPage = lazy(() => import("../pages/Admin/AdminViewings"));
const AdminAgentsPage = lazy(() => import("../pages/Admin/AdminAgents"));
const AdminLandlordsPage = lazy(() => import("../pages/Admin/AdminLandlords"));
const AdminAgenciesPage = lazy(() => import("../pages/Admin/AdminAgencies"));
const AdminHostsPage = lazy(() => import("../pages/Admin/AdminHosts"));
const AdminSettingsPage = lazy(() => import("../pages/Admin/AdminSettings"));
const AdminInsightsPage = lazy(() => import("../pages/Admin/AdminInsights"));
const AdminReportsPage = lazy(() => import("../pages/Admin/AdminReports"));

export const adminRoutes = [
  {
    index: true,
    element: <AdminDashboardPage />,
  },
  {
    path: "accounts",
    element: <AdminAccountsPage />,
  },
  {
    path: "verifications",
    element: <AdminVerificationsPage />,
  },
  {
    path: "listings",
    element: <AdminListingsPage />,
  },
  {
    path: "trips",
    element: <AdminTripsPage />,
  },
  {
    path: "viewings",
    element: <AdminViewingsPage />,
  },
  {
    path: "agents",
    element: <AdminAgentsPage />,
  },
  {
    path: "landlords",
    element: <AdminLandlordsPage />,
  },
  {
    path: "agencies",
    element: <AdminAgenciesPage />,
  },
  {
    path: "hosts",
    element: <AdminHostsPage />,
  },
  {
    path: "insights",
    element: <AdminInsightsPage />,
  },
  {
    path: "reports",
    element: <AdminReportsPage />,
  },
  {
    path: "settings",
    element: <AdminSettingsPage />,
  },
];
