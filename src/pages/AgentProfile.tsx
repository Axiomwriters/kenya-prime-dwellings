import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Phone, MessageCircle, CheckCircle, Home } from "lucide-react";
import { toast } from "sonner";

interface AgentProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  county: string | null;
  city: string | null;
  phone: string | null;
  whatsapp: string | null;
  verification_status: string | null;
  listings_count: number;
}

interface AgentListing {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  land_size: string | null;
  category: string;
  listing_type: string;
}

export default function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [listings, setListings] = useState<AgentListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAgentProfile();
    }
  }, [id]);

  const fetchAgentProfile = async () => {
    try {
      setLoading(true);

      // Fetch agent profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          avatar_url,
          bio,
          county,
          city,
          phone,
          whatsapp
        `)
        .eq("id", id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        toast.error("Agent not found");
        navigate("/");
        return;
      }

      // Fetch verification status
      const { data: verificationData } = await supabase
        .from("agent_verifications")
        .select("status")
        .eq("user_id", id)
        .maybeSingle();

      // Fetch agent's approved listings count and data
      const { data: listingsData, error: listingsError, count } = await supabase
        .from("agent_listings")
        .select("*", { count: "exact" })
        .eq("agent_id", id)
        .eq("status", "approved")
        .order("published_at", { ascending: false });

      if (listingsError) throw listingsError;

      setAgent({
        ...profileData,
        verification_status: verificationData?.status || null,
        listings_count: count || 0,
      });

      setListings(listingsData || []);
    } catch (error) {
      console.error("Error fetching agent profile:", error);
      toast.error("Failed to load agent profile");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!agent?.whatsapp) {
      toast.error("WhatsApp number not available");
      return;
    }
    const message = `Hi ${agent.full_name}! I found your profile on KenyaHomes and I'm interested in your property listings.`;
    const whatsappUrl = `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleCall = () => {
    if (!agent?.phone) {
      toast.error("Phone number not available");
      return;
    }
    window.open(`tel:${agent.phone}`);
    toast.success("Initiating call...");
  };

  const handleListingClick = (listingId: string) => {
    navigate(`/properties/${listingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Agent Not Found</h2>
          <p className="text-muted-foreground mb-4">The agent profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Agent Profile Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-32 h-32 mb-4 border-4 border-border shadow-lg">
                    <AvatarImage src={agent.avatar_url || undefined} alt={agent.full_name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {agent.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>

                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {agent.full_name}
                  </h1>

                  {agent.verification_status === "approved" && (
                    <Badge className="mb-3 bg-success text-success-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Agent
                    </Badge>
                  )}

                  {(agent.county || agent.city) && (
                    <div className="flex items-center gap-1 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {agent.city && agent.county
                          ? `${agent.city}, ${agent.county}`
                          : agent.city || agent.county}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {agent.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {agent.bio}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="mb-6 p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{agent.listings_count}</p>
                      <p className="text-xs text-muted-foreground">Active Listings</p>
                    </div>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Contact Agent</h3>
                  
                  {agent.whatsapp && (
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}

                  {agent.phone && (
                    <Button
                      onClick={handleCall}
                      variant="outline"
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listings Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Property Listings
            </h2>

            {listings.length === 0 ? (
              <Card className="p-12 text-center">
                <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Active Listings
                </h3>
                <p className="text-muted-foreground">
                  This agent doesn't have any active property listings at the moment.
                </p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
                    onClick={() => handleListingClick(listing.id)}
                  >
                    {/* Property Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}

                      <Badge
                        className={`absolute top-3 right-3 ${
                          listing.listing_type === "sale"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        For {listing.listing_type === "sale" ? "Sale" : "Rent"}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-xl font-bold text-primary mb-2">
                        KSh {listing.price.toLocaleString()}
                        {listing.listing_type === "rent" && <span className="text-sm font-normal">/month</span>}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        {listing.location}
                      </div>

                      {/* Property Features */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {listing.category === "house" && listing.bedrooms && (
                          <span>{listing.bedrooms} Beds</span>
                        )}
                        {listing.category === "house" && listing.bathrooms && (
                          <span>{listing.bathrooms} Baths</span>
                        )}
                        {listing.land_size && (
                          <span>{listing.land_size}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
