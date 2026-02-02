import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Send, ArrowRight, Home, Users, TrendingUp, MapPin, ClipboardList, BarChart3, Construction, Hammer, Scale, Info } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { StatCounter } from "@/components/StatCounter";
import { useLocationAgent } from "@/contexts/LocationAgentContext";
import { MOCK_GENIE_PROPERTIES } from "@/data/mockGenieProperties";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MessageRole = 'ai' | 'user';
type GenieMode = 'DISCOVERY' | 'TRIP' | 'ANALYTICAL' | 'PROJECT';

interface ConversationState {
  pending_choice: string | null;
  intent_resolved: boolean;
  intent: string | null;
  location: string | null;
  budget: string | null;
  property_type: string | null;
}

interface Message {
  role: MessageRole;
  content?: string | React.ReactNode;
  mode?: GenieMode;
  explanation?: string;
  type?: 'text' | 'property' | 'material' | 'service' | 'options';
  data?: any;
  options?: string[];
}

const MOCK_MATERIALS = [
  { id: 'm1', name: "Cement (Bamburi)", price: "KSh 750", unit: "per 50kg bag", supplier: "Bamburi Special Products", availability: "In Stock" },
  { id: 'm2', name: "River Sand", price: "KSh 18,000", unit: "per 10-tonne truck", supplier: "Local Quarry", availability: "2-day delivery" },
  { id: 'm3', name: "Machine Cut Stones", price: "KSh 45", unit: "per piece", supplier: "Ndungu Quarries", availability: "In Stock" }
];

export function HeroAI() {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<GenieMode>('DISCOVERY');
  const [convoState, setConvoState] = useState<ConversationState>({
    pending_choice: null,
    intent_resolved: false,
    intent: null,
    location: null,
    budget: null,
    property_type: null
  });
  const { detectLocationFromText } = useLocationAgent();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai', 
      content: "I am the PataHome Genie. Tell me what you're looking for — a home in Milimani, land in Njoro, or perhaps planning a new build?",
      mode: 'DISCOVERY'
    }
  ]);

  const [tripList, setTripList] = useState<string[]>([]);
  const [projectList, setProjectList] = useState<string[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    const lowerInput = userMsg.toLowerCase();
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // 1. Handling Ambiguous Confirmation Memory
      if (convoState.pending_choice) {
        if (lowerInput === "yes" || lowerInput === "okay" || lowerInput === "sure" || lowerInput === "go ahead") {
          setMessages(prev => [...prev, {
            role: 'ai',
            content: `Just to be precise — should I:`,
            type: 'options',
            options: convoState.pending_choice === 'scope_adjustment' 
              ? ["Expand to nearby areas", "Adjust the budget", "Do both"]
              : ["Older homes with larger plots", "Newer builds with compact plots"]
          }]);
          return;
        }
        
        // Resolve choice
        setConvoState(prev => ({ ...prev, pending_choice: null }));
      }

      // 2. Intent Detection & Mode Logic
      let newMode: GenieMode = mode;
      if (lowerInput.includes("roi") || lowerInput.includes("yield") || lowerInput.includes("portfolio") || lowerInput.includes("invest") || lowerInput.includes("compare")) {
        newMode = 'ANALYTICAL';
      } else if (lowerInput.includes("build") || lowerInput.includes("construction") || lowerInput.includes("material") || lowerInput.includes("cost to build")) {
        newMode = 'PROJECT';
      } else if (lowerInput.includes("trip") || lowerInput.includes("viewing") || lowerInput.includes("visit")) {
        newMode = 'TRIP';
      }
      setMode(newMode);

      const detectedLoc = detectLocationFromText(userMsg);
      
      // Update State
      const updatedState = { ...convoState };
      if (detectedLoc) updatedState.location = detectedLoc.name;
      if (lowerInput.includes("buy") || lowerInput.includes("sale")) updatedState.intent = 'buy';
      if (lowerInput.includes("rent") || lowerInput.includes("lease")) updatedState.intent = 'rent';
      if (lowerInput.includes("land") || lowerInput.includes("plot")) updatedState.property_type = 'land';
      if (lowerInput.includes("house") || lowerInput.includes("apartment")) updatedState.property_type = 'home';
      
      // Budget extraction (simple)
      const budgetMatch = userMsg.match(/(\d+(\.\d+)?)\s*(m|million|k|thousand)/i);
      if (budgetMatch) updatedState.budget = budgetMatch[0];

      setConvoState(updatedState);

      // 3. Discovery Flow Completion Guarantee
      if (newMode === 'DISCOVERY' && (!updatedState.location || !updatedState.intent || !updatedState.property_type)) {
        let question = "Got it. To help me find the best matches, could you clarify ";
        if (!updatedState.intent) question += "if you're looking to buy or rent? ";
        else if (!updatedState.location) question += "which area in Kenya you're interested in? ";
        else if (!updatedState.property_type) question += "if you're looking for land or a finished home?";
        
        setMessages(prev => [...prev, { role: 'ai', content: question, mode: 'DISCOVERY' }]);
        return;
      }

      // 4. Case-Specific Elite Flows
      if (newMode === 'ANALYTICAL') {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `With ${updatedState.budget || 'your budget'} in ${updatedState.location || 'Nakuru'}, you have three viable strategies:`,
          explanation: "This insight is based on recent demand patterns and infrastructure signals — not a price guarantee.",
          type: 'text',
          mode: 'ANALYTICAL'
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'ai',
            content: "1. Residential rentals in high-demand zones\n2. Land banking near infrastructure growth\n3. Mixed-use properties near the CBD fringe",
            mode: 'ANALYTICAL'
          }]);
        }, 500);
        return;
      }

      if (newMode === 'PROJECT') {
        setMessages(prev => [...prev, { role: 'ai', content: "I've updated your project workspace. Quality materials are the foundation of any build. Here are current estimates:", mode: 'PROJECT' }]);
        MOCK_MATERIALS.forEach((mat, i) => {
          setTimeout(() => setMessages(prev => [...prev, { role: 'ai', type: 'material', data: mat, mode: 'PROJECT' }]), (i + 1) * 300);
        });
        return;
      }

      // 5. Normal Search Flow with Clarification Gate
      const filteredMocks = MOCK_GENIE_PROPERTIES.filter(p => {
        if (updatedState.location && !p.location.toLowerCase().includes(updatedState.location.toLowerCase())) return false;
        if (updatedState.property_type === 'land') return p.type === 'land';
        return p.type === 'home';
      }).slice(0, 3);

      if (filteredMocks.length === 0) {
        setConvoState(prev => ({ ...prev, pending_choice: 'scope_adjustment' }));
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: "I couldn't find an exact match right now. Should we look at adjacent areas or perhaps adjust the budget?",
          mode: 'DISCOVERY'
        }]);
        return;
      }

      // Show Results
      setMessages(prev => [...prev, { role: 'ai', content: `Based on your request, these options in ${updatedState.location} match best. Prices vary by specific plot positioning.`, mode: newMode }]);
      filteredMocks.forEach((prop, i) => {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', type: 'property', data: prop, explanation: "Matches your location and type preference.", mode: newMode }]);
          if (i === filteredMocks.length - 1) {
            // Refinement Follow-up
            setTimeout(() => {
              setMessages(prev => [...prev, { role: 'ai', content: "Would you like something closer to schools, or perhaps a newer build?", mode: newMode }]);
            }, 500);
          }
        }, (i + 1) * 400);
      });

    }, 1200);
  };

  const addToTrip = (id: string) => {
    if (tripList.includes(id)) return;
    setTripList(prev => [...prev, id]);
    toast.success("Added to trip!");
    setMessages(prev => [...prev, {
      role: 'ai', 
      content: "Confirmed action. I've added this to your trip. We can coordinate a viewing or I can find a local representative to view it on your behalf.",
      mode: 'TRIP'
    }]);
  };

  const addToProject = (id: string) => {
    if (projectList.includes(id)) return;
    setProjectList(prev => [...prev, id]);
    toast.success("Added to project!");
    setMessages(prev => [...prev, {
      role: 'ai',
      content: "Material added to your build project. Would you like me to recommend a quantity surveyor to help with a full Bill of Quantities (B.Q)?",
      mode: 'PROJECT'
    }]);
  };

  return (
    <section className="relative pt-8 pb-12 md:pt-12 md:pb-24 overflow-hidden min-h-[auto] md:min-h-[90vh] flex items-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 text-left animate-fade-in order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase italic">PataHome Genie</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Find Homes & Land by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">
                  Just Asking.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                A decision-support concierge that reduces friction and builds trust. Not just a chatbot — your Kenyan real estate partner.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm"><Home className="w-6 h-6" /></div>
                <div><p className="text-xl font-bold text-foreground">1,204+</p><p className="text-xs text-muted-foreground">Listings</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success shadow-sm"><Users className="w-6 h-6" /></div>
                <div><p className="text-xl font-bold text-foreground">202+</p><p className="text-xs text-muted-foreground">Agents</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-sm"><TrendingUp className="w-6 h-6" /></div>
                <div><p className="text-xl font-bold text-foreground">98%</p><p className="text-xs text-muted-foreground">Match Rate</p></div>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-lg mx-auto animate-slide-up order-1 lg:order-2">
            <Card className="relative overflow-hidden border-border/50 bg-card/70 backdrop-blur-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] rounded-[2.5rem] p-6 md:p-8 border-2">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-foreground tracking-tight">PataHome Genie</h2>
                    <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span> ONLINE & NATIONWIDE
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-primary/10 text-primary border-none">
                  {mode} MODE
                </Badge>
              </div>

              <div ref={scrollRef} className="space-y-6 mb-6 h-[400px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex flex-col gap-2 animate-fade-in", msg.role === 'user' ? "items-end" : "items-start")}>
                    <div className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                      <div className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm font-bold text-[10px]", msg.role === 'ai' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                        {msg.role === 'ai' ? "G" : "U"}
                      </div>
                      <div className={cn("rounded-2xl p-4 text-sm shadow-sm max-w-[85%] leading-relaxed font-medium", msg.role === 'ai' ? "bg-muted/90 rounded-tl-none border border-border/50" : "bg-primary text-primary-foreground rounded-tr-none")}>
                        {msg.type === 'options' && msg.options && (
                          <div className="space-y-3">
                            <p className="font-bold border-b border-border/50 pb-2 mb-2">{msg.content}</p>
                            <div className="flex flex-col gap-2">
                              {msg.options.map((opt, i) => (
                                <Button 
                                  key={i} 
                                  variant="outline" 
                                  size="sm" 
                                  className="justify-start text-left h-auto py-2 text-[11px] font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                                  onClick={() => {
                                    setInputValue(opt);
                                    handleSearch();
                                  }}
                                >
                                  {opt}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        {msg.type === 'property' && msg.data && (
                          <div className="space-y-3">
                            <img src={msg.data.image} className="rounded-xl aspect-video object-cover" />
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm">{msg.data.title}</h4>
                              <span className="text-primary font-bold">{msg.data.price}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {msg.data.location}</p>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="h-8 text-[10px] flex-1 font-bold rounded-lg" onClick={() => navigate(`/properties/${msg.data.id}`)}>Details</Button>
                              <Button size="sm" className="h-8 text-[10px] flex-1 font-bold rounded-lg" onClick={() => addToTrip(msg.data.id)}>Add to Trip</Button>
                            </div>
                          </div>
                        )}
                        {msg.type === 'material' && msg.data && (
                          <div className="space-y-2 border-l-4 border-accent pl-3 py-1">
                            <div className="flex items-center gap-2 text-accent"><Hammer className="w-4 h-4" /><span className="font-bold text-xs uppercase tracking-wider">Material Card</span></div>
                            <h4 className="font-black text-sm">{msg.data.name}</h4>
                            <div className="flex justify-between items-center"><span className="text-base font-bold">{msg.data.price}</span><span className="text-[10px] text-muted-foreground">{msg.data.unit}</span></div>
                            <p className="text-[10px] italic">Supplier: {msg.data.supplier}</p>
                            <Button size="sm" variant="outline" className="w-full mt-2 h-8 text-[10px] font-bold border-accent/20 text-accent hover:bg-accent/5 rounded-lg" onClick={() => addToProject(msg.data.id)}>Add to Project</Button>
                          </div>
                        )}
                        {!msg.type && typeof msg.content === 'string' && <p>{msg.content}</p>}
                        {msg.explanation && <div className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground flex items-start gap-2 italic"><Info className="w-3 h-3 flex-shrink-0 mt-0.5" /> {msg.explanation}</div>}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 items-center opacity-70">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">G</div>
                    <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div></div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  placeholder="Ask the Genie anything..."
                  className="pr-12 py-7 bg-background/80 border-2 border-border shadow-inner rounded-3xl focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold placeholder:text-muted-foreground/50"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button size="icon" className="absolute right-2.5 top-2.5 h-10 w-10 rounded-2xl shadow-xl hover:scale-105 transition-transform" onClick={handleSearch} disabled={!inputValue.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {!messages.some(m => m.role === 'user') && (
                <div className="flex flex-wrap gap-2 mt-5">
                  <button onClick={() => setInputValue("3 bedroom house in Milimani")} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-muted/80 hover:bg-primary/10 hover:text-primary transition-all border border-border/50">Milimani Houses</button>
                  <button onClick={() => setInputValue("How much to build a 2bd bungalow?")} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-muted/80 hover:bg-accent/10 hover:text-accent transition-all border border-border/50">Build Costs</button>
                  <button onClick={() => setInputValue("Yield in Nakuru CBD")} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-muted/80 hover:bg-success/10 hover:text-success transition-all border border-border/50">Invest ROI</button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
