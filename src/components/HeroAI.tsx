import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Sparkles, Send, ArrowRight, Home, Users, TrendingUp, MapPin } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import apartmentImg from "@/assets/apartment-kilimani.jpg";
import bungalowImg from "@/assets/bungalow-karen.jpg";
import { StatCounter } from "@/components/StatCounter";
import { useLocationAgent } from "@/contexts/LocationAgentContext";
import { MOCK_GENIE_PROPERTIES } from "@/data/mockGenieProperties";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function HeroAI() {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResults, setCurrentResults] = useState<any[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const { detectLocationFromText, setLocationFocus } = useLocationAgent();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<{role: 'ai' | 'user', content: string | React.ReactNode}[]>([
    {role: 'ai', content: "Tell me what you're looking for. I can search by location, budget, or lifestyle."}
  ]);
  const [tripList, setTripList] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!inputValue) return;

    const userMsg = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, {role: 'user', content: userMsg}]);
    setIsTyping(true);

    try {
      const detected = detectLocationFromText(userMsg);
      let results: any[] = [];
      const lowerInput = userMsg.toLowerCase();

      // Simulated Intelligence: Paraphrase intent
      let aiResponse = "Got it. I'm looking for properties";
      if (detected) aiResponse += ` in ${detected.name}`;
      if (lowerInput.includes("3 bedroom") || lowerInput.includes("3bd")) aiResponse += " with 3 bedrooms";
      aiResponse += ". Let me see what I can find...";

      setMessages(prev => [...prev, {role: 'ai', content: aiResponse}]);

      // Logic for filtering
      const filteredMocks = MOCK_GENIE_PROPERTIES.filter(p => {
        if (detected && !p.location.toLowerCase().includes(detected.name.toLowerCase())) return false;
        if (lowerInput.includes("land") || lowerInput.includes("plot")) {
          if (p.type !== 'land') return false;
        } else {
          if (p.type !== 'home') return false;
        }
        return true;
      });

      results = filteredMocks.length > 0 ? filteredMocks : MOCK_GENIE_PROPERTIES.slice(0, 3);

      setTimeout(() => {
        setCurrentResults(results);
        const loc = detected ? detected.name : (results[0]?.location.split(',')[0] || 'Nakuru');
        setDetectedLocation(loc);
        setIsTyping(false);
        setShowResults(true);

        const foundMsg = `I found ${results.length} homes that match what you’re looking for. You can tap any listing to view details, or add them to a trip.`;
        setMessages(prev => [...prev, {role: 'ai', content: foundMsg}]);
      }, 1500);

    } catch (e) {
      console.error("Search failed", e);
      setIsTyping(false);
    }
  };

  const addToTrip = (id: string) => {
    if (tripList.includes(id)) return;
    const newList = [...tripList, id];
    setTripList(newList);
    toast.success("Added to your viewing trip!");
    
    if (newList.length === 5) {
      setMessages(prev => [...prev, {
        role: 'ai', 
        content: "You’ve selected enough homes for a viewing trip. Would you like me to help you schedule visits?"
      }]);
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

              {/* Chat Output Area - Concierge Style */}
              <div className="space-y-4 mb-4 h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-2.5 animate-fade-in", msg.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center",
                      msg.role === 'ai' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}>
                      {msg.role === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    </div>
                    <div className={cn(
                      "rounded-2xl p-3 text-sm shadow-sm max-w-[85%] break-words",
                      msg.role === 'ai' ? "bg-muted/50 rounded-tl-none text-foreground/90" : "bg-primary/10 rounded-tr-none text-foreground/90"
                    )}>
                      {typeof msg.content === 'string' ? <p>{msg.content}</p> : msg.content}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 animate-fade-in">
                    <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="relative">
                <Input
                  placeholder="e.g. 3 bedroom house in Karen..."
                  className="pr-10 py-4 bg-background/50 border-border/50 backdrop-blur-sm focus:bg-background transition-all shadow-inner text-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg shadow-sm"
                  onClick={handleSearch}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Results Panel - Scrollable Cards below Chat */}
              {showResults && currentResults.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Home className="w-4 h-4 text-primary" />
                      Matches in {detectedLocation}
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">{currentResults.length} Found</Badge>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {currentResults.map((result) => (
                      <div key={result.id} className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all group">
                        <div className="aspect-video w-full overflow-hidden relative">
                          <img src={result.image} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-background/90 backdrop-blur text-primary border-none shadow-sm">{result.price}</Badge>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-sm truncate">{result.title}</h4>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {result.location}
                          </p>
                          
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <Badge variant="outline" className="text-[9px] h-5">Pet-friendly</Badge>
                            <Badge variant="outline" className="text-[9px] h-5">Parking</Badge>
                            <Badge variant="outline" className="text-[9px] h-5">Garden</Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-[10px] h-8"
                              onClick={() => navigate(`/properties/${result.id}`)}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tripList.includes(result.id) ? "secondary" : "default"}
                              className="text-[10px] h-8 gap-1"
                              onClick={() => addToTrip(result.id)}
                            >
                              {tripList.includes(result.id) ? "✓ Added" : "+ Add to Trip"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {tripList.length > 0 && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Trip: {tripList.length} / 7
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">listings added</span>
                      </div>
                      <Button size="sm" className="h-7 text-[10px] px-3" onClick={() => navigate('/trips')}>
                        Plan Visit
                      </Button>
                    </div>
                  )}
                </div>
              )}

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