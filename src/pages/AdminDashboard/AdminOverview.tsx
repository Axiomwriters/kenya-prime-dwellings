import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, Building2, Clock, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatsCharts } from "@/components/admin/AdminStatsCharts";
import { SystemHealthMonitor } from "@/components/admin/SystemHealthMonitor";
import { CountdownWidgets } from "@/components/admin/CountdownWidgets";
import { LiveUserActivity } from "@/components/admin/LiveUserActivity";

interface Stats {
  totalUsers: number;
  totalAgents: number;
  pendingVerifications: number;
  totalListings: number;
  pendingListings: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAgents: 0,
    pendingVerifications: 0,
    totalListings: 0,
    pendingListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AdminOverview mounted!");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Count approved agents
      const { count: agentCount } = await supabase
        .from("agent_verifications")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      // Count pending verifications
      const { count: pendingVerifCount } = await supabase
        .from("agent_verifications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Count total listings
      const { count: listingCount } = await supabase
        .from("agent_listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      // Count pending listings
      const { count: pendingListCount } = await supabase
        .from("agent_listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Count total users
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: userCount || 0,
        totalAgents: agentCount || 0,
        pendingVerifications: pendingVerifCount || 0,
        totalListings: listingCount || 0,
        pendingListings: pendingListCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/admin/users",
      trend: "+12% this week"
    },
    {
      title: "Total Agents",
      value: stats.totalAgents,
      icon: UserCheck,
      description: "Approved agents",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      link: "/admin/users",
      trend: "+5% this week"
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      link: "/admin/verifications",
      trend: "High Priority"
    },
    {
      title: "Total Listings",
      value: stats.totalListings,
      icon: Building2,
      description: "Approved listings",
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "+8% this week"
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System Command Center</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Admin Command Center
          </h1>
          <p className="text-muted-foreground">Real-time system monitoring and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="w-4 h-4" />
            System Status: Healthy
          </Button>
          <Button size="sm" className="gap-2 bg-red-500 hover:bg-red-600 text-white border-none">
            <AlertTriangle className="w-4 h-4" />
            3 Critical Alerts
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: stat.color.replace('text-', 'var(--') }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <AdminStatsCharts />

      {/* Bottom Section: Monitoring & Activity */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: System Health & Countdowns */}
        <div className="md:col-span-7 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SystemHealthMonitor />
            <CountdownWidgets />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link to="/admin/verifications">
                <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 font-semibold">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Verify Agents
                  </div>
                  <span className="text-xs text-muted-foreground">Review pending applications</span>
                </Button>
              </Link>
              <Link to="/admin/listings">
                <Button variant="outline" className="w-full justify-start h-auto py-4 flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 font-semibold">
                    <Building2 className="w-4 h-4 text-primary" />
                    Moderate Listings
                  </div>
                  <span className="text-xs text-muted-foreground">Check flagged properties</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="md:col-span-5">
          <LiveUserActivity />
        </div>
      </div>
    </div>
  );
}
