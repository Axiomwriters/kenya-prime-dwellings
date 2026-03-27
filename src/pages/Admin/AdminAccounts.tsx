import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, Shield, ShieldCheck, UserCog, Building2, Crown, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Role = "all" | "agent" | "landlord" | "agency" | "host";
type VerificationStatus = "all" | "verified" | "pending" | "rejected";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  verification_status: string | null;
  phone: string | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;

export default function AdminAccounts() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role>("all");
  const [verificationFilter, setVerificationFilter] = useState<VerificationStatus>("all");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProfiles = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Build base query
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load accounts - " + error.message);
        setProfiles([]);
      } else {
        let filteredData = data || [];
        
        if (roleFilter !== "all") {
          filteredData = filteredData.filter((p) => p.role === roleFilter);
        }
        
        if (verificationFilter !== "all") {
          filteredData = filteredData.filter((p) => p.verification_status === verificationFilter);
        }
        
        setProfiles(filteredData);
        setTotalCount(count || 0);
      }
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, roleFilter, verificationFilter]);

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchProfiles();
    
    const interval = setInterval(() => {
      fetchProfiles(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchProfiles]);

  // Re-fetch when filters or page change
  useEffect(() => {
    setCurrentPage(1);
    fetchProfiles();
  }, [roleFilter, verificationFilter]);

  // Real-time subscription for profile changes
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          fetchProfiles(true);
          toast.info("New account detected - refreshing...");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfiles]);

  const filteredProfiles = profiles.filter((profile) =>
    profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case "agent":
        return <UserCog className="w-4 h-4" />;
      case "landlord":
        return <Building2 className="w-4 h-4" />;
      case "agency":
        return <Building2 className="w-4 h-4" />;
      case "host":
        return <Crown className="w-4 h-4" />;
      default:
        return <UserCog className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "agent":
        return "bg-blue-500";
      case "landlord":
        return "bg-purple-500";
      case "agency":
        return "bg-indigo-500";
      case "host":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getVerificationBadge = (status: string | null) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500"><ShieldCheck className="w-3 h-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><Shield className="w-3 h-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleRefresh = () => {
    fetchProfiles(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Accounts Management</h1>
          <p className="text-muted-foreground mt-1">Manage all user accounts and their roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalCount} accounts
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as Role)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="agent">Agents</SelectItem>
                  <SelectItem value="landlord">Landlords</SelectItem>
                  <SelectItem value="agency">Agencies</SelectItem>
                  <SelectItem value="host">Hosts</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verificationFilter} onValueChange={(v) => setVerificationFilter(v as VerificationStatus)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading accounts...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No accounts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile.avatar_url || ""} />
                          <AvatarFallback>
                            {profile.full_name?.charAt(0) || profile.email?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile.full_name || "Unnamed User"}</p>
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(profile.role)}>
                        {getRoleIcon(profile.role)}
                        <span className="ml-1 capitalize">{profile.role || "User"}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{getVerificationBadge(profile.verification_status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProfile(profile)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Account Details</DialogTitle>
                          </DialogHeader>
                          {selectedProfile && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={selectedProfile.avatar_url || ""} />
                                  <AvatarFallback className="text-lg">
                                    {selectedProfile.full_name?.charAt(0) || selectedProfile.email?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-lg font-semibold">{selectedProfile.full_name || "Unnamed User"}</p>
                                  <p className="text-sm text-muted-foreground">{selectedProfile.email}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Role</p>
                                  <Badge className={getRoleBadgeColor(selectedProfile.role)}>
                                    {selectedProfile.role || "User"}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Verification</p>
                                  {getVerificationBadge(selectedProfile.verification_status)}
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Phone</p>
                                  <p>{selectedProfile.phone || "Not provided"}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Joined</p>
                                  <p>{selectedProfile.created_at ? new Date(selectedProfile.created_at).toLocaleDateString() : "N/A"}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button variant="outline" className="flex-1">
                                  <Shield className="w-4 h-4 mr-2" />
                                  Reset Verification
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  <UserCog className="w-4 h-4 mr-2" />
                                  Change Role
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
