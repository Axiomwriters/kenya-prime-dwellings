import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  Home,
  Calendar,
  Star,
  Award,
  Clock,
  Building2
} from "lucide-react";
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
  created_at?: string;
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
          whatsapp,
          created_at
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
          <Skeleton className="h-48 w-full rounded-xl mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full" />
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
    <div className="min-h-screen bg-background animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 w-full">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl shrink-0">
              <AvatarImage src={agent.avatar_url || undefined} alt={agent.full_name} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {agent.full_name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2 pt-2 md:pt-0 md:mb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold text-foreground">{agent.full_name}</h1>
                {agent.verification_status === "approved" && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 w-fit border-green-200">
                    <CheckCircle className="w-3 h-3" /> Verified Agent
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {(agent.county || agent.city) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {agent.city && agent.county
                      ? `${agent.city}, ${agent.county}`
                      : agent.city || agent.county}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(agent.created_at || Date.now()).getFullYear()}
                </span>
                <span className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {agent.listings_count} Active Listings
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto md:mb-4">
              {agent.whatsapp && (
                <Button
                  onClick={handleWhatsApp}
                  className="flex-1 md:flex-none bg-[#25D366] hover:bg-[#20BA5A] text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}
              {agent.phone && (
                <Button
                  onClick={handleCall}
                  variant="outline"
                  className="flex-1 md:flex-none"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {agent.bio || "No bio available for this agent."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Properties Sold</p>
                  <p className="text-sm text-muted-foreground">12+ (Last 12 months)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">Typically replies within 1 hr</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Client Rating</p>
                  <p className="text-sm text-muted-foreground">4.8/5.0 (24 reviews)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
              <TabsTrigger
                value="listings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Active Listings ({mockProperties.length})
              </TabsTrigger>
              <TabsTrigger
                value="sold"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Sold Properties
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-6">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {mockProperties.map((property) => (
                    <CarouselItem key={property.id} className="pl-4 md:basis-1/2">
                      <Card
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                        onClick={() => handleListingClick(property.id)}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                            {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>
                          <p className="text-xl font-bold text-primary mb-2">
                            KSh {property.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms}</span>
                            <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>
                            <span className="flex items-center gap-1"><Square className="w-4 h-4" /> {property.land_size}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            </TabsContent>

            <TabsContent value="sold" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sold properties history coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Client reviews coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
