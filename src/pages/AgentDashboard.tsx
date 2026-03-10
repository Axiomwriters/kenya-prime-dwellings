import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AgentSidebar } from "@/components/AgentSidebar";

/**
 * AgentDashboard - The main entry point and layout configurator for the agent-facing dashboard.
 *
 * This component's sole responsibility is to compose the overall dashboard structure by:
 * 1. Rendering the generic `DashboardLayout`.
 * 2. Passing the role-specific `AgentSidebar` into the layout.
 *
 * All page-specific content is rendered via the `<Outlet />` inside the `DashboardLayout`.
 * Routing is handled centrally in `App.tsx` and `src/routes/agentRoutes.tsx`.
 */
export default function AgentDashboard() {
  return <DashboardLayout sidebar={<AgentSidebar />} />;
}
