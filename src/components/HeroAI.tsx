import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Send, ArrowRight, Home, Users, TrendingUp, MapPin, Construction, Info } from "lucide-react";
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
  const [pendingQuestion, setPendingQuestion] = useState<{
    type: string;
    options: string[];
    context: any;
  } | null>(null);

  const inputRef = useRef<string>("");
  const { detectLocationFromText } = useLocationAgent();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai', 
      content: "I am the PataHome Genie. Tell me what you're looking for, a home in Milimani/Kiamunyi, land in Njoro, or perhaps planning a new build?",
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

  const handleSearch = async (forcedValue?: string) => {
    const query = forcedValue || inputRef.current;
    if (!query.trim()) return;

    const userMsg = query;
    const lowerInput = userMsg.toLowerCase();
    inputRef.current = "";
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (lowerInput === "hi" || lowerInput === "hello" || lowerInput === "hey") {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: "Hello! I'm here to help you navigate the property market in Nakuru County. What can I help you find today?",
          mode: 'DISCOVERY'
        }]);
        return;
      }

      const isAffirmation = ["yes", "yes please", "okay", "sure", "go ahead", "that works", "ok", "please do"].includes(lowerInput.trim());
      
      if (isAffirmation && pendingQuestion) {
        const choice = pendingQuestion.options[0]; // Least risky option
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Got it — I'll ${choice.toLowerCase()} around ${convoState.location || 'the area'} while keeping your preferences in mind.`,
          mode: mode
        }]);
        setPendingQuestion(null);
        // Trigger logic based on choice...
        return;
      }

      let newMode: GenieMode = mode;
      let modeSwitched = false;
      if (lowerInput.includes("roi") || lowerInput.includes("yield") || lowerInput.includes("portfolio") || lowerInput.includes("invest")) {
        newMode = 'ANALYTICAL';
      } else if (lowerInput.includes("build") || lowerInput.includes("construction") || lowerInput.includes("mall") || lowerInput.includes("bungalow") || lowerInput.includes("cost to")) {
        newMode = 'PROJECT';
      } else if (lowerInput.includes("search") || lowerInput.includes("find") || lowerInput.includes("buy") || lowerInput.includes("rent")) {
        newMode = 'DISCOVERY';
      }

      if (newMode !== mode) {
        modeSwitched = true;
        setMode(newMode);
        const modeNames = {
          'ANALYTICAL': 'Analytical/Investor',
          'PROJECT': 'Project/Build',
          'DISCOVERY': 'Discovery',
          'TRIP': 'Trip'
        };
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `Alright — switching to ${modeNames[newMode]} mode. I'll focus on ${newMode === 'PROJECT' ? 'planning and materials' : newMode === 'ANALYTICAL' ? 'market insights and yields' : 'finding the right property'} based on what you've already told me.`,
          mode: newMode
        }]);
      }

      const detectedLoc = detectLocationFromText(userMsg);
      
      setConvoState(prev => {
        const next = { ...prev };
        if (detectedLoc) next.location = detectedLoc.name;
        if (!next.location) next.location = "Nakuru";
        if ((lowerInput.includes("buy") || lowerInput.includes("sale"))) next.intent = 'buy';
        if ((lowerInput.includes("rent") || lowerInput.includes("lease"))) next.intent = 'rent';
        if (lowerInput.includes("land") || lowerInput.includes("plot")) next.property_type = 'land';
        else if (lowerInput.includes("house") || lowerInput.includes("apartment") || lowerInput.includes("mall") || lowerInput.includes("bungalow")) next.property_type = 'home';
        const budgetMatch = userMsg.match(/(\d+(\.\d+)?)\s*(m|million|k|thousand)/i);
        if (budgetMatch) next.budget = budgetMatch[0];
        return next;
      });

      const currentState = {
        ...convoState,
        location: detectedLoc?.name || convoState.location || "Nakuru",
        intent: (lowerInput.includes("buy") || lowerInput.includes("sale")) ? 'buy' : (lowerInput.includes("rent") || lowerInput.includes("lease")) ? 'rent' : convoState.intent,
        property_type: (lowerInput.includes("land") || lowerInput.includes("plot")) ? 'land' : (lowerInput.includes("house") || lowerInput.includes("apartment") || lowerInput.includes("mall") || lowerInput.includes("bungalow")) ? 'home' : convoState.property_type
      };

      if (newMode === 'PROJECT') {
        if (lowerInput.includes("mall")) {
          setMessages(prev => [...prev, {
            role: 'ai',
            content: "Understood. A mall changes the approach significantly. Before I suggest materials, I need to understand:\n• Approximate size (small neighborhood vs multi-floor)\n• Target users (students, general retail, offices)\n• Whether utilities and access roads are already in place",
            mode: 'PROJECT'
          }]);
          return;
        }
        if (!currentState.property_type || (!lowerInput.includes("sqm") && !lowerInput.includes("standard") && !lowerInput.includes("commercial"))) {
          const msg = {
            role: 'ai' as MessageRole,
            content: `Got it — a project in ${currentState.location}. Before I estimate costs or suggest materials, let's frame the project:`,
            type: 'options' as const,
            options: ["Standard Size (approx 150sqm)", "Large Scale / Commercial", "I have my own dimensions"],
            mode: 'PROJECT' as GenieMode
          };
          setMessages(prev => [...prev, msg]);
          setPendingQuestion({ type: 'project_scale', options: msg.options, context: currentState });
          return;
        }
      }

      if (newMode === 'ANALYTICAL') {
        if (lowerInput.includes("yield") && !lowerInput.includes("directional")) {
           setMessages(prev => [...prev, {
             role: 'ai',
             content: "When people ask about yield in Nakuru, they’re usually comparing rental income versus land appreciation. Based on current demand signals, here’s how it generally breaks down — this is directional, not a guarantee.",
             mode: 'ANALYTICAL'
           }]);
        }
        if (!lowerInput.includes("yield") && !lowerInput.includes("appreciation") && !lowerInput.includes("cash flow")) {
          const msg = {
            role: 'ai' as MessageRole,
            content: `I've switched to Investor Mode for ${currentState.location}. To provide accurate insights, what is your primary objective?`,
            type: 'options' as const,
            options: ["Maximize Rental Yield (%)", "Long-term Capital Appreciation", "Mixed-use Cash Flow"],
            mode: 'ANALYTICAL' as GenieMode
          };
          setMessages(prev => [...prev, msg]);
          setPendingQuestion({ type: 'investor_objective', options: msg.options, context: currentState });
          return;
        }
      }

      if (newMode === 'DISCOVERY' && !currentState.intent) {
        const msg = { 
          role: 'ai' as MessageRole, 
          content: `I've noted you're interested in ${currentState.location}. Are you looking to buy or rent?`,
          type: 'options' as const,
          options: ["I want to Buy", "I want to Rent"],
          mode: 'DISCOVERY' as GenieMode
        };
        setMessages(prev => [...prev, msg]);
        setPendingQuestion({ type: 'intent_confirmation', options: msg.options, context: currentState });
        return;
      }

      const isRefinementAnswer = ["closer to schools", "newer builds", "larger plots"].includes(lowerInput.trim());
      const filteredMocks = MOCK_GENIE_PROPERTIES.filter(p => {
        if (currentState.location && !p.location.toLowerCase().includes(currentState.location.toLowerCase())) return false;
        if (currentState.property_type === 'land') return p.type === 'land';
        return p.type === 'home';
      }).slice(0, 3);

      if (filteredMocks.length === 0 && newMode === 'DISCOVERY') {
        const msg = { 
          role: 'ai' as MessageRole, 
          content: "I couldn't find an exact match for that specific criteria right now. Should we adjust the scope?",
          type: 'options' as const,
          options: ["Expand search area", "Adjust budget", "Try different property type"],
          mode: 'DISCOVERY' as GenieMode
        };
        setMessages(prev => [...prev, msg]);
        setPendingQuestion({ type: 'adjust_search', options: msg.options, context: currentState });
        return;
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Based on your request, here are the best matches in ${currentState.location}.`, 
        mode: newMode 
      }]);
      filteredMocks.forEach((prop, i) => {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', type: 'property', data: prop, mode: newMode }]);
          if (i === filteredMocks.length - 1) {
            if (!isRefinementAnswer) {
              setTimeout(() => {
                setMessages(prev => [...prev, { 
                  role: 'ai', 
                  content: "Would you like to refine this search further?", 
                  type: 'options',
                  options: ["Closer to schools", "Newer builds", "Larger plots"],
                  mode: newMode 
                }]);
              }, 500);
            } else {
              setTimeout(() => {
                setMessages(prev => [...prev, { 
                  role: 'ai', 
                  content: "These matches incorporate your preference. Would you like to view more details for any of these, or should we look at a different area?", 
                  type: 'options',
                  options: ["View more details", "Change area", "Change budget"],
                  mode: newMode 
                }]);
              }, 500);
            }
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

  function GenieCard() {
    return (
      <Card className="p-0 border-none bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">PataHome Genie</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online & Nationwide</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 items-center">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase transition-all hover:bg-primary/20">
                {mode} MODE
                <ArrowRight className="w-3 h-3 rotate-90" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {(['DISCOVERY', 'TRIP', 'ANALYTICAL', 'PROJECT'] as GenieMode[]).map((m) => (
                  <button
                    key={m}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-primary/5 hover:text-primary transition-colors",
                      mode === m ? "text-primary bg-primary/5" : "text-slate-600 dark:text-slate-400"
                    )}
                    onClick={() => setMode(m)}
                  >
                    {m} MODE
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="h-[380px] overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex flex-col gap-2 animate-fade-in", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn("w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm font-bold text-[10px]", msg.role === 'ai' ? "bg-primary text-primary-foreground" : "bg-slate-100 dark:bg-secondary text-slate-900 dark:text-secondary-foreground")}>
                  {msg.role === 'ai' ? "G" : "U"}
                </div>
                <div className={cn("rounded-2xl p-4 text-sm shadow-sm max-w-[85%] leading-relaxed font-medium", msg.role === 'ai' ? "bg-slate-50 dark:bg-muted/90 rounded-tl-none border border-slate-200 dark:border-border/50 text-slate-900 dark:text-slate-100" : "bg-primary text-primary-foreground rounded-tr-none")}>
                  {msg.type === 'options' && msg.options && (
                    <div className="space-y-3">
                      <p className="font-bold border-b border-slate-200 dark:border-border/50 pb-2 mb-2">{msg.content}</p>
                      <div className="flex flex-col gap-2">
                        {msg.options.map((opt, i) => (
                          <Button 
                            key={i} 
                            variant="outline" 
                            size="sm" 
                            className="justify-start text-left h-auto py-2 text-[11px] font-bold border-primary/20 hover:bg-primary/5 hover:text-primary transition-all rounded-xl dark:border-primary/20 dark:hover:bg-primary/5 dark:hover:text-primary"
                            onClick={() => handleSearch(opt)}
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
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {msg.data.location}</p>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="h-8 text-[10px] flex-1 font-bold rounded-lg" onClick={() => navigate(`/properties/${msg.data.id}`)}>Details</Button>
                        <Button size="sm" className="h-8 text-[10px] flex-1 font-bold rounded-lg" onClick={() => addToTrip(msg.data.id)}>Add to Trip</Button>
                      </div>
                    </div>
                  )}
                  {msg.type === 'material' && msg.data && (
                    <div className="space-y-3 p-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Construction className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-[12px] uppercase tracking-wider">Material Estimate</h4>
                      </div>
                      <div className="bg-white dark:bg-background/50 rounded-xl p-3 border border-slate-200 dark:border-border/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-sm">{msg.data.name}</span>
                          <span className="text-primary font-black">{msg.data.price}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-muted-foreground mb-3">{msg.data.unit}</p>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold">Supplier: {msg.data.supplier}</span>
                          <Badge variant="outline" className="text-[8px] h-4 bg-emerald-100 dark:bg-success/10 text-emerald-700 dark:text-success border-emerald-200 dark:border-success/20">{msg.data.availability}</Badge>
                        </div>
                      </div>
                      <Button size="sm" className="w-full h-8 text-[10px] font-bold rounded-lg" onClick={() => addToProject(msg.data.id)}>Add to Project</Button>
                    </div>
                  )}
                  {msg.type !== 'options' && msg.type !== 'property' && msg.type !== 'material' && (
                    <div className="space-y-2">
                      {typeof msg.content === 'string' ? msg.content.split('\n').map((line, i) => <p key={i}>{line}</p>) : msg.content}
                      {msg.explanation && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-border/50 flex items-start gap-2 italic text-[10px] text-slate-500 dark:text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Info className="w-3 h-3 flex-shrink-0" />
                            <span>{msg.explanation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground">G</div>
              <div className="bg-slate-50 dark:bg-muted/90 rounded-2xl rounded-tl-none p-4 border border-slate-200 dark:border-border/50">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-white/5">
          <div className="relative group">
            <Input
              placeholder="e.g. Find me a 3 bedroom home in Milimani under 10M"
              className="bg-white dark:bg-slate-950/50 border-slate-200 dark:border-white/10 h-14 pl-5 pr-14 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              defaultValue={inputValue}
              onChange={(e) => {
                inputRef.current = e.target.value;
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button size="icon" className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform" onClick={() => handleSearch()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
            {mode === 'DISCOVERY' ? (
              <>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10 hover:bg-primary/5 hover:text-primary transition-all" onClick={() => setInputValue("3 bedroom in Milimani")}>3BR Milimani</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10 hover:bg-primary/5 hover:text-primary transition-all" onClick={() => setInputValue("Plots in Njoro under 2M")}>Plots in Njoro</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10 hover:bg-primary/5 hover:text-primary transition-all" onClick={() => setInputValue("Rental in Kiamunyi")}>Kiamunyi Rentals</Button>
              </>
            ) : mode === 'ANALYTICAL' ? (
              <>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10" onClick={() => setInputValue("Highest rental yield area")}>Best Yields</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10" onClick={() => setInputValue("Price trends in Nakuru CBD")}>CBD Trends</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10" onClick={() => setInputValue("Cost to build 3BR bungalow")}>Bungalow Cost</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold whitespace-nowrap rounded-lg border-slate-200 dark:border-white/10" onClick={() => setInputValue("Local material prices")}>Material Prices</Button>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="relative min-h-[90vh] flex items-center pt-8 pb-16 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40 dark:opacity-100">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8 mt-[-20px] md:mt-0">
        <div className="grid lg:grid-cols-2 gap-12 items-start lg:items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-tight uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Property Concierge
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Find Homes & Land by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                  Just Asking.
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
                Our AI understands location, budget, bedrooms, and lifestyle — and matches you with real properties instantly.
              </p>
            </div>

            <div className="lg:hidden w-full max-w-[500px] animate-in fade-in slide-in-from-bottom duration-700">
              <GenieCard />
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">1,215+</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Listings</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">218+</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Agents</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">98%</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Match Rate</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12 pt-12 border-t border-slate-200 dark:border-white/5">
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all">1</div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Describe your dream</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all">2</div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AI filters listings</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-all">3</div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">See only matches</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:ml-auto w-full max-w-[500px] animate-in fade-in slide-in-from-right duration-700">
            <GenieCard />
          </div>
        </div>
      </div>
    </section>
  );
}
