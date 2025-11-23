import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Eye, User, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Verification {
  id: string;
  user_id: string;
  status: string;
  submitted_at: string;
  id_front_url: string | null;
  id_back_url: string | null;
  rejection_reason: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    county: string | null;
    city: string | null;
    bio: string | null;
  };
}

export default function VerificationManagement() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("agent_verifications")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately for each verification
      if (data) {
        const verificationsWithProfiles = await Promise.all(
          data.map(async (verification) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, email, phone, whatsapp, county, city, bio")
              .eq("id", verification.user_id)
              .single();

            return {
              ...verification,
              profiles: profile || {
                full_name: null,
                email: null,
                phone: null,
                whatsapp: null,
                county: null,
                city: null,
                bio: null,
              },
            };
          })
        );
        setVerifications(verificationsWithProfiles);
      }
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId: string) => {
    try {
      setProcessing(true);
      const { error } = await supabase.rpc("admin_approve_agent_verification", {
        _verification_id: verificationId,
      });

      if (error) throw error;

      toast.success("Agent verification approved successfully!");
      fetchVerifications();
      setSelectedVerification(null);
    } catch (error: any) {
      console.error("Error approving verification:", error);
      toast.error(error.message || "Failed to approve verification");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedVerification || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      const { error } = await supabase.rpc("admin_reject_agent_verification", {
        _verification_id: selectedVerification.id,
        _reason: rejectionReason,
      });

      if (error) throw error;

      toast.success("Agent verification rejected");
      fetchVerifications();
      setShowRejectDialog(false);
      setSelectedVerification(null);
      setRejectionReason("");
    } catch (error: any) {
      console.error("Error rejecting verification:", error);
      toast.error(error.message || "Failed to reject verification");
    } finally {
      setProcessing(false);
    }
  };

  const filteredVerifications = verifications.filter((v) => {
    if (activeTab === "all") return true;
    return v.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Verifications</h1>
          <p className="text-muted-foreground">Review and approve agent applications</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Verifications</h1>
        <p className="text-muted-foreground">Review and approve agent applications</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({verifications.filter((v) => v.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({verifications.filter((v) => v.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({verifications.filter((v) => v.status === "rejected").length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({verifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filteredVerifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No {activeTab !== "all" ? activeTab : ""} verifications found
              </CardContent>
            </Card>
          ) : (
            filteredVerifications.map((verification) => (
              <Card key={verification.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {verification.profiles?.full_name || "Unknown"}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {verification.profiles?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {verification.profiles.email}
                          </span>
                        )}
                        {verification.profiles?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {verification.profiles.phone}
                          </span>
                        )}
                        {verification.profiles?.city && verification.profiles?.county && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {verification.profiles.city}, {verification.profiles.county}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(verification.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(verification.submitted_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {verification.profiles?.bio && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Bio:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {verification.profiles.bio}
                      </p>
                    </div>
                  )}

                  {verification.rejection_reason && (
                    <div className="bg-destructive/10 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-destructive mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-destructive/90">
                        {verification.rejection_reason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVerification(verification)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>

                    {verification.status === "pending" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(verification.id)}
                          disabled={processing}
                        >
                          {processing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowRejectDialog(true);
                          }}
                          disabled={processing}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedVerification && !showRejectDialog}
        onOpenChange={(open) => !open && setSelectedVerification(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>
              Review agent verification information and documents
            </DialogDescription>
          </DialogHeader>

          {selectedVerification && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name:</p>
                    <p className="font-medium">{selectedVerification.profiles?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email:</p>
                    <p className="font-medium">{selectedVerification.profiles?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone:</p>
                    <p className="font-medium">{selectedVerification.profiles?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">WhatsApp:</p>
                    <p className="font-medium">
                      {selectedVerification.profiles?.whatsapp || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location:</p>
                    <p className="font-medium">
                      {selectedVerification.profiles?.city}, {selectedVerification.profiles?.county}
                    </p>
                  </div>
                </div>
              </div>

              {selectedVerification.profiles?.bio && (
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedVerification.profiles.bio}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">ID Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedVerification.id_front_url && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Front</p>
                      <img
                        src={selectedVerification.id_front_url}
                        alt="ID Front"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}
                  {selectedVerification.id_back_url && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Back</p>
                      <img
                        src={selectedVerification.id_back_url}
                        alt="ID Back"
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {selectedVerification.status === "pending" && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedVerification(null)}>
                    Close
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleApprove(selectedVerification.id)}
                    disabled={processing}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowRejectDialog(true);
                    }}
                    disabled={processing}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this agent verification
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || processing}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
