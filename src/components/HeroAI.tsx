import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useLocationAgent } from "@/contexts/LocationAgentContext";
import { MOCK_GENIE_PROPERTIES } from "@/data/mockGenieProperties";

export function HeroAI() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultType, setResultType] = useState<"homes" | "land">("homes");
  const { detectLocationFromText, setLocationFocus } = useLocationAgent();
  const navigate = useNavigate();

  const allMockProperties = MOCK_GENIE_PROPERTIES;



  const [currentResults, setCurrentResults] = useState<any[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [pipelineInstance, setPipelineInstance] = useState<any>(null);

  useEffect(() => {
    // Preload model
    import("@xenova/transformers").then(({ pipeline }) => {
      pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2").then((pipe) => {
        setPipelineInstance(() => pipe);
      });
    });
  }, []);

  const handleSearch = async () => {
    if (!inputValue) return;

    setSearchQuery(inputValue);
    setIsTyping(true);
    setShowResults(false);

    try {
      // Save History
      const history = JSON.parse(localStorage.getItem('property_hub_search_history') || '[]');
      const newHistory = [inputValue, ...history.filter((h: string) => h !== inputValue)].slice(0, 5);
      localStorage.setItem('property_hub_search_history', JSON.stringify(newHistory));
      window.dispatchEvent(new Event('storage'));

      // AI Search Logic
      let results: any[] = [];

      if (pipelineInstance) {
        // 1. Generate Embedding
        const output = await pipelineInstance(inputValue, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);

        // 2. Search via RPC
        const { data, error } = await import("@/integrations/supabase/client")
          .then(m => m.supabase.rpc('match_properties', {
            query_embedding: embedding,
            match_threshold: 0.2, // Lower threshold for better recall in demo
            match_count: 5
          }));

        results = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          location: p.location,
          price: `KSh ${p.price.toLocaleString()}`,
          image: p.image_url || apartmentImg
        }));
      }

      // 3. Fallback/Local Mock Search (Crucial for "Inbuilt" feel with no backend)
      // If AI returns nothing or we just want to force a match for demo:
      if (results.length === 0) {
        const lowerInput = inputValue.toLowerCase();
        const detected = detectLocationFromText(inputValue);

        const filteredMocks = MOCK_GENIE_PROPERTIES.filter(p => {
          // Filter by Location if detected
          if (detected && !p.location.toLowerCase().includes(detected.name.toLowerCase())) return false;
          // Filter by Type if detected
          if (lowerInput.includes("land") || lowerInput.includes("plot")) {
            if (p.type !== 'land') return false;
          } else if (lowerInput.includes("house") || lowerInput.includes("home") || lowerInput.includes("apartment")) {
            if (p.type !== 'home') return false;
          }
          return true;
        });

        // If we have close matches, use them
        if (filteredMocks.length > 0) {
          results = filteredMocks;
        } else {
          // Just show some random ones if completely no match, but preferred to show empty
          results = [];
        }
      }

      // Fallback/Simulated delay if no AI or empty results (for UX feel)
      setTimeout(() => {
        setCurrentResults(results);

        // Simple regex for 'Land' vs 'Home' just for UI tag
        const lowerInput = inputValue.toLowerCase();
        if (lowerInput.includes("land") || lowerInput.includes("plot")) {
          setResultType("land");
        } else {
          setResultType("homes");
        }


        // Detect location name from result or query using Location Agent
        const detected = detectLocationFromText(inputValue);
        if (detected) {
          setDetectedLocation(detected.name);
          setLocationFocus(detected);
        } else if (results.length > 0) {
          // Fallback to result location if agent doesn't detect it in query
          setDetectedLocation(results[0].location.split(',')[0]);
        } else {
          setDetectedLocation(null);
        }

        setIsTyping(false);
        setShowResults(true);
      }, 1500);

    } catch (e) {
      console.error("Search failed", e);
      setIsTyping(false);
    }
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

                        {detectedLocation && detectedLocation !== 'Nakuru' && (
                          <div className="mt-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
                            <span className="font-semibold text-primary block mb-1">Targeting: {detectedLocation}</span>
                            Popular here:
                            <div className="flex flex-wrap gap-1 mt-1">
                              {['Apartment', 'House', 'Land'].map(tag => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-md">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}
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
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/properties/${result.id}`);
                                  }}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                          <CarouselPrevious className="h-6 w-6 relative left-0 translate-x-0 hover:bg-primary hover:text-primary-foreground border-border/50" />
                        </div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                          <CarouselNext className="h-6 w-6 relative right-0 translate-x-0 hover:bg-primary hover:text-primary-foreground border-border/50" />
                        </div>
                      </Carousel>

                      <Button
                        variant="link"
                        className="h-auto p-0 text-[10px] text-primary"
                        onClick={() => navigate(detectedLocation ? `/properties?search=${detectedLocation}` : '/properties')}
                      >
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
                  onClick={() => navigate('/properties')}
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
