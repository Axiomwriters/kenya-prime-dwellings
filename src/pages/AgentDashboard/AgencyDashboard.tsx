import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, Users, Home, DollarSign, TrendingUp, 
  Star, MapPin, Search, MoreVertical, CheckCircle,
  XCircle, Clock, Eye, Heart, MessageCircle
} from "lucide-react";

interface Agent {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  status?: string;
  listings_count?: number;
}

interface AgencyStats {
  totalAgents: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  totalRevenue: number;
  totalViews: number;
}

export default function AgencyDashboard() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch agency stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["agency-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get all agents in the agency (same organization)
      const { data: agents } = await supabase
        .from("profiles")
        .select("id")
        .eq("agency_id", user.id);

      const agentIds = agents?.map(a => a.id) || [];
      
      if (agentIds.length === 0) {
        return {
          totalAgents: 0,
          totalListings: 0,
          activeListings: 0,
          pendingListings: 0,
          totalRevenue: 0,
          totalViews: 0
        };
      }

      // Get listings count for all agents
      const { data: listings } = await supabase
        .from("agent_listings")
        .select("status, price, view_count")
        .in("agent_id", agentIds);

      const allListings = listings || [];
      
      return {
        totalAgents: agentIds.length,
        totalListings: allListings.length,
        activeListings: allListings.filter(l => l.status === 'approved').length,
        pendingListings: allListings.filter(l => l.status === 'pending').length,
        totalRevenue: allListings.reduce((sum, l) => sum + (Number(l.price) || 0), 0),
        totalViews: allListings.reduce((sum, l) => sum + (l.view_count || 0), 0)
      };
    },
    enabled: !!user
  });

  // Fetch agents
  const { data: agentsData } = useQuery({
    queryKey: ["agency-agents", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, status")
        .eq("agency_id", user.id)
        .order("created_at", { ascending: false });

      // Get listings count for each agent
      const agentsWithCounts = await Promise.all((data || []).map(async (agent) => {
        const { count } = await supabase
          .from("agent_listings")
          .select("*", { count: 'exact', head: true })
          .eq("agent_id", agent.id);
        
        return { ...agent, listings_count: count || 0 };
      }));

      return agentsWithCounts;
    },
    enabled: !!user
  });

  // Fetch recent listings
  const { data: listings } = useQuery({
    queryKey: ["agency-listings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: agents } = await supabase
        .from("profiles")
        .select("id")
        .eq("agency_id", user.id);

      const agentIds = agents?.map(a => a.id) || [];
      
      if (agentIds.length === 0) return [];

      const { data } = await supabase
        .from("agent_listings")
        .select("*, profiles(full_name, avatar_url)")
        .in("agent_id", agentIds)
        .order("created_at", { ascending: false })
        .limit(10);

      return data || [];
    },
    enabled: !!user
  });

  const filteredAgents = agentsData?.filter(agent => 
    agent.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            Agency Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your agency and team</p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Invite Agent
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalAgents || 0}</p>
                <p className="text-xs text-muted-foreground">Total Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalListings || 0}</p>
                <p className="text-xs text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.activeListings || 0}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pendingListings || 0}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats?.totalRevenue ? `KSh ${(stats.totalRevenue / 1000000).toFixed(1)}M` : 'KSh 0'}
                </p>
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalViews?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Team Agents</CardTitle>
              <Badge variant="secondary">{filteredAgents.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-auto">
            <div className="space-y-3">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {agent.avatar_url ? (
                        <img src={agent.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium">
                          {agent.full_name?.[0] || agent.email?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {agent.full_name || 'Unnamed Agent'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {agent.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{agent.listings_count || 0}</p>
                    <p className="text-xs text-muted-foreground">listings</p>
                  </div>
                </div>
              ))}
              {filteredAgents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No agents found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Listings */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Listings</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listings?.map((listing: any) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{listing.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </div>
                      <p className="text-sm font-semibold mt-1">
                        KSh {Number(listing.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {getStatusBadge(listing.status)}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {listing.view_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {listings?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Home className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No listings yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
