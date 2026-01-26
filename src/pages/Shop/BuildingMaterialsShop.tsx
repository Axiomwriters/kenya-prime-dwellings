import { useState, useMemo, useEffect, useRef } from "react";
import { 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Plus, 
  Minus, 
  Truck, 
  Info,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  Zap,
  ShieldCheck,
  Package,
  ArrowUpRight,
  MapPin,
  Send,
  Sparkles,
  ClipboardList,
  Building2,
  Calendar,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- Types ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'suggestion';
  options?: string[];
}

// --- Mock Data ---
const QUICK_START_CHIPS = [
  { id: "bungalow", name: "3-Bedroom Bungalow", icon: "🏠" },
  { id: "apartments", name: "Apartments", icon: "🏢" },
  { id: "rental", name: "Rental Units", icon: "🏗" },
  { id: "estimating", name: "Just estimating costs", icon: "🌱" },
  { id: "drawings", name: "I already have drawings", icon: "🧱" },
];

const PRODUCTS = [
  {
    id: "c1",
    name: "Bamburi Tembo Cement",
    spec: "50kg Bag, Type 32.5N",
    price: 950,
    rating: 4.8,
    supplier: "Bamburi Cement Ltd",
    verified: true,
    coverage: ["Nairobi", "Kiambu", "Nakuru"],
    stock: "Available near site",
    category: "Cement & Aggregates",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 220,
    sets: ["foundation", "superstructure"]
  },
  {
    id: "s1",
    name: "TMT Steel Bars",
    spec: "12mm High-Strength, 12m",
    price: 1450,
    rating: 4.9,
    supplier: "Devki Steel Mills",
    verified: true,
    coverage: ["All Counties"],
    stock: "Limited near Nakuru",
    category: "Steel & Metal",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 45,
    sets: ["foundation", "superstructure"]
  }
];

export default function BuildingMaterialsShop() {
  const navigate = useNavigate();
  const [view, setView] = useState<'concierge' | 'board' | 'shop'>('concierge');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Habari! I'm your Build Concierge. Tell me what you're building today, and I'll handle the estimations and sourcing for you." }
  ]);
  const [inputText, setInputText] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [projectModel, setProjectModel] = useState({
    type: "3-Bedroom Maisonette",
    location: "Nakuru",
    progress: 32,
    budget: "KSh 4.5M - 6M",
    timeline: "6 Months"
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text: string = inputText) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputText("");

    // Simple bot logic for demo
    setTimeout(() => {
      if (text.toLowerCase().includes("bungalow") || text.toLowerCase().includes("maisonette")) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `For a ${text} in Nakuru, you'll typically need ~220 bags of cement for the foundation and superstructure. Would you like me to add the recommended material set to your project board?`,
          type: 'suggestion',
          options: ["✅ Add Recommended", "✏️ Customize", "💬 Explain why"]
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Got it. Tell me a bit more about the location and if you're working with a professional architect yet." }]);
      }
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    if (option.includes("Add Recommended")) {
      const setMaterials = PRODUCTS;
      setCart(setMaterials.map(m => ({ ...m, quantity: m.estimateNeeded })));
      toast.success("Foundation material set added to your Project Board.");
      setView('board');
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4 hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A]">Build Concierge</h1>
            <p className="text-[10px] font-medium text-primary uppercase tracking-[0.1em]">PropertyHub Intelligence</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button 
              variant={view === 'concierge' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('concierge')}
              className="rounded-full px-4 text-xs font-bold uppercase tracking-wider"
            >
              Concierge
            </Button>
            <Button 
              variant={view === 'board' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('board')}
              className="rounded-full px-4 text-xs font-bold uppercase tracking-wider"
            >
              Project Board
            </Button>
            <Button 
              variant={view === 'shop' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('shop')}
              className="rounded-full px-4 text-xs font-bold uppercase tracking-wider"
            >
              Manual Shop
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col h-full bg-[#FDFDFD]">
          
          {view === 'concierge' && (
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-8">
              {/* Chat Window */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-24 scroll-smooth pr-2">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      m.role === 'user' ? "bg-[#111] text-white rounded-tr-none" : "bg-white border rounded-tl-none text-[#333]"
                    )}>
                      {m.content}
                    </div>
                    {m.options && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {m.options.map(opt => (
                          <Button 
                            key={opt} 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOptionClick(opt)}
                            className="rounded-full text-[11px] font-bold border-primary/20 hover:bg-primary hover:text-white transition-colors h-8"
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Controls */}
              <div className="fixed bottom-0 left-0 lg:left-[3rem] right-0 p-4 md:p-8 bg-gradient-to-t from-[#FDFDFD] via-[#FDFDFD] to-transparent">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                      {QUICK_START_CHIPS.map(chip => (
                        <Button
                          key={chip.id}
                          variant="outline"
                          onClick={() => handleSend(chip.name)}
                          className="rounded-full h-10 px-4 gap-2 border-muted hover:border-primary/50 text-xs font-semibold"
                        >
                          <span>{chip.icon}</span>
                          {chip.name}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="relative">
                    <Input 
                      placeholder="Tell me what you're building..." 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="h-16 pl-6 pr-16 bg-white border-[#EEE] rounded-3xl shadow-xl shadow-black/5 text-base focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                    <Button 
                      onClick={() => handleSend()}
                      size="icon" 
                      className="absolute right-2 top-2 h-12 w-12 rounded-2xl bg-[#111] hover:bg-primary transition-all shadow-lg"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'board' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-[#111]">Project Board</h2>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {projectModel.location}, Kenya
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl h-12 px-6 border-[#EEE] font-bold text-xs uppercase tracking-widest gap-2">
                      <ArrowUpRight className="h-4 w-4" /> Optimize Cost
                    </Button>
                    <Button className="rounded-xl h-12 px-6 bg-[#111] hover:bg-primary text-white font-bold text-xs uppercase tracking-widest">
                      Lock Escrow
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 space-y-10">
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Package className="h-4 w-4" /> Materials by Phase
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-bold">FOUNDATION</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cart.map(item => (
                          <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-[#EEE] shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base truncate">{item.name}</h4>
                                <p className="text-[10px] font-bold text-primary uppercase">{item.supplier}</p>
                                <p className="font-black text-lg mt-1">KSh {(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed">
                              <div className="flex items-center gap-3">
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted"><Minus className="h-3 w-3"/></button>
                                <span className="text-sm font-black">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted"><Plus className="h-3 w-3"/></button>
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                <Truck className="h-3 w-3" /> 2-3 Days
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Suggested Services
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl">📐</div>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm">Site Surveyor</h4>
                              <p className="text-[10px] font-medium text-muted-foreground">Nakuru County Specialist</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl">⚖️</div>
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm">Quantity Surveyor</h4>
                              <p className="text-[10px] font-medium text-muted-foreground">Certified Professional</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#111] p-8 rounded-[2.5rem] text-white space-y-8 sticky top-24 shadow-2xl shadow-black/10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Project Value</p>
                        <h4 className="text-4xl font-black">KSh {(totalCost / 1000000).toFixed(2)}M</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="opacity-50">Materials Coverage</span>
                          <span className="text-primary">{projectModel.progress}%</span>
                        </div>
                        <Progress value={projectModel.progress} className="h-1 bg-white/10" />
                      </div>

                      <div className="space-y-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🏦</div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Escrow Ready</p>
                            <p className="text-xs font-bold text-primary">Funds Protected</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🚚</div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Delivery Route</p>
                            <p className="text-xs font-bold">Active to {projectModel.location}</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-widest transition-all">
                        Secure Materials
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'shop' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">
               <div className="max-w-7xl mx-auto">
                 {/* Re-using the manual shop grid logic if needed, but simplified */}
                 <div className="text-center py-20">
                   <h3 className="text-2xl font-black mb-4">Manual View is for Power Users</h3>
                   <p className="text-muted-foreground mb-8">Browse 500+ items directly without AI assistance.</p>
                   <Button variant="outline" className="rounded-full px-8">Coming Soon in v2</Button>
                 </div>
               </div>
            </div>
          )}

        </div>

        {/* Live Project Model (Desktop Context Panel) */}
        {view === 'concierge' && (
          <aside className="hidden xl:flex w-[380px] border-l bg-white flex-col animate-in slide-in-from-right-10 duration-700">
            <div className="p-8 pb-6 border-b">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Live Project Model</h3>
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Project Type</p>
                  <p className="text-lg font-black text-[#111]">{projectModel.type}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Ready to source</span>
                    <span className="text-primary">{projectModel.progress}%</span>
                  </div>
                  <Progress value={projectModel.progress} className="h-1 bg-muted" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">PROJECT SPECS</h4>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Location", value: projectModel.location },
                    { icon: Wallet, label: "Est. Budget", value: projectModel.budget },
                    { icon: Calendar, label: "Timeline", value: projectModel.timeline },
                    { icon: Building2, label: "Floors", value: "2 Floors" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-muted transition-all">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <spec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{spec.label}</p>
                        <p className="text-xs font-bold text-[#111]">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111] rounded-[2rem] p-6 text-white space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary fill-primary" />
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">BUILD ADVISOR</h5>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-80">
                  I'm refining your material set. As you define the floors, I'll update the TMT Steel gauge recommendations.
                </p>
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
