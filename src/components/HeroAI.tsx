import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Send, ArrowRight, Home, Users, TrendingUp, MapPin, ClipboardList, BarChart3, Construction } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { StatCounter } from "@/components/StatCounter";
import { useLocationAgent } from "@/contexts/LocationAgentContext";
import { MOCK_GENIE_PROPERTIES } from "@/data/mockGenieProperties";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MessageRole = 'ai' | 'user';
type GenieMode = 'DISCOVERY' | 'TRIP' | 'ANALYTICAL' | 'PROJECT';

interface Message {
  role: MessageRole;
  content: string | React.ReactNode;
  mode?: GenieMode;
}

export function HeroAI() {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentResults, setCurrentResults] = useState<any[]>([]);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [mode, setMode] = useState<GenieMode>('DISCOVERY');
  const { detectLocationFromText } = useLocationAgent();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai', 
      content: "Tell me what you're looking for. I can search by location, budget, or lifestyle.",
      mode: 'DISCOVERY'
    }
  ]);
  const [tripList, setTripList] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    // Detect Mode
    let newMode: GenieMode = 'DISCOVERY';
    const lowerInput = userMsg.toLowerCase();
    
    if (lowerInput.includes("roi") || lowerInput.includes("yield") || lowerInput.includes("portfolio") || lowerInput.includes("invest")) {
      newMode = 'ANALYTICAL';
    } else if (lowerInput.includes("build") || lowerInput.includes("construction") || lowerInput.includes("material")) {
      newMode = 'PROJECT';
    }
    
    setMode(newMode);

    try {
      const detected = detectLocationFromText(userMsg);
      let results: any[] = [];

      // Genie Voice Logic
      let aiResponse = "";
      if (newMode === 'ANALYTICAL') {
        aiResponse = "Switching to analytical mode. I'll provide market comparisons and signals for your investment inquiry.";
      } else if (newMode === 'PROJECT') {
        aiResponse = "I've opened your project workspace. Let's look at building plans and material estimates.";
      } else {
        aiResponse = `Based on ${detected?.name || 'your request'} and current availability, these options match your needs.`;
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse, mode: newMode }]);
        
        const filteredMocks = MOCK_GENIE_PROPERTIES.filter(p => {
          if (detected && !p.location.toLowerCase().includes(detected.name.toLowerCase())) return false;
          if (lowerInput.includes("land") || lowerInput.includes("plot")) {
            return p.type === 'land';
          }
          return p.type === 'home';
        });

        results = filteredMocks.length > 0 ? filteredMocks : MOCK_GENIE_PROPERTIES.slice(0, 3);
        setCurrentResults(results);
        setDetectedLocation(detected?.name || (results[0]?.location.split(',')[0] || 'Kenya'));
        setIsTyping(false);
        setShowResults(true);

        const followUp = newMode === 'ANALYTICAL' 
          ? "I've flagged high-level market signals here. Remember, these are comparisons, not guarantees."
          : "You can tap any listing to see why it ranked highly, or add them to your viewing trip.";
        
        setMessages(prev => [...prev, { role: 'ai', content: followUp, mode: newMode }]);
      }, 1500);

    } catch (e) {
      console.error("Genie search failed", e);
      setIsTyping(false);
    }
  };

  const addToTrip = (id: string) => {
    if (tripList.includes(id)) return;
    const newList = [...tripList, id];
    setTripList(newList);
    toast.success("Added to your viewing trip!");
    
    setMessages(prev => [...prev, {
      role: 'ai', 
      content: "Confirmed action. I've added this to your trip. Would you like to book a viewing or add more properties?",
      mode: 'TRIP'
    }]);
  };

  return (
    <section className="relative pt-8 pb-12 md:pt-12 md:pb-24 overflow-hidden min-h-[auto] md:min-h-[90vh] flex items-center bg-background">
      {/* Background w/ Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 text-left animate-fade-in order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">AI-Powered Property Concierge</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Find Homes & Land by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">
                  Just Asking.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Our AI understands location, budget, and lifestyle — matching you with real properties instantly.
              </p>
            </div>

            {/* Micro Trust Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">1,204+</p>
                  <p className="text-xs text-muted-foreground mt-1">Listings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">202+</p>
                  <p className="text-xs text-muted-foreground mt-1">Agents</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">98%</p>
                  <p className="text-xs text-muted-foreground mt-1">Match Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Chat Interface */}
          <div className="relative w-full max-w-lg mx-auto animate-slide-up animation-delay-200 order-1 lg:order-2">
            <Card className="relative overflow-hidden border-border/50 bg-card/60 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-3xl p-6 md:p-8">
              {/* Header with Mode Indicator */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">PataHome Genie</h2>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                      Ready to assist
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-lg border-primary/20 bg-primary/5 text-primary">
                  {mode === 'DISCOVERY' && <><Home className="w-3 h-3 mr-1" /> Discovery Mode</>}
                  {mode === 'TRIP' && <><ClipboardList className="w-3 h-3 mr-1" /> Trip Planner</>}
                  {mode === 'ANALYTICAL' && <><BarChart3 className="w-3 h-3 mr-1" /> Analytical</>}
                  {mode === 'PROJECT' && <><Construction className="w-3 h-3 mr-1" /> Project Workspace</>}
                </Badge>
              </div>

              {/* Chat Output Area */}
              <div className="space-y-6 mb-6 h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-3 animate-fade-in", msg.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm",
                      msg.role === 'ai' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}>
                      {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "rounded-2xl p-4 text-sm shadow-sm max-w-[85%] leading-relaxed",
                      msg.role === 'ai' 
                        ? "bg-muted/80 rounded-tl-none text-foreground/90 border border-border/50" 
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    )}>
                      {typeof msg.content === 'string' ? <p>{msg.content}</p> : msg.content}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-muted/80 border border-border/50 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="relative group">
                <Input
                  placeholder="e.g. 3 bedroom house in Karen..."
                  className="pr-12 py-6 bg-background/80 border-border shadow-inner rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground/60"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
                  onClick={handleSearch}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions / Suggestions */}
              {!showResults && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => setInputValue("Student hostel near Egerton")} className="text-[10px] px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground transition-colors border border-border/50">
                    Hostel near Egerton
                  </button>
                  <button onClick={() => setInputValue("Land in Njoro for farming")} className="text-[10px] px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground transition-colors border border-border/50">
                    Land in Njoro
                  </button>
                  <button onClick={() => setInputValue("Apartment in Milimani")} className="text-[10px] px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground transition-colors border border-border/50">
                    Milimani Apartments
                  </button>
                </div>
              )}

              {/* Results Panel - Integrated inside Chat card but slide-up */}
              {showResults && currentResults.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border/50 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Home className="w-4 h-4 text-primary" />
                      Matches in {detectedLocation}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] bg-primary/5 text-primary border-none">{currentResults.length} Found</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
                    {currentResults.map((result) => (
                      <div key={result.id} className="bg-background/80 rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="aspect-[16/9] w-full overflow-hidden relative">
                          <img src={result.image} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-background/95 backdrop-blur text-primary font-bold border-none shadow-lg px-3 py-1">{result.price}</Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-foreground truncate">{result.title}</h4>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-primary/70" /> {result.location}
                          </p>
                          
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            <Badge variant="outline" className="text-[9px] font-semibold py-0 px-2 h-5 border-border/50 bg-muted/30">Pet-friendly</Badge>
                            <Badge variant="outline" className="text-[9px] font-semibold py-0 px-2 h-5 border-border/50 bg-muted/30">Parking</Badge>
                            <Badge variant="outline" className="text-[9px] font-semibold py-0 px-2 h-5 border-border/50 bg-muted/30">Garden</Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-5">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-[11px] font-bold h-9 rounded-xl border-border hover:bg-muted"
                              onClick={() => navigate(`/properties/${result.id}`)}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tripList.includes(result.id) ? "secondary" : "default"}
                              className="text-[11px] font-bold h-9 rounded-xl gap-2 shadow-sm"
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
                    <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between animate-in zoom-in-95 duration-500 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                          {tripList.length} / 7
                        </div>
                        <span className="text-[11px] text-foreground font-bold">Properties added to trip</span>
                      </div>
                      <Button size="sm" className="h-8 text-[11px] font-bold px-4 rounded-xl shadow-lg shadow-primary/10" onClick={() => navigate('/trips')}>
                        Plan Visit
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Trust Fallback */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/properties')}
                  className="text-[11px] text-muted-foreground hover:text-primary font-medium transition-all flex items-center justify-center gap-1.5 mx-auto group"
                >
                  Prefer traditional search? use filters <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </Card>
          </div>
        </div>

        {/* How it Works - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-24 text-center">
          <div className="space-y-4 animate-fade-in [animation-delay:400ms]">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center text-primary font-black text-lg border border-primary/5 shadow-sm">1</div>
            <div>
              <p className="text-sm font-bold text-foreground">Describe Needs</p>
              <p className="text-xs text-muted-foreground mt-1">Talk to the Genie in plain English.</p>
            </div>
          </div>
          <div className="space-y-4 animate-fade-in [animation-delay:600ms]">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 mx-auto flex items-center justify-center text-accent font-black text-lg border border-accent/5 shadow-sm">2</div>
            <div>
              <p className="text-sm font-bold text-foreground">Genie Filters</p>
              <p className="text-xs text-muted-foreground mt-1">Our AI analyzes thousands of listings.</p>
            </div>
          </div>
          <div className="space-y-4 animate-fade-in [animation-delay:800ms]">
            <div className="w-12 h-12 rounded-2xl bg-success/10 mx-auto flex items-center justify-center text-success font-black text-lg border border-success/5 shadow-sm">3</div>
            <div>
              <p className="text-sm font-bold text-foreground">View & Visit</p>
              <p className="text-xs text-muted-foreground mt-1">Review matches and book viewings.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
