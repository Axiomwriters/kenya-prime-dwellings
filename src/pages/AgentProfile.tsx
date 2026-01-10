import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PropertyImageCarousel } from "@/components/PropertyImageCarousel";
import { MarketInsightDialog } from "@/components/MarketInsightDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft, MapPin, Phone, MessageCircle, CheckCircle,
  Star, Trophy, Building2, Users, Briefcase, Mail,
  Home, Bed, Bath, Square, ArrowUpRight, LineChart,
  ShieldCheck, Sparkles, ChevronRight, Calendar, Clock
} from "lucide-react";
import { toast } from "sonner";
import { mockAgents } from "@/data/mockAgents";
import { mockProperties, Property } from "@/data/mockListings";

export default function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find agent from mock data or fallback to first one for demo
  const agent = useMemo(() => {
    return mockAgents.find(a => a.id === id) || mockAgents.find(a => a.name === "Elena Rodriguez") || mockAgents[0];
  }, [id]);

  // Default to first specialization if available
  const [activePurpose, setActivePurpose] = useState<string>(agent.specializations?.[0] || "All Listings");
  const [showMarketInsight, setShowMarketInsight] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter listings based on active purpose (Mock Logic)
  const filteredListings = useMemo(() => {
    // Duplicate for demo volume
    let listings = [...mockProperties, ...mockProperties].map((p, i) => ({ ...p, uniqueId: `${p.id}-${i}`, originalId: p.id }));

    if (activePurpose === "All Listings") return listings;

    return listings.filter(item => {
      // Mock tagging logic
      if (activePurpose === "Luxury Living") return item.price >= 40000000;
      if (activePurpose === "Family Homes") return item.bedrooms >= 4;
      if (activePurpose === "Investment") return item.category === "Apartment" || item.category === "Commercial" || item.listing_type === "short_stay";
      if (activePurpose === "Gated Communities") return item.location.includes("Karen") || item.location.includes("Runda") || item.location.includes("Thika");

      // Fallback for other potential tags
      return true;
    });
  }, [activePurpose]);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=Hi ${agent.name}, I found your profile on PropertyHub...`, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+254700000000"); // Mock phone
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/properties/${propertyId}`);
    toast.success("Navigating to property details...");
  };

  const handleMarketInsight = (property: Property) => {
    setSelectedProperty(property);
    setShowMarketInsight(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#020817] dark:text-white pb-24 md:pb-20">

      {/* Navigation Bar */}
      <div className="sticky top-0 left-0 right-0 z-50 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/40 dark:border-white/5 supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 mr-1" /> Back
          </Button>
          <div className="md:hidden font-semibold text-sm opacity-0 animate-in fade-in slide-in-from-top-2 duration-700 delay-300 fill-mode-forwards">
            {agent.name}
          </div>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pt-6 md:pt-10">

        {/* --- 1. Agent Value Header --- */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">

          {/* Avatar Area */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-start shrink-0">
            <div className="relative group mx-auto md:mx-0">
              <div className={`absolute -inset-1 rounded-full opacity-75 blur-md transition duration-500 group-hover:opacity-100 ${agent.verified ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500' : 'bg-primary'}`}></div>
              <Avatar className="w-32 h-32 md:w-48 md:h-48 border-[6px] border-background dark:border-[#020817] relative z-10 shadow-2xl">
                <AvatarImage src={agent.avatar} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">{agent.name[0]}</AvatarFallback>
              </Avatar>
              {agent.topRated && (
                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20 bg-amber-500 text-white p-2 rounded-full border-4 border-background dark:border-[#020817] shadow-lg flex items-center justify-center" title="Top Rated">
                  <Trophy className="w-5 h-5 fill-current" />
                </div>
              )}
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 text-center md:text-left space-y-5 w-full">
            <div>
              {/* Primary Line (Authority) */}
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white">
                  {agent.name}
                </h1>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 h-7 text-sm font-medium rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Verified Agent
                </Badge>
              </div>
              <p className="text-xl text-emerald-600 dark:text-emerald-400 font-semibold">{agent.role}</p>

              {/* Secondary Line (Purpose Alignment) */}
              {agent.specializations && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3 text-muted-foreground dark:text-slate-400">
                  <span className="text-sm font-medium mr-1 text-foreground/80 dark:text-gray-300">Specializes in:</span>
                  {agent.specializations.map((spec: string, i: number) => (
                    <span key={spec} className="flex items-center text-sm">
                      {i > 0 && <span className="mx-2 opacity-30">·</span>}
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Micro Proof Strip */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 pt-1">
              <div className="flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold">{agent.rating}</span>
                <span className="text-xs opacity-80 decoration-dotted underline cursor-pointer hover:opacity-100">({agent.reviews} Reviews)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 cursor-default">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">98% Reputation Score</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground bg-muted/50 dark:bg-white/5 border border-transparent hover:border-border transition-colors cursor-default">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Top 5% Agent in Nairobi</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground bg-muted/50 dark:bg-white/5 border border-transparent hover:border-border transition-colors cursor-default">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{agent.location}</span>
              </div>
            </div>

            {/* Desktop Quick Actions */}
            <div className="hidden md:flex gap-3 pt-2">
              <Button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl shadow-lg shadow-green-900/10">
                <MessageCircle className="w-4 h-4 mr-2" /> Chat with {agent.name.split(' ')[0]}
              </Button>
              <Button onClick={handleCall} variant="outline" className="border-input hover:bg-accent hover:text-accent-foreground dark:border-white/10 dark:hover:bg-white/5 rounded-xl">
                Book a Viewing
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* --- 4. Agent Promise Block (Left Col) --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card dark:bg-[#0f172a] border border-border dark:border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm group hover:border-emerald-500/30 transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-500">
                <ShieldCheck className="w-32 h-32 transform rotate-12" />
              </div>

              <div className="relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Agent Promise
                </h3>
                <div className="text-2xl md:text-3xl font-serif leading-tight text-foreground dark:text-white mb-6">
                  "{agent.promiseText || agent.persuasion}"
                </div>

                {agent.commitments && (
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {agent.commitments.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground dark:text-slate-300">
                        <div className="mt-1 bg-emerald-500/20 p-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* --- 6. Listings Section (Integrated) --- */}
            <div className="sticky top-20 z-40 bg-background shadow-lg shadow-black/5 dark:shadow-black/20 rounded-xl border border-border/50 pb-4 mb-8">
              {/* Sticky Header Section */}
              <div className="bg-background shadow-sm pt-4 pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0 border-b border-border/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground dark:text-white">Curated by {agent.name.split(' ')[0]}</h2>
                    <p className="text-muted-foreground text-sm">Hand-picked properties matching your lifestyle.</p>
                  </div>
                </div>

                {/* Purpose Tabs */}
                {agent.specializations && (
                  <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                    <Button
                      onClick={() => setActivePurpose("All Listings")}
                      variant={activePurpose === "All Listings" ? "default" : "outline"}
                      className={`rounded-full whitespace-nowrap mb-1 ${activePurpose === "All Listings" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" : "bg-transparent border-muted hover:border-foreground/30 text-muted-foreground"}`}
                    >
                      All Listings
                    </Button>
                    {agent.specializations.map((spec: string) => (
                      <Button
                        key={spec}
                        onClick={() => setActivePurpose(spec)}
                        variant={activePurpose === spec ? "default" : "outline"}
                        className={`rounded-full whitespace-nowrap mb-1 ${activePurpose === spec ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" : "bg-transparent border-muted hover:border-foreground/30 text-muted-foreground"}`}
                      >
                        {spec}
                      </Button>
                    ))}
                    {!agent.specializations && ["Luxury Living", "Family Homes", "Investment"].map(cat => (
                      <Button key={cat} onClick={() => setActivePurpose(cat)} variant={activePurpose === cat ? "default" : "outline"} className={`rounded-full mb-1 ${activePurpose === cat ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>{cat}</Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Listings Carousel */}
              <div className="relative group/carousel">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {filteredListings.slice(0, 8).map((property, idx) => (
                      <CarouselItem key={property.uniqueId} className="pl-4 md:basis-1/2 lg:basis-1/2 xl:basis-1/2">
                        <div className="group rounded-xl overflow-hidden bg-card dark:bg-[#0f172a] border border-border dark:border-white/5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/5 flex flex-col h-full">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <PropertyImageCarousel
                              images={[property.image, property.image]}
                              title={property.title}
                            />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                              {idx === 0 && (
                                <Badge className="bg-emerald-600 text-white border-0 shadow-sm backdrop-blur-md">
                                  Editor's Pick
                                </Badge>
                              )}
                              {activePurpose !== "All Listings" && (
                                <Badge variant="secondary" className="bg-white/90 dark:bg-black/60 text-foreground dark:text-white backdrop-blur-md border border-white/20">
                                  {activePurpose}
                                </Badge>
                              )}
                            </div>

                            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg pointer-events-none">
                              KSh {property.price.toLocaleString()}
                            </div>
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-foreground dark:text-white line-clamp-1 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mb-3">
                              <MapPin className="w-3 h-3 mr-1" /> {property.location}
                            </div>

                            <div className="flex justify-between items-center text-sm text-muted-foreground/80 mb-4 bg-muted/30 p-2 rounded-lg">
                              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bedrooms}</span>
                              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms}</span>
                              <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" /> {property.land_size}</span>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-2">
                              <Button size="sm" onClick={() => handleViewProperty(property.originalId)} className="w-full bg-foreground text-background hover:bg-foreground/90 dark:bg-white dark:text-black dark:hover:bg-white/90 font-medium h-9">
                                Details
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleMarketInsight(property)} className="w-full border-input bg-transparent dark:border-white/10 dark:text-slate-300 h-9">
                                Insights
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Navigation Buttons */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-start z-20 pl-2">
                    <div className="pointer-events-auto transform transition-transform hover:scale-110">
                      <CarouselPrevious className="static translate-y-0 h-10 w-10 border-0 bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg" />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end z-20 pr-2">
                    <div className="pointer-events-auto transform transition-transform hover:scale-110">
                      <CarouselNext className="static translate-y-0 h-10 w-10 border-0 bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg" />
                    </div>
                  </div>
                </Carousel>
              </div>

              {filteredListings.length > 8 && (
                <Button variant="ghost" className="w-full mt-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  View All {filteredListings.length} Curated Listings <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

          </div>

          {/* --- 5. Actionable Stats & Sidebar (Right Col) --- */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div onClick={() => setActivePurpose("All Listings")} className="bg-card dark:bg-[#0f172a] p-5 rounded-xl border border-border dark:border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-foreground dark:text-white">{agent.deals}</div>
                <div className="text-sm text-muted-foreground">Properties Sold</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">View History</div>
              </div>

              <div className="bg-card dark:bg-[#0f172a] p-5 rounded-xl border border-border dark:border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-foreground dark:text-white">{agent.clients}</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">Read Reviews</div>
              </div>

              <div onClick={() => setActivePurpose("All Listings")} className="col-span-2 lg:col-span-1 bg-card dark:bg-[#0f172a] p-5 rounded-xl border border-border dark:border-white/5 hover:border-emerald-500/50 cursor-pointer transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Home className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-foreground dark:text-white">{agent.totalListings}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
                <div className="text-xs text-purple-600 mt-1 font-medium">Filter View</div>
              </div>
            </div>

            {/* Contact Card (Desktop Sidebar) */}
            <div className="bg-muted/30 dark:bg-white/5 rounded-2xl p-6 border border-border/50 dark:border-white/5 hidden lg:block sticky top-24">
              <h3 className="font-semibold text-foreground dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1da851] text-white shadow-md">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
                <Button onClick={handleCall} variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" /> Show Number
                </Button>
                <Button variant="ghost" className="w-full text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" /> Send Email
                </Button>
              </div>
              <Separator className="my-6" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium text-foreground dark:text-white">&lt; 1 Hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages</span>
                  <span className="font-medium text-foreground dark:text-white">English, Swahili</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* --- Mobile Sticky Action Bar --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50 pb-safe">
        <div className="grid grid-cols-3 gap-3">
          <Button onClick={handleCall} variant="outline" className="flex flex-col h-auto py-2 gap-1 rounded-xl border-input dark:border-white/10">
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-medium">Call</span>
          </Button>
          <Button onClick={handleWhatsApp} className="flex flex-col h-auto py-2 gap-1 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white col-span-2">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Chat with Elena</span>
          </Button>
        </div>
      </div>

      {/* Market Insight Dialog */}
      {selectedProperty && (
        <MarketInsightDialog
          open={showMarketInsight}
          onOpenChange={setShowMarketInsight}
          property={{
            title: selectedProperty.title,
            location: selectedProperty.location,
            price: `KSh ${selectedProperty.price.toLocaleString()}`,
            propertyType: selectedProperty.category || "Property"
          }}
        />
      )}
    </div>
  );
}
