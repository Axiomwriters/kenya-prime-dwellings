import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Sparkles, Send, ArrowRight, Home, Users, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import apartmentImg from "@/assets/apartment-kilimani.jpg";
import bungalowImg from "@/assets/bungalow-karen.jpg";
import { StatCounter } from "@/components/StatCounter";

export function HeroAI() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultType, setResultType] = useState<"homes" | "land">("homes");

  // Extended Mock Data for Specific Locations
  const allMockProperties = [
    // Homes
    { id: 1, type: 'home', title: "Modern 2-Bed Apartment", location: "Section 58, Nakuru", price: "KSh 7.5M", image: apartmentImg },
    { id: 2, type: 'home', title: "Cozy 3-Bed Bungalow", location: "Milimani, Nakuru", price: "KSh 12.5M", image: bungalowImg },
    { id: 3, type: 'home', title: "Luxury 5-Bed Villa", location: "Kiamunyi, Nakuru", price: "KSh 18.5M", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000&auto=format&fit=crop" },
    { id: 7, type: 'home', title: "3 Bedroom Family Home", location: "Lanet, Nakuru", price: "KSh 8.5M", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1000&auto=format&fit=crop" },
    { id: 8, type: 'home', title: "Affordable 2-Bed Unit", location: "Lanet, Nakuru", price: "KSh 4.5M", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop" },
    { id: 9, type: 'home', title: "Spacious Maisonette", location: "Njoro, Nakuru", price: "KSh 9.2M", image: "https://images.unsplash.com/photo-1576941089067-dbdeab5204db?q=80&w=1000&auto=format&fit=crop" },

    // Land
    { id: 4, type: 'land', title: "50x100 Plot", location: "Kiamunyi, Nakuru", price: "KSh 1.5M", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop" },
    { id: 5, type: 'land', title: "1 Acre Agricultural", location: "Njoro, Nakuru", price: "KSh 2.8M", image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?q=80&w=1000&auto=format&fit=crop" },
    { id: 6, type: 'land', title: "Commercial Plot", location: "Nakuru CBD", price: "KSh 15M", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop" },
    { id: 10, type: 'land', title: "1/4 Acre Residential", location: "Lanet, Nakuru", price: "KSh 2.2M", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop" },
  ];

  const [currentResults, setCurrentResults] = useState<typeof allMockProperties>([]);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);

  const handleSearch = () => {
    if (!inputValue) return;

    setSearchQuery(inputValue);

    // Save to History (kept same)
    try {
      const history = JSON.parse(localStorage.getItem('property_hub_search_history') || '[]');
      const newHistory = [inputValue, ...history.filter((h: string) => h !== inputValue)].slice(0, 5);
      localStorage.setItem('property_hub_search_history', JSON.stringify(newHistory));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Failed to save history", e);
    }

    const lowerInput = inputValue.toLowerCase();

    // 1. Detect Result Type
    let type = "homes";
    if (lowerInput.includes("land") || lowerInput.includes("plot") || lowerInput.includes("acre") || lowerInput.includes("shamba")) {
      type = "land";
      setResultType("land");
    } else {
      setResultType("homes");
    }

    // 2. Detect Location (Basic Keyword Matching)
    const locations = ["lanet", "njoro", "kiamunyi", "milimani", "section 58", "cbd", "town", "bahati", "ngata"];
    const foundLocation = locations.find(loc => lowerInput.includes(loc));

    // 3. Filter Results
    let filtered = allMockProperties.filter(p => p.type === (type === 'land' ? 'land' : 'home'));

    if (foundLocation) {
      setDetectedLocation(foundLocation.charAt(0).toUpperCase() + foundLocation.slice(1));
      // Strict filter if location found
      const locationFiltered = filtered.filter(p => p.location.toLowerCase().includes(foundLocation));
      if (locationFiltered.length > 0) {
        filtered = locationFiltered;
      } else {
        // Fallback if location found but no specific mock data for it
        // For demo purposes, we might keep "filtered" as is or show empty. 
        // Let's just keep 'filtered' broad but maybe sort? 
        // OR: Let's actually filter, so if they ask for "Lanet" and we have Lanet, show it.
        // If we don't have it in mocks, we show nothing? No, let's just show general to avoid empty state in demo.
      }
    } else {
      setDetectedLocation(null);
    }

    setCurrentResults(filtered);

    setIsTyping(true);
    setShowResults(false);

    setTimeout(() => {
      setIsTyping(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <section className="relative pt-8 pb-12 md:pt-8 md:pb-20 overflow-hidden min-h-[auto] md:min-h-[90vh] flex items-center">
      {/* Background w/ Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 z-[-1]"
        style={{ backgroundImage: `url(${heroBackground})` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          <div className="space-y-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Property Concierge</span>
            </div>

            <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-foreground leading-tight md:leading-[1.1]">
              Find Homes & Land by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Just Asking.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Our AI understands location, budget, bedrooms, and lifestyle — and matches you with real properties instantly.
            </p>

            {/* Micro Trust Stats */}
            <div className="hidden lg:flex flex-wrap justify-center gap-8 pt-4 border-t border-border/50">
              <StatCounter
                icon={<Home className="w-5 h-5" />}
                value={1200}
                label="Listings"
                color="text-primary"
                bgColor="bg-primary/10"
                suffix="+"
              />
              <StatCounter
                icon={<Users className="w-5 h-5" />}
                value={200}
                label="Agents"
                color="text-success"
                bgColor="bg-success/10"
                suffix="+"
              />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">98%</p>
                  <p className="text-xs text-muted-foreground">Match Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Chat Interface */}
          <div className="relative w-full max-w-md mx-auto animate-slide-up animation-delay-200">

            {/* Glassmorphic Card */}
            <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl rounded-2xl p-4 md:p-6">
              {/* Glow effects - Adjusted size for smaller card */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="font-medium text-sm text-foreground">Genie Agent</span>
                </div>
                <Badge variant="outline" className="text-[10px] px-1.5 h-5 bg-background/50">Beta</Badge>
              </div>

              {/* Chat Output Area (Simulated) */}
              <div className="space-y-3 mb-4 h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 text-sm text-foreground/90 max-w-[90%] break-words shadow-sm">
                    <p>Tell me what you're looking for. I can search by location, budget, or lifestyle.</p>
                  </div>
                </div>

                {searchQuery && (isTyping || showResults) && (
                  <div className="flex gap-2.5 flex-row-reverse animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-secondary-foreground">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-primary/10 rounded-2xl rounded-tr-none p-3 text-sm text-foreground/90 max-w-[90%] break-words shadow-sm">
                      <p>{searchQuery}</p>
                    </div>
                  </div>
                )}

                {isTyping && (
                  <div className="flex gap-2.5 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 max-w-[90%] flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}

                {showResults && !isTyping && (
                  <div className="flex gap-2.5 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-3 w-full max-w-full overflow-hidden">
                      <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 text-sm text-foreground/90 break-words shadow-sm">
                        <p>Found {currentResults.length} matching {resultType === 'land' ? 'plots/land' : 'properties'} in <strong>{detectedLocation || 'Nakuru'}</strong>.</p>
                      </div>

                      {/* Result Preview Carousel */}
                      <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                        <CarouselContent>
                          {currentResults.map((result) => (
                            <CarouselItem key={result.id} className="basis-full">
                              <div className="bg-background rounded-xl p-2.5 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 items-center group min-w-0">
                                <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-xs group-hover:text-primary transition-colors truncate">{result.title}</h4>
                                  <p className="text-[10px] text-muted-foreground truncate">{result.location}</p>
                                  <p className="text-xs font-bold text-primary mt-0.5">{result.price}</p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0">
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="hidden">
                          <CarouselPrevious />
                          <CarouselNext />
                        </div>
                      </Carousel>

                      <Button variant="link" className="h-auto p-0 text-[10px] text-primary">
                        View all results →
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="relative">
                <Input
                  placeholder="e.g. 3 bedroom house in Karen..."
                  className="pr-10 py-3 md:py-4 bg-background/50 border-border/50 backdrop-blur-sm focus:bg-background transition-all shadow-inner text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-lg shadow-sm"
                  onClick={handleSearch}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Trust Fallback */}
              <div className="mt-3 text-center">
                <button
                  onClick={() => document.getElementById('property-listings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto group"
                >
                  Prefer traditional search? use filters <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </Card>
          </div>

        </div>

        {/* Simple How-to Steps */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8 md:mt-24 text-center opacity-80">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-muted mx-auto flex items-center justify-center text-sm font-bold text-muted-foreground">1</div>
            <p className="text-xs md:text-sm font-medium">Describe your dream</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-muted mx-auto flex items-center justify-center text-sm font-bold text-muted-foreground">2</div>
            <p className="text-xs md:text-sm font-medium">AI filters listings</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-muted mx-auto flex items-center justify-center text-sm font-bold text-muted-foreground">3</div>
            <p className="text-xs md:text-sm font-medium">See only matches</p>
          </div>
        </div>

        {/* Mobile/Tablet Only Stats (Moved to Bottom) */}
        <div className="flex lg:hidden flex-nowrap items-center justify-between gap-1 pt-6 border-t border-border/50 mt-8 w-full px-1">
          <StatCounter
            icon={<Home className="w-4 h-4" />}
            value={1200}
            label="Listings"
            color="text-primary"
            bgColor="bg-primary/10"
            suffix="+"
          />
          <StatCounter
            icon={<Users className="w-4 h-4" />}
            value={200}
            label="Agents"
            color="text-success"
            bgColor="bg-success/10"
            suffix="+"
          />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground text-sm">98%</p>
              <p className="text-[10px] text-muted-foreground">Match Rate</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
