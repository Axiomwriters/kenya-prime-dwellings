import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Building2,
  MapPin,
  TrendingUp,
  Shield,
  Sparkles,
  Crown,
  Warehouse,
  GraduationCap,
  Baby,
  Search,
  SlidersHorizontal,
  Bot,
  Plane,
  Heart
} from "lucide-react";
import { mockProperties } from "@/data/mockListings";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MarketInsightDialog } from "@/components/MarketInsightDialog";
import { HeroAI } from "@/components/HeroAI"; // Reuse for AI vibe if needed, or just partial

// --- Configuration ---

const CATEGORY_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  badges: string[];
  icon: any;
  filterLogic: (p: any) => boolean;
  aiPrompts: string[];
}> = {
  "student-housing": {
    title: "Best Student Housing Near Egerton & Kabarak",
    subtitle: "High-demand student listings with strong rental turnover.",
    badges: ["Student Friendly", "High Yield", "Egerton", "Kabarak"],
    icon: GraduationCap,
    filterLogic: (p) => p.price < 35000 || p.title.toLowerCase().includes("studio") || p.title.toLowerCase().includes("hostel"),
    aiPrompts: ["Find bedsitters under 10k", "Hostels near Egerton gate", "Best for group sharing"]
  },
  "family-homes": {
    title: "Family Homes in Section 58 & Milimani",
    subtitle: "Spacious bungalows and gated homes for growing families.",
    badges: ["Family Friendly", "Secure", "Garden"],
    icon: Baby,
    filterLogic: (p) => p.category === "Residential" && (p.bedrooms || 0) >= 3,
    aiPrompts: ["Homes near prestigious schools", "3+ bedrooms with DSQ", "Quiet gated estates"]
  },
  "investment": {
    title: "High-ROI Properties in Nakuru",
    subtitle: "Verified rental income properties and land with growth potential.",
    badges: ["Investor Pick", "High Yield", "Verified Returns"],
    icon: TrendingUp,
    filterLogic: (p) => p.category === "Land" || p.price < 15000000,
    aiPrompts: ["Show me 12%+ ROI", "Undervalued land deals", "Apartments with waiting tenants"]
  },
  "gated-communities": {
    title: "Secure Gated Communities in Nakuru",
    subtitle: "Modern estates with 24/7 security and family-friendly amenities.",
    badges: ["24/7 Security", "Gated", "Family Friendly"],
    icon: Shield,
    filterLogic: (p) => p.description.toLowerCase().includes("gated") || p.description.toLowerCase().includes("secure") || p.category === "Townhouse",
    aiPrompts: ["Safest estates for expats", "Communities with a pool", "New developments launching soon"]
  },
  "first-time-buyers": {
    title: "Affordable Starter Homes in Nakuru",
    subtitle: "Low-deposit homes and apartments perfect for your first purchase.",
    badges: ["Starter Home", "Low Deposit", "Finance Available"],
    icon: Sparkles,
    filterLogic: (p) => p.price < 8000000,
    aiPrompts: ["Homes under 5M", "Check my loan eligibility", "Rent-to-own options"]
  },
  "luxury-living": {
    title: "Luxury Homes in Milimani & Section 58",
    subtitle: "Premium villas and executive apartments for the discerning buyer.",
    badges: ["Luxury Collection", "Premium Finish", "Pool"],
    icon: Crown,
    filterLogic: (p) => p.price > 20000000 || p.description.toLowerCase().includes("luxury"),
    aiPrompts: ["Villas with lake view", "Penthouses in Nakuru CBD", "Homes with private gym"]
  },
  "warehouses": {
    title: "Warehouses Along Nakuru–Nairobi Highway",
    subtitle: "Strategic industrial spaces and logistics hubs.",
    badges: ["Industrial", "Highway Access", "Logistic Hub"],
    icon: Warehouse,
    filterLogic: (p) => p.category === "Commercial" || p.description.toLowerCase().includes("warehouse"),
    aiPrompts: ["Godowns 5000+ sqft", "Industrial land for sale", "Near Lanet airstrip"]
  },
  "mixed-use": {
    title: "Mixed-Use Developments in Nakuru CBD",
    subtitle: "Commercial-residential opportunities for dynamic investment.",
    badges: ["Commercial + Resi", "High Foot Traffic", "CBD"],
    icon: Building2,
    filterLogic: (p) => p.category === "Commercial" || p.description.toLowerCase().includes("office"),
    aiPrompts: ["Shops with apartments above", "CBD redevelopment plots", "Office blocks for sale"]
  },
};

export default function ExplorePage() {
  const { category } = useParams<{ category: string }>();
  const config = CATEGORY_CONFIG[category || ""] || {
    title: "Explore Premium Properties",
    subtitle: "Discover the best listings tailored to your needs.",
    badges: [],
    icon: MapPin,
    filterLogic: () => true,
    aiPrompts: ["Show best value", "New listings today"]
  };

  const [activeSort, setActiveSort] = useState("recommended");
  const [showAi, setShowAi] = useState(false);

  // Filter properties based on config
  const filteredProperties = useMemo(() => {
    let props = mockProperties.filter(config.filterLogic);

    // Sort logic (Mock)
    if (activeSort === "price-asc") props.sort((a, b) => a.price - b.price);
    if (activeSort === "price-desc") props.sort((a, b) => b.price - a.price);

    // If no props found (since mock data is limited), default to all to populate the UI for demo
    if (props.length === 0) return mockProperties.slice(0, 6);

    return props;
  }, [category, activeSort]);

  // Calculate stats
  const avgPrice = useMemo(() => {
    if (filteredProperties.length === 0) return 0;
    const total = filteredProperties.reduce((sum, p) => sum + p.price, 0);
    return Math.floor(total / filteredProperties.length);
  }, [filteredProperties]);

  const Icon = config.icon;

  const handleAiAction = (prompt: string) => {
    toast.info(`AI: "Searching for ${prompt}..."`);
    // Connect to actual AI logic here
  };

  const handleTripBuild = () => {
    toast.success("Added to Trip Builder! Check your Trips.");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>{config.title} | Kenya Prime Dwellings</title>
        <meta name="description" content={config.subtitle} />
      </Helmet>

      {/* --- Top Header Section --- */}
      <div className="pt-24 pb-8 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-background border-b border-border/50">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Breadcrumb / Badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Explore</span>
            <span>/</span>
            <span className="capitalize text-primary font-medium">{category?.replace("-", " ")}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {config.title}
              </h1>
              <p className="text-lg text-muted-foreground/90 border-l-2 border-primary/50 pl-4 py-1 italic">
                "{config.subtitle}"
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur border-primary/20 text-foreground">
                  {filteredProperties.length} verified listings
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-background/50 backdrop-blur border-primary/20 text-foreground">
                  Avg Price KSh {(avgPrice / 1000000).toFixed(1)}M
                </Badge>
                <Badge variant="default" className="rounded-full px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">
                  🔥 High Demand Area
                </Badge>
              </div>
            </div>

            {/* Market Pulse Banner */}
            <div className="hidden md:block">
              <Button variant="outline" onClick={() => toast.info("Opening Market Insights")} className="h-auto py-3 px-4 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all group">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide group-hover:text-primary">Market Pulse</div>
                  <div className="text-sm font-semibold flex items-center justify-end gap-2 text-foreground">
                    19 listings in high-growth zones
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Smart Filter Row (Sticky) --- */}
      <div className="sticky top-[64px] z-30 bg-background/80 backdrop-blur-md border-y border-border/50 py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">

          <div className="flex items-center gap-2 min-w-max">
            <Button variant="outline" size="sm" className="rounded-full border-border/50 bg-background hover:bg-muted/50">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
              Filters
            </Button>
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Select>
              <SelectTrigger className="w-[140px] h-8 rounded-full border-border/50 text-xs bg-transparent">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Under 5M</SelectItem>
                <SelectItem value="mid">5M - 20M</SelectItem>
                <SelectItem value="high">20M+</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[130px] h-8 rounded-full border-border/50 text-xs bg-transparent">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="rounded-full text-xs hover:bg-primary/10 hover:text-primary">
              Buy
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full text-xs hover:bg-primary/10 hover:text-primary">
              Rent
            </Button>
          </div>

          <div className="flex items-center gap-2 min-w-max">
            <span className="text-xs text-muted-foreground hidden lg:inline">Sort by:</span>
            <Select value={activeSort} onValueChange={setActiveSort}>
              <SelectTrigger className="w-[160px] h-8 border-none shadow-none text-xs font-medium bg-transparent focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">✨ AI Recommended</SelectItem>
                <SelectItem value="newest">Newest Listed</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property, index) => (
              <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <PropertyCard
                  property={{
                    ...property,
                    priceFormatted: `KSh ${property.price.toLocaleString()}`,
                    price: `KSh ${property.price.toLocaleString()}`,
                    beds: property.bedrooms || 0,
                    baths: property.bathrooms || 0,
                    sqm: parseInt(property.land_size || "0") || 0, // crude parsing
                    type: property.listing_type === 'sale' ? "For Sale" : "For Rent",
                    propertyType: property.category,
                    isHighGrowth: Math.random() > 0.5, // Mock data enrichment
                    images: [property.image]
                  }}
                  intentTags={[
                    property.listing_type === 'sale' ? "For Sale" : "For Rent",
                    ...(config.badges || []),
                    ...(index % 3 === 0 ? ["Verified"] : [])
                  ].slice(0, 3)}
                  // Reuse the microData logic or mock it
                  microData={[
                    { icon: TrendingUp, label: "Proj. ROI", value: "+12%" },
                    { icon: MapPin, label: "Zone", value: "Zone A" }
                  ]}
                />
                {/* Smart Page Section Injection (Mock) - Every 6 items */}
                {index === 5 && (
                  <div className="col-span-full py-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border mt-6">
                    <h3 className="text-lg font-semibold mb-2">Not finding what you need?</h3>
                    <p className="text-muted-foreground mb-4">Our AI can scan off-market listings for you.</p>
                    <Button variant="default" onClick={() => handleAiAction("off-market scan")}>
                      <Bot className="w-4 h-4 mr-2" />
                      Ask AI to Find More
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No listings found in this category yet.</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Our inventory is growing. Check back soon or chat with our AI to get notified when listings appear.
            </p>
            <Button onClick={() => handleAiAction("notify me")}>Notify Me</Button>
          </div>
        )}
      </main>

      {/* --- AI Page Companion (Floating) --- */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">

        {/* Helper Bubble */}
        {showAi && (
          <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-4 w-72 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Looking for the best value in {config.title.split(' ').slice(-2).join(' ')} or something near schools?
                </p>
                <div className="flex flex-col gap-2">
                  {config.aiPrompts.map((prompt, i) => (
                    <button key={i} onClick={() => handleAiAction(prompt)} className="text-xs text-left px-3 py-2 rounded-lg bg-muted hover:bg-primary/5 hover:text-primary transition-colors">
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={handleTripBuild}
            className="rounded-full shadow-lg bg-white text-black hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 border border-transparent"
          >
            <Plane className="w-4 h-4 mr-2" />
            Build Viewing Trip
          </Button>

          <Button
            size="icon"
            className={`rounded-full h-14 w-14 shadow-xl transition-all ${showAi ? 'bg-primary rotate-0' : 'bg-foreground rotate-0'}`}
            onClick={() => setShowAi(!showAi)}
          >
            <Bot className="w-6 h-6" />
          </Button>
        </div>
      </div>

    </div>
  );
}
