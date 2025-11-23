import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  Shield,
  Plus,
  List,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalListings: number;
  pendingListings: number;
  approvedListings: number;
  totalViews: number;
  messages: number;
  verificationStatus: 'pending' | 'approved' | 'rejected' | null;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    pendingListings: 0,
    approvedListings: 0,
    totalViews: 0,
    messages: 0,
    verificationStatus: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch listings stats
      const { data: listings } = await supabase
        .from('agent_listings')
        .select('status, view_count')
        .eq('agent_id', user?.id);

      const totalListings = listings?.length || 0;
      const pendingListings = listings?.filter(l => l.status === 'pending').length || 0;
      const approvedListings = listings?.filter(l => l.status === 'approved').length || 0;
      const totalViews = listings?.reduce((sum, l) => sum + (l.view_count || 0), 0) || 0;

      // Fetch verification status
      const { data: verification } = await supabase
        .from('agent_verifications')
        .select('status')
        .eq('user_id', user?.id)
        .maybeSingle();

      setStats({
        totalListings,
        pendingListings,
        approvedListings,
        totalViews,
        messages: 0, // TODO: Implement messaging system
        verificationStatus: verification?.status || null,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: "Total Listings",
      value: stats.totalListings,
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pending Approval",
      value: stats.pendingListings,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Approved Listings",
      value: stats.approvedListings,
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Views (7 days)",
      value: stats.totalViews,
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Messages Received",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Verification Status",
      value: stats.verificationStatus || "Not Started",
      icon: Shield,
      color: stats.verificationStatus === 'approved' ? "text-primary" : stats.verificationStatus === 'rejected' ? "text-destructive" : "text-yellow-500",
      bgColor: stats.verificationStatus === 'approved' ? "bg-primary/10" : stats.verificationStatus === 'rejected' ? "bg-destructive/10" : "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Create New Listing",
      description: "Add a new property to your portfolio",
      icon: Plus,
      link: "/agent/listings/new",
      color: "bg-primary hover:bg-primary/90",
    },
    {
      title: "View All Listings",
      description: "Manage your existing properties",
      icon: List,
      link: "/agent/listings",
      color: "bg-card hover:bg-card/90",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your agent account.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card) => (
          <div
            key={card.title}
            className="glass-card rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-lg", card.bgColor)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              {typeof card.value === 'number' && card.value > 0 && (
                <TrendingUp className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {typeof card.value === 'number' ? card.value : (
                  <Badge
                    variant={
                      card.value === 'approved'
                        ? 'default'
                        : card.value === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {String(card.value).charAt(0).toUpperCase() + String(card.value).slice(1)}
                  </Badge>
                )}
              </p>
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.link}>
              <div
                className={cn(
                  "glass-card rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer",
                  action.color
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-background/10">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white/80">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Verification Alert */}
      {!stats.verificationStatus && (
        <div className="glass-card rounded-xl p-6 border-l-4 border-yellow-500 bg-yellow-500/10">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Complete Your Verification</h3>
              <p className="text-muted-foreground mb-4">
                Submit your ID documents to get verified and start adding listings.
              </p>
              <Link to="/agent/profile">
                <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
