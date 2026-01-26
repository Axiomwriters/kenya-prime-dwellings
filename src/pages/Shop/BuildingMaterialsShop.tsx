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
  Wallet,
  PhoneCall,
  Loader2,
  ChevronLeft
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- Types ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'suggestion' | 'options' | 'carousel';
  options?: string[];
  items?: any[];
  step?: string;
}

// --- Mock Data ---
const QUICK_START_CHIPS = [
  { id: "bungalow", name: "3-Bedroom Bungalow", icon: "🏠" },
  { id: "apartments", name: "Apartments", icon: "🏢" },
  { id: "rental", name: "Rental Units", icon: "🏗" },
  { id: "estimating", name: "Just estimating costs", icon: "💰" },
  { id: "drawings", name: "I already have drawings", icon: "📐" },
];

const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera",
  "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri",
  "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma",
  "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"
];

const BUDGET_RANGES = ["KSh 1M–2M", "KSh 2M–4M", "KSh 4M+", "Not sure yet"];

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
    phase: "Foundation"
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
    stock: "Limited near site",
    category: "Steel & Metal",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 45,
    phase: "Structural"
  }
];

export default function BuildingMaterialsShop() {
  const navigate = useNavigate();
  const [view, setView] = useState<'concierge' | 'board' | 'shop'>('concierge');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Habari! I'm your Build Concierge. Tell me what you're building and I'll handle estimates, materials, and sourcing.", step: 'type' }
  ]);
  const [inputText, setInputText] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState('type');
  const [projectModel, setProjectModel] = useState({
    type: "",
    location: "Nairobi",
    budget: "",
    floors: "1",
    timeline: "Flexible",
    pro: "Need one",
    progress: 10,
    totalEst: 0
  });
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Progression Logic
    setTimeout(() => {
      let nextMsg: Message = { role: 'assistant', content: "" };
      
      switch (currentStep) {
        case 'type':
          setProjectModel(p => ({ ...p, type: text, progress: 25 }));
          nextMsg = { 
            role: 'assistant', 
            content: "Got it. Where is the project located?", 
            step: 'location',
            type: 'options',
            options: ["Nairobi", "Mombasa", "Nakuru", "Kiambu"] 
          };
          setCurrentStep('location');
          break;
        case 'location':
          setProjectModel(p => ({ ...p, location: text, progress: 50 }));
          nextMsg = { 
            role: 'assistant', 
            content: "What budget range are you working with?", 
            step: 'budget',
            type: 'options',
            options: BUDGET_RANGES 
          };
          setCurrentStep('budget');
          break;
        case 'budget':
          setProjectModel(p => ({ ...p, budget: text, progress: 75 }));
          nextMsg = { 
            role: 'assistant', 
            content: "How many floors are you planning?", 
            step: 'floors',
            type: 'options',
            options: ["1 Floor", "2+ Floors"] 
          };
          setCurrentStep('floors');
          break;
        case 'floors':
          setProjectModel(p => ({ ...p, floors: text, progress: 90 }));
          nextMsg = { 
            role: 'assistant', 
            content: "Excellent. I've prepared a recommended materials list for your project. You can swipe through them here or head to the Project Board for the full breakdown.", 
            step: 'final',
            type: 'carousel',
            items: PRODUCTS,
            options: ["✅ View Project Board", "🔧 Customize", "🤖 Optimize"] 
          };
          setCurrentStep('final');
          break;
        default:
          nextMsg = { role: 'assistant', content: "I'm ready when you are. Just let me know if you need to adjust anything." };
      }
      
      setMessages(prev => [...prev, nextMsg]);
    }, 800);
  };

  const handleOptionClick = (option: string) => {
    if (option.includes("View Project Board")) {
      const initialMaterials = PRODUCTS.map(m => ({ ...m, quantity: m.estimateNeeded }));
      setCart(initialMaterials);
      setView('board');
      toast.success("Project Board initialized with smart estimates.");
    } else if (currentStep !== 'final') {
      handleSend(option);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOrderModalOpen(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-[#1A1A1A]" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold tracking-tight text-[#1A1A1A]">Build Concierge</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">PropertyHub Intelligence™</p>
          </div>
          <div className="ml-auto flex items-center bg-muted/30 p-1 rounded-full">
            <Button 
              variant={view === 'concierge' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('concierge')}
              className={cn("rounded-full px-5 text-[11px] font-bold uppercase tracking-wider h-8", view === 'concierge' && "shadow-sm")}
            >
              Concierge
            </Button>
            <Button 
              variant={view === 'board' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('board')}
              className={cn("rounded-full px-5 text-[11px] font-bold uppercase tracking-wider h-8", view === 'board' && "shadow-sm")}
            >
              Board
            </Button>
            <Button 
              variant={view === 'shop' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('shop')}
              className={cn("rounded-full px-5 text-[11px] font-bold uppercase tracking-wider h-8", view === 'shop' && "shadow-sm")}
            >
              Manual
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col h-full bg-[#FDFDFD]">
          
          {view === 'concierge' && (
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-4 md:p-8">
              {/* Chat Window */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-32 scroll-smooth pr-4 custom-scrollbar-premium">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "p-5 rounded-2xl text-[15px] font-medium leading-relaxed shadow-sm",
                      m.role === 'user' 
                        ? "bg-[#111] text-white rounded-tr-none" 
                        : "bg-white border border-[#EEE] rounded-tl-none text-[#222]"
                    )}>
                      {m.content}
                    </div>
                    
                    {m.type === 'carousel' && m.items && (
                      <div className="w-full mt-4 relative group/carousel">
                        <ScrollArea className="w-full whitespace-nowrap rounded-2xl border bg-white/50 backdrop-blur-sm">
                          <div className="flex w-max p-4 gap-4">
                            {m.items.map((item, idx) => (
                              <div key={idx} className="w-[280px] bg-white rounded-2xl border border-[#EEE] p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
                                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                  <p className="text-[10px] font-bold text-primary uppercase">{item.supplier}</p>
                                  <p className="font-black text-base">KSh {item.price.toLocaleString()}</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest h-8"
                                  onClick={() => handleOptionClick("✅ View Project Board")}
                                >
                                  Add to Project
                                </Button>
                              </div>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="h-1.5 custom-scrollbar-premium" />
                        </ScrollArea>
                      </div>
                    )}

                    {m.options && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {m.options.map(opt => (
                          <Button 
                            key={opt} 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOptionClick(opt)}
                            className="rounded-full text-[11px] font-bold border-[#DDD] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all h-9 px-5"
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
              <div className="fixed bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-[#FDFDFD] via-[#FDFDFD] to-transparent pointer-events-none">
                <div className="max-w-3xl mx-auto space-y-4 pointer-events-auto">
                  {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 justify-center">
                      {QUICK_START_CHIPS.map(chip => (
                        <Button
                          key={chip.id}
                          variant="outline"
                          onClick={() => handleSend(chip.name)}
                          className="rounded-full h-11 px-5 gap-2 border-muted-foreground/20 hover:border-primary/50 text-xs font-bold bg-white/50 backdrop-blur shadow-sm hover:shadow-md transition-all"
                        >
                          <span className="text-lg">{chip.icon}</span>
                          {chip.name}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="relative group">
                    <Input 
                      placeholder="Tell me what you're building..." 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="h-16 pl-7 pr-16 bg-white border-[#E0E0E0] rounded-3xl shadow-2xl shadow-black/5 text-[15px] font-medium focus-visible:ring-primary focus-visible:ring-offset-0 focus:border-primary/50 transition-all"
                    />
                    <Button 
                      onClick={() => handleSend()}
                      size="icon" 
                      className="absolute right-2.5 top-2.5 h-11 w-11 rounded-2xl bg-[#111] hover:bg-primary transition-all shadow-lg active:scale-95"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground font-bold tracking-widest opacity-60">
                    POWERED BY PROPERTYHUB BUILD CONCIERGE
                  </p>
                </div>
              </div>
            </div>
          )}

          {view === 'board' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Board Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3">ACTIVE PROJECT</Badge>
                      <span className="text-xs text-muted-foreground font-bold">• Draft Created Today</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-[#111] leading-none">
                      {projectModel.type || "New Build Project"}
                    </h2>
                    <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> {projectModel.location}, Kenya
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-14 px-8 border-[#EEE] font-black text-xs uppercase tracking-[0.15em] gap-3 hover:bg-muted/50 transition-all shadow-sm">
                      <ArrowUpRight className="h-4 w-4" /> Optimize Cost
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Secure Materials"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-8 space-y-16">
                    {/* Materials Section */}
                    <section className="space-y-8">
                      <div className="flex items-center justify-between border-b border-[#EEE] pb-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#111] flex items-center gap-3">
                          <Package className="h-5 w-5 text-primary" /> Materials by Phase
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground">FILTER BY:</span>
                          <Badge variant="outline" className="text-[10px] font-black border-primary/30 text-primary">ALL PHASES</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {cart.length > 0 ? (
                          cart.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-[#F0F0F0] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
                              <div className="flex gap-6 items-center">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-[9px] font-black bg-muted/50 text-muted-foreground border-none px-2">{item.phase.toUpperCase()}</Badge>
                                    <span className="text-[10px] text-primary font-black tracking-widest">VERIFIED</span>
                                  </div>
                                  <h4 className="font-extrabold text-lg text-[#111] truncate">{item.name}</h4>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.supplier} • {item.spec}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <p className="font-black text-xl text-[#111]">KSh {item.price.toLocaleString()}</p>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Lowest Price</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-3 pr-2">
                                  <div className="flex items-center bg-[#F8F8F8] p-1 rounded-2xl border">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all text-[#111]"><Minus className="h-4 w-4"/></button>
                                    <span className="w-12 text-center text-sm font-black text-[#111]">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all text-[#111]"><Plus className="h-4 w-4"/></button>
                                  </div>
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Truck className="h-3 w-3 text-primary" /> Est. 48h Delivery
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center border-2 border-dashed rounded-[3rem] space-y-4 bg-muted/5">
                             <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-3xl">🏗</div>
                             <p className="font-bold text-muted-foreground">Your project board is empty.</p>
                             <Button variant="link" onClick={() => setView('concierge')} className="font-black text-primary uppercase text-xs tracking-widest">Return to Concierge</Button>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Services Section */}
                    <section className="space-y-8">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#111] flex items-center gap-3 border-b border-[#EEE] pb-4">
                        <Zap className="h-5 w-5 text-primary" /> Verified Professionals
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { emoji: "📐", role: "Site Surveyor", desc: `${projectModel.location} County Specialist`, price: "Est. KSh 35k - 60k" },
                          { emoji: "⚖️", role: "Quantity Surveyor", desc: "NEMA & NCA Certified", price: "Est. KSh 45k+" }
                        ].map((pro, i) => (
                          <div key={i} className="bg-primary/[0.03] p-8 rounded-[2.5rem] border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/[0.06] hover:border-primary/30 transition-all shadow-sm">
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">{pro.emoji}</div>
                              <div className="space-y-1">
                                <h4 className="font-black text-sm text-[#111] uppercase tracking-wide">{pro.role}</h4>
                                <p className="text-[11px] font-bold text-muted-foreground">{pro.desc}</p>
                                <p className="text-[10px] font-black text-primary tracking-widest mt-1">{pro.price}</p>
                              </div>
                            </div>
                            <Button size="icon" variant="ghost" className="rounded-full hover:bg-white shadow-sm">
                              <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Summary Sidebar */}
                  <div className="md:col-span-4">
                    <div className="bg-[#111] p-10 rounded-[3rem] text-white space-y-10 sticky top-24 shadow-2xl shadow-black/20 overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors" />
                      
                      <div className="space-y-2 relative">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Estimated Materials Value</p>
                        <h4 className="text-5xl font-black tracking-tighter">
                          KSh <span className="text-primary">{(totalCost / 1000).toFixed(0)}</span>k
                        </h4>
                      </div>
                      
                      <div className="space-y-5 relative">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                          <span className="opacity-40">Ready to Source</span>
                          <span className="text-primary">{projectModel.progress}%</span>
                        </div>
                        <Progress value={projectModel.progress} className="h-2 bg-white/5" />
                        <p className="text-[10px] text-white/30 font-bold leading-relaxed">
                          This estimate includes transport to {projectModel.location} and current regional market premiums.
                        </p>
                      </div>

                      <div className="space-y-8 pt-8 border-t border-white/10 relative">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">🏦</div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Escrow Enabled</p>
                            <p className="text-xs font-bold text-primary">Funds Protected by PropertyHub</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">🚛</div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Managed Logistics</p>
                            <p className="text-xs font-bold">Active Route: {projectModel.location}</p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-[0.98] relative z-10">
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'shop' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-12 animate-in fade-in duration-700 custom-scrollbar">
               <div className="max-w-6xl mx-auto space-y-12">
                 <div className="text-center py-24 bg-[#F8F8F8] rounded-[4rem] border border-dashed border-[#DDD] space-y-8">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">🛒</div>
                   <div className="space-y-3">
                    <h3 className="text-3xl font-black text-[#111]">Manual Shop Mode</h3>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto">Browse 1,500+ items directly. Best for contractors with existing material lists.</p>
                   </div>
                   <div className="flex flex-col items-center gap-4 pt-4">
                    <Button variant="default" className="rounded-full px-10 h-12 font-black uppercase tracking-widest text-xs">Unlock All Categories</Button>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">COMING SOON IN VERSION 2.0</p>
                   </div>
                 </div>
               </div>
            </div>
          )}

        </div>

        {/* Live Project Model (Desktop Context Panel) - Only show in board view */}
        {view === 'board' && (
          <aside className="hidden xl:flex w-[420px] border-l bg-white flex-col animate-in slide-in-from-right-12 duration-1000">
            <div className="p-10 pb-8 border-b">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Live Project Intelligence</h3>
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">IDENTIFIED PROJECT</p>
                  <p className="text-2xl font-black text-[#111] leading-tight">
                    {projectModel.type || "Undefined Build"}
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Intelligence Confidence</span>
                    <span className="text-primary">{projectModel.progress}%</span>
                  </div>
                  <Progress value={projectModel.progress} className="h-2 bg-muted/50" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-10 space-y-12 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">ACTIVE SPECIFICATIONS</h4>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Location", value: projectModel.location },
                    { icon: Wallet, label: "Budget Range", value: projectModel.budget || "Pending..." },
                    { icon: Calendar, label: "Build Timeline", value: projectModel.timeline },
                    { icon: Building2, label: "Scale", value: projectModel.floors ? projectModel.floors : "1 Floor" },
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-3xl bg-muted/20 border border-transparent hover:border-muted/50 hover:bg-muted/30 transition-all group">
                      <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <spec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{spec.label}</p>
                        <p className="text-[13px] font-extrabold text-[#111]">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#111] rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 relative z-10">
                  <Sparkles className="h-5 w-5 text-primary fill-primary" />
                  <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">ADVISOR NOTES</h5>
                </div>
                <p className="text-[13px] font-medium leading-relaxed opacity-80 relative z-10">
                  {projectModel.type.includes("Bungalow") 
                    ? "Based on your bungalow choice, I've prioritized local stone suppliers in Nakuru to minimize structural transport costs by 15%."
                    : "I'm currently mapping regional material cost modifiers to your location profile to ensure quote accuracy."}
                </p>
                <div className="pt-2 relative z-10">
                   <Badge variant="outline" className="text-[9px] font-black border-white/20 text-white/60">V1.2 ENGINE</Badge>
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Order Verification Dialog */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8">
          <DialogHeader className="space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <DialogTitle className="text-3xl font-black text-center tracking-tight">Order Received</DialogTitle>
            <DialogDescription className="text-center text-sm font-medium leading-relaxed">
              Your project order has been submitted for verification. We verify availability and current pricing with suppliers before fulfillment.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 p-6 rounded-3xl space-y-4 my-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📞</div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Next Step</p>
                <p className="text-xs font-bold text-[#111]">A representative will call you shortly.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">⏱️</div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Response Time</p>
                <p className="text-xs font-bold text-[#111]">Typically within 30 minutes</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button className="w-full h-14 rounded-2xl bg-[#111] hover:bg-primary font-black uppercase text-xs tracking-widest shadow-lg" onClick={() => setIsOrderModalOpen(false)}>
              Got it, thanks
            </Button>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-[#EEE] font-black uppercase text-xs tracking-widest gap-2">
              <PhoneCall className="h-4 w-4" /> Request Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
