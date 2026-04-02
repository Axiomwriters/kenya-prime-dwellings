import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, FileText, Check, X, Eye, Shield, Clock, User, Building2, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { toast } from "sonner";

interface AgentVerification {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  user_type: string | null;
  phone_number: string | null;
  bio: string | null;
  verification_status: string | null;
  verification_documents: any;
  created_at: string;
  agents: {
    agency_name: string | null;
    license_number: string | null;
    is_verified: boolean;
  } | null;
}

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<AgentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<AgentVerification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select(`
          *,
          agents (
            agency_name,
            license_number,
            is_verified
          )
        `)
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verification: AgentVerification) => {
    setProcessingId(verification.id);
    try {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          verification_status: "verified",
          role: "agent",
        })
        .eq("id", verification.id);

      if (profileError) throw profileError;

      const { error: agentError } = await supabaseAdmin
        .from("agents")
        .update({ is_verified: true })
        .eq("id", verification.id);

      if (agentError) console.warn("Agent update error:", agentError);

      toast.success(`Agent ${verification.full_name || "approved"} successfully!`);
      setDetailOpen(false);
      fetchVerifications();
    } catch (error: any) {
      console.error("Error approving verification:", error);
      toast.error(error.message || "Failed to approve verification");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (verification: AgentVerification) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setProcessingId(verification.id);
    try {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          verification_status: "rejected",
        })
        .eq("id", verification.id);

      if (profileError) throw profileError;

      toast.success("Verification rejected");
      setRejectDialogOpen(false);
      setRejectReason("");
      setDetailOpen(false);
      fetchVerifications();
    } catch (error: any) {
      console.error("Error rejecting verification:", error);
      toast.error(error.message || "Failed to reject verification");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredVerifications = verifications.filter(
    (v) =>
      v.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.agents?.agency_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocumentUrl = (docPath: string) => {
    if (!docPath) return null;
    const { data } = supabaseAdmin.storage.from("id-documents").getPublicUrl(docPath);
    return data.publicUrl;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agent Verification Requests</h1>
          <p className="text-muted-foreground mt-1">Review and approve agent applications</p>
        </div>
        <Badge variant="outline" className="text-sm gap-1">
          <Clock className="w-3 h-3" />
          {filteredVerifications.length} pending
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchVerifications} disabled={loading}>
              <Loader2 className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading verifications...
                  </TableCell>
                </TableRow>
              ) : filteredVerifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="w-8 h-8 text-green-500" />
                      <p>All verifications have been processed!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVerifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={verification.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {verification.full_name?.charAt(0) || verification.agents?.agency_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {verification.full_name || verification.agents?.agency_name || "Unnamed"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {verification.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          verification.user_type === "agency"
                            ? "bg-purple-500/10 text-purple-600 border-purple-500/30"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                        }`}
                      >
                        {verification.user_type === "agency" ? (
                          <Building2 className="w-3 h-3 mr-1" />
                        ) : (
                          <User className="w-3 h-3 mr-1" />
                        )}
                        {verification.user_type || "Individual"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(verification.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(verification)}
                          disabled={processingId === verification.id}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setRejectDialogOpen(true);
                          }}
                          disabled={processingId === verification.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Verification Details</DialogTitle>
            <DialogDescription>
              Review the applicant&apos;s documents and information
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedVerification.avatar_url || ""} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                    {selectedVerification.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">
                      {selectedVerification.full_name || selectedVerification.agents?.agency_name || "Unnamed"}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        selectedVerification.user_type === "agency"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {selectedVerification.user_type === "agency" ? (
                        <Building2 className="w-3 h-3 mr-1" />
                      ) : (
                        <User className="w-3 h-3 mr-1" />
                      )}
                      {selectedVerification.user_type || "Individual"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedVerification.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedVerification.phone_number}</p>
                </div>
              </div>

              {/* Agent Info */}
              {selectedVerification.agents && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Agent Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedVerification.agents.agency_name && (
                      <div>
                        <p className="text-muted-foreground">Agency Name</p>
                        <p className="font-medium">{selectedVerification.agents.agency_name}</p>
                      </div>
                    )}
                    {selectedVerification.agents.license_number && (
                      <div>
                        <p className="text-muted-foreground">License Number</p>
                        <p className="font-medium">{selectedVerification.agents.license_number}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedVerification.bio && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{selectedVerification.bio}</p>
                </div>
              )}

              {/* Documents */}
              {selectedVerification.verification_documents && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Submitted Documents
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedVerification.verification_documents.id_front_url && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-medium">ID Front</p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={getDocumentUrl(selectedVerification.verification_documents.id_front_url) || ""}
                            alt="ID Front"
                            className="w-full h-40 object-cover"
                          />
                          <a
                            href={getDocumentUrl(selectedVerification.verification_documents.id_front_url) || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 p-2 text-sm text-primary hover:bg-muted"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Full
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedVerification.verification_documents.id_back_url && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-medium">ID Back</p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={getDocumentUrl(selectedVerification.verification_documents.id_back_url) || ""}
                            alt="ID Back"
                            className="w-full h-40 object-cover"
                          />
                          <a
                            href={getDocumentUrl(selectedVerification.verification_documents.id_back_url) || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 p-2 text-sm text-primary hover:bg-muted"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Full
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedVerification.verification_documents.selfie_url && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-medium">Selfie with ID</p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={getDocumentUrl(selectedVerification.verification_documents.selfie_url) || ""}
                            alt="Selfie"
                            className="w-full h-40 object-cover"
                          />
                          <a
                            href={getDocumentUrl(selectedVerification.verification_documents.selfie_url) || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 p-2 text-sm text-primary hover:bg-muted"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Full
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedVerification.verification_documents.license_doc_url && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase font-medium">License/Registration</p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={getDocumentUrl(selectedVerification.verification_documents.license_doc_url) || ""}
                            alt="License"
                            className="w-full h-40 object-cover"
                          />
                          <a
                            href={getDocumentUrl(selectedVerification.verification_documents.license_doc_url) || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1 p-2 text-sm text-primary hover:bg-muted"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Full
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={processingId === selectedVerification.id}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedVerification)}
                  disabled={processingId === selectedVerification.id}
                >
                  {processingId === selectedVerification.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Approve Agent
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., ID documents are not readable, please resubmit clearer photos..."
                rows={4}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
              <p className="text-sm text-muted-foreground">
                The applicant will be notified and can reapply with updated documents.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedVerification && handleReject(selectedVerification)}
              disabled={!rejectReason.trim() || processingId === selectedVerification?.id}
            >
              {processingId === selectedVerification?.id ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Reject Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
