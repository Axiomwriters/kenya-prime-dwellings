import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, Building2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      link: "/admin/users",
    },
    {
      title: "Total Agents",
      value: stats.totalAgents,
      icon: UserCheck,
      description: "Approved agents",
      color: "text-indigo-500",
      link: "/admin/users",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications,
      icon: Clock,
      description: "Awaiting approval",
      color: "text-orange-500",
      link: "/admin/verifications",
    },
    {
      title: "Total Listings",
      value: stats.totalListings,
      icon: Building2,
      description: "Approved listings",
      color: "text-green-500",
    },
    {
      title: "Pending Listings",
      value: stats.pendingListings,
      icon: Building2,
      description: "Awaiting moderation",
      color: "text-purple-500",
      link: "/admin/listings",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage verifications and listings</p>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage verifications and listings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              {stat.link && stat.value > 0 && (
                <Link to={stat.link}>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    View all →
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/verifications">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="w-4 h-4 mr-2" />
                Review Agent Verifications
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link to="/admin/listings">
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                Moderate Listings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
