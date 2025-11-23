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
import { Loader2, CheckCircle, XCircle, Eye, MapPin, DollarSign, Home, Trash } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  title: string;
  agent_id: string;
  category: string;
  listing_type: string;
  price: number;
  location: string;
  city: string | null;
  county: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
  images: string[] | null;
  status: string;
  created_at: string;
  rejection_reason: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
  };
}

export default function ListingModeration() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("agent_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately for each listing
      if (data) {
        const listingsWithProfiles = await Promise.all(
          data.map(async (listing) => {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, email")
              .eq("id", listing.agent_id)
              .single();

            return {
              ...listing,
              profiles: profile || {
                full_name: null,
                email: null,
              },
            };
          })
        );
        setListings(listingsWithProfiles);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId: string) => {
    try {
      setProcessing(true);
      const { error } = await supabase.rpc("admin_approve_listing", {
        _listing_id: listingId,
      });

      if (error) throw error;

      toast.success("Listing approved successfully!");
      fetchListings();
      setSelectedListing(null);
    } catch (error: any) {
      console.error("Error approving listing:", error);
      toast.error(error.message || "Failed to approve listing");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedListing || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      const { error } = await supabase.rpc("admin_reject_listing", {
        _listing_id: selectedListing.id,
        _reason: rejectionReason,
      });

      if (error) throw error;

      toast.success("Listing rejected");
      fetchListings();
      setShowRejectDialog(false);
      setSelectedListing(null);
      setRejectionReason("");
    } catch (error: any) {
      console.error("Error rejecting listing:", error);
      toast.error(error.message || "Failed to reject listing");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;

    try {
      setProcessing(true);
      const { error } = await supabase
        .from("agent_listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      toast.success("Listing deleted successfully");
      fetchListings();
      setSelectedListing(null);
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast.error(error.message || "Failed to delete listing");
    } finally {
      setProcessing(false);
    }
  };

  const filteredListings = listings.filter((l) => {
    if (activeTab === "all") return true;
    return l.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      draft: "secondary",
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Listing Moderation</h1>
          <p className="text-muted-foreground">Review and approve property listings</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Listing Moderation</h1>
        <p className="text-muted-foreground">Review and approve property listings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({listings.filter((l) => l.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({listings.filter((l) => l.status === "approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({listings.filter((l) => l.status === "rejected").length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({listings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filteredListings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No {activeTab !== "all" ? activeTab : ""} listings found
              </CardContent>
            </Card>
          ) : (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        {listing.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatPrice(listing.price)}
                        </span>
                        <Badge variant="outline">{listing.category}</Badge>
                        <Badge variant="outline">{listing.listing_type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Agent: {listing.profiles?.full_name || "Unknown"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(listing.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(listing.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {listing.images && listing.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {listing.images.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${listing.title} ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {listing.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {listing.description}
                    </p>
                  )}

                  {listing.rejection_reason && (
                    <div className="bg-destructive/10 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-destructive mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-destructive/90">{listing.rejection_reason}</p>
                    </div>
                  )}

                  <div className="flex gap-2 items-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedListing(listing)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>

                    {listing.status === "pending" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(listing.id)}
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
                            setSelectedListing(listing);
                            setShowRejectDialog(true);
                          }}
                          disabled={processing}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleDelete(listing.id)}
                      disabled={processing}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedListing && !showRejectDialog}
        onOpenChange={(open) => !open && setSelectedListing(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>Review complete listing information</DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedListing.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category:</p>
                    <p className="font-medium">{selectedListing.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type:</p>
                    <p className="font-medium">{selectedListing.listing_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price:</p>
                    <p className="font-medium">{formatPrice(selectedListing.price)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location:</p>
                    <p className="font-medium">{selectedListing.location}</p>
                  </div>
                  {selectedListing.bedrooms && (
                    <div>
                      <p className="text-muted-foreground">Bedrooms:</p>
                      <p className="font-medium">{selectedListing.bedrooms}</p>
                    </div>
                  )}
                  {selectedListing.bathrooms && (
                    <div>
                      <p className="text-muted-foreground">Bathrooms:</p>
                      <p className="font-medium">{selectedListing.bathrooms}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedListing.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedListing.description}</p>
                </div>
              )}

              {selectedListing.images && selectedListing.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedListing.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedListing.title} ${idx + 1}`}
                        className="w-full rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedListing.status === "pending" && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedListing(null)}>
                    Close
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handleApprove(selectedListing.id)}
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
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this listing
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
    </div >
  );
}
