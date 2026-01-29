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
  ChevronLeft,
  X,
  ArrowRight
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
  SheetFooter,
  SheetTrigger
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
const PRODUCT_CATEGORIES = [
  { id: "cement", name: "Cement & Aggregates", icon: "🧱", time: "24-48h", counties: "47", price: "From KSh 900" },
  { id: "sand", name: "Sand & Ballast", icon: "🚚", time: "Same Day", counties: "Regional", price: "From KSh 18,000" },
  { id: "steel", name: "Steel & Reinforcement", icon: "🏗", time: "24h", counties: "47", price: "From KSh 1,200" },
  { id: "roofing", name: "Roofing", icon: "🏠", time: "3-5 Days", counties: "47", price: "Varies" },
  { id: "plumbing", name: "Plumbing", icon: "🚰", time: "24h", counties: "47", price: "From KSh 500" },
  { id: "electrical", name: "Electrical", icon: "⚡", time: "24h", counties: "47", price: "From KSh 300" },
  { id: "finishes", name: "Finishes", icon: "🎨", time: "2-4 Days", counties: "47", price: "Varies" },
  { id: "blocks", name: "Blocks & Bricks", icon: "🧱", time: "2-3 Days", counties: "Regional", price: "From KSh 45" },
];

const PRODUCTS = [
  {
    id: "sand-lorry",
    name: "River Sand (Lorry Load)",
    spec: "Clean, fine river sand",
    price: 18000,
    unit: "lorry",
    supplier: "Regional Quarries",
    category: "Sand & Ballast",
    image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=400&auto=format&fit=crop",
    type: "lorry",
    sizes: ["7T", "10T", "14T", "20T"],
    stock: "In Stock",
    delivery: "Same-County"
  },
  {
    id: "c1",
    name: "Bamburi Tembo Cement",
    spec: "Type 32.5N",
    price: 950,
    unit: "bag",
    supplier: "Bamburi Cement Ltd",
    category: "Cement & Aggregates",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    type: "bag",
    brands: ["Bamburi", "Simba", "Devki", "Savannah"],
    stock: "In Stock",
    delivery: "Country-wide"
  },
  {
    id: "steel-1",
    name: "TMT Steel Bars",
    spec: "12mm High-Strength",
    price: 1450,
    unit: "bar",
    supplier: "Devki Steel Mills",
    category: "Steel & Reinforcement",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    type: "bar",
    stock: "In Stock",
    delivery: "Country-wide"
  },
  {
    id: "ballast-lorry",
    name: "Ballast (Lorry Load)",
    spec: "Crushed stone for concrete",
    price: 22000,
    unit: "lorry",
    supplier: "Regional Quarries",
    category: "Sand & Ballast",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    type: "lorry",
    sizes: ["7T", "10T", "14T", "20T"],
    stock: "In Stock",
    delivery: "Same-County"
  }
];

const KENYA_COUNTIES = [
  "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera",
  "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri",
  "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma",
  "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"
];

const BUDGET_RANGES = ["KSh 1M–2M", "KSh 2M–4M", "KSh 4M+", "Not sure yet"];

export default function BuildingMaterialsShop() {
  const navigate = useNavigate();
  const [view, setView] = useState<'warehouse' | 'board' | 'concierge'>('warehouse');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Habari! I'm your AI Genie. Not sure what you need? Tell me about your project and I'll generate a smart estimate.", step: 'type' }
  ]);
  const [inputText, setInputText] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState('type');
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [fulfillmentForm, setFulfillmentForm] = useState({
    name: "",
    phone: "",
    county: "Nairobi",
    location: "",
    date: ""
  });

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
            options: KENYA_COUNTIES
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
            options: ["1 Floor", "2 Floors", "3 Floors", "4+ Floors", "Skyscraper"] 
          };
          setCurrentStep('floors');
          break;
        case 'floors':
          setProjectModel(p => ({ ...p, floors: text, progress: 90 }));
          nextMsg = { 
            role: 'assistant', 
            content: "Excellent. I've prepared a recommended materials list for your project. Are you okay with this selection? If so, we can proceed to the order curation.", 
            step: 'final',
            type: 'carousel',
            items: PRODUCTS,
            options: ["✅ Yes, add to cart", "🔧 Customize selection", "🤖 Talk to Rep"] 
          };
          setCurrentStep('final');
          break;
        case 'final':
          if (text.includes("Yes")) {
            const initialMaterials = PRODUCTS.map(m => ({ ...m, quantity: 1 }));
            setCart(initialMaterials);
            nextMsg = { role: 'assistant', content: "Perfect! All materials have been added to your order list. You can now submit it for human verification." };
            setTimeout(() => setView('board'), 1500);
          } else {
            nextMsg = { role: 'assistant', content: "No problem. Let me know what you'd like to adjust." };
          }
          break;
        default:
          nextMsg = { role: 'assistant', content: "I'm ready when you are. Just let me know if you need to adjust anything." };
      }
      
      setMessages(prev => [...prev, nextMsg]);
    }, 100); // Instant response
  };

  const handleOptionClick = (option: string) => {
    handleSend(option);
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

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const productScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
            <h1 className="text-lg font-extrabold tracking-tight text-[#1A1A1A]">Smart Warehouse</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">Materials. Logistics. Done Right.</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center bg-muted/30 p-1 rounded-full">
              <Button 
                variant={view === 'warehouse' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setView('warehouse')}
                className={cn("rounded-full px-5 text-[11px] font-bold uppercase tracking-wider h-8", view === 'warehouse' && "shadow-sm")}
              >
                Warehouse
              </Button>
              <Button 
                variant={view === 'board' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setView('board')}
                className={cn("rounded-full px-5 text-[11px] font-bold uppercase tracking-wider h-8", view === 'board' && "shadow-sm")}
              >
                Order List
              </Button>
              <Button 
                variant={view === 'concierge' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setView('concierge')}
                className={cn("rounded-full px-5 text-[11px] font-bold uppercase tracking-wider h-8", view === 'concierge' && "shadow-sm")}
              >
                AI Assist
              </Button>
            </div>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full border-muted-foreground/20">
                  <ShoppingBag className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full animate-in zoom-in">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0 flex flex-col rounded-l-[3rem]">
                <SheetHeader className="p-8 border-b">
                  <SheetTitle className="text-2xl font-black">Smart Cart</SheetTitle>
                  <SheetDescription className="font-medium text-muted-foreground">Submit for human verification</SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 p-8">
                  <div className="space-y-6">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.supplier}</p>
                          <p className="font-black text-sm">KSh {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-center bg-muted/30 rounded-xl p-1">
                          <button onClick={() => updateQuantity(item.id, 1)} className="h-6 w-6 flex items-center justify-center hover:bg-white rounded-md"><Plus className="h-3 w-3"/></button>
                          <span className="text-xs font-black h-6 flex items-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, -1)} className="h-6 w-6 flex items-center justify-center hover:bg-white rounded-md"><Minus className="h-3 w-3"/></button>
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <div className="text-center py-20 space-y-4">
                        <div className="text-4xl opacity-20">🛒</div>
                        <p className="text-muted-foreground font-bold">Your cart is empty</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <SheetFooter className="p-8 border-t bg-muted/10 space-y-4 flex flex-col">
                  <div className="flex justify-between items-end w-full">
                    <p className="text-[10px] font-black uppercase text-muted-foreground">Estimated Total</p>
                    <p className="text-2xl font-black">KSh {totalCost.toLocaleString()}</p>
                  </div>
                  <Button 
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs"
                    disabled={cart.length === 0}
                    onClick={() => {
                      setIsCartOpen(false);
                      setView('board');
                    }}
                  >
                    View Full Order List
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col h-full bg-[#FDFDFD] overflow-y-auto custom-scrollbar-premium">
          
          {view === 'warehouse' && (
            <div className="w-full">
              {/* Hero Section */}
              <section className="px-6 py-12 md:py-20 text-center space-y-6 max-w-4xl mx-auto">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-4 py-1 uppercase">PropertyHub Smart Warehouse</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#111]">Order building materials the smart way.</h2>
                <p className="text-lg text-muted-foreground font-medium">Cement, sand, ballast, steel, roofing & finishes — delivered across Kenya.</p>
                <div className="flex flex-wrap justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Verified Suppliers
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" /> County-based delivery
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <Wallet className="h-4 w-4 text-primary" /> Pay after confirmation
                  </div>
                </div>
              </section>

              {/* Category Rail Carousel */}
              <section className="px-6 md:px-12 py-8 border-y bg-white/50 relative group/carousel">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kenyan-First Categories</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => scrollLeft(categoryScrollRef)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => scrollRight(categoryScrollRef)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div ref={categoryScrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 scroll-smooth">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex flex-col gap-3 p-6 rounded-[2.5rem] border text-left min-w-[220px] transition-all hover:shadow-xl group flex-shrink-0 animate-in fade-in zoom-in-95",
                          selectedCategory === cat.id ? "border-primary bg-primary/5 shadow-md scale-105" : "bg-white border-[#EEE]"
                        )}
                      >
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                        <div>
                          <h3 className="font-black text-sm text-[#111]">{cat.name}</h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{cat.time} Delivery</p>
                        </div>
                      </button>
                    ))}
                    <button className="flex flex-col items-center justify-center gap-3 p-6 rounded-[2.5rem] border border-dashed border-primary/30 bg-primary/5 min-w-[220px] flex-shrink-0 hover:bg-primary/10 transition-all group">
                      <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                        <PhoneCall className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-black text-sm text-primary">Talk to Rep</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Instant Help</p>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* Product Grid Carousel */}
              <section className="p-6 md:p-12 max-w-7xl mx-auto relative group/products">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Smart Warehouse Listings</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-muted-foreground/20" onClick={() => scrollLeft(productScrollRef)}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-muted-foreground/20" onClick={() => scrollRight(productScrollRef)}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div ref={productScrollRef} className="flex gap-8 overflow-x-auto hide-scrollbar pb-8 scroll-smooth">
                  {PRODUCTS.map((product) => (
                    <div key={product.id} className="min-w-[320px] bg-white rounded-[3rem] border border-[#EEE] p-6 flex flex-col gap-4 shadow-sm hover:shadow-2xl transition-all group relative animate-in fade-in slide-in-from-right-8">
                      <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-muted relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <Badge className="bg-green-500 text-white border-none text-[9px] font-black px-2">{product.stock}</Badge>
                          <Badge variant="outline" className="bg-white/80 backdrop-blur text-[9px] font-black border-none px-2 text-[#111]">{product.delivery} DELIVERY</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-black text-lg text-[#111] leading-tight">{product.name}</h4>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">TRUSTED SUPPLIER: {product.supplier}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            {product.type === 'lorry' ? (
                              <Select defaultValue="10T">
                                <SelectTrigger className="h-12 rounded-2xl text-[11px] font-bold bg-muted/30 border-none">
                                  <SelectValue placeholder="Size" />
                                </SelectTrigger>
                                <SelectContent>
                                  {product.sizes?.map(s => <SelectItem key={s} value={s}>{s} Lorry</SelectItem>)}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Select defaultValue={product.brands?.[0] || ""}>
                                <SelectTrigger className="h-12 rounded-2xl text-[11px] font-bold bg-muted/30 border-none">
                                  <SelectValue placeholder="Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                  {product.brands?.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                            <div className="flex items-center justify-between bg-muted/30 rounded-2xl px-4 h-12">
                              <button onClick={() => {}} className="text-primary"><Minus className="h-3 w-3"/></button>
                              <span className="text-xs font-black">1</span>
                              <button onClick={() => {}} className="text-primary"><Plus className="h-3 w-3"/></button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <p className="text-[10px] font-black uppercase text-muted-foreground">From</p>
                              <p className="text-xl font-black text-[#111]">KSh {product.price.toLocaleString()}</p>
                            </div>
                            <Button 
                              onClick={() => {
                                setCart(prev => [...prev, { ...product, quantity: 1 }]);
                                toast.success(`${product.name} added to cart`);
                              }}
                              className="bg-[#111] text-white rounded-2xl px-6 h-12 text-[11px] font-black uppercase tracking-wider hover:bg-primary transition-colors"
                            >
                              Add to Cart
                            </Button>
                          </div>
                          
                          <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors">
                            <PhoneCall className="h-3 w-3" /> Talk to Rep
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* AI Genie Banner */}
              <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto w-full">
                <div className="bg-[#111] rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                  <div className="relative z-10 max-w-2xl space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-[2rem] bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                        <Sparkles className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <h3 className="text-[11px] font-black tracking-[0.3em] uppercase opacity-60 text-white">AI GENIE INTELLIGENCE</h3>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1]">Not sure what you need? Let Genie handle the complexity.</h2>
                    <p className="text-lg text-white/60 font-medium">Genie validates quantities, estimates project totals, and flags unrealistic orders automatically.</p>
                    <Button 
                      onClick={() => setView('concierge')}
                      className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      Ask Genie to Estimate
                    </Button>
                  </div>
                  
                  {/* Decorative Floating Element */}
                  <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute top-10 right-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-bounce duration-[5s]" />
                </div>
              </section>
            </div>
          )}

          {view === 'board' && (
            <div className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto custom-scrollbar-premium">
              <div className="max-w-4xl mx-auto w-full space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black">Your Order List</h2>
                    <p className="text-sm font-medium text-muted-foreground">Project: {projectModel.type || "Custom Order"} in {projectModel.location}</p>
                  </div>
                  <Badge variant="outline" className="h-8 rounded-full px-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase">Drafting Order</Badge>
                </div>

                <div className="grid gap-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center bg-white p-6 rounded-[2rem] border border-[#EEE] shadow-sm animate-in fade-in slide-in-from-bottom-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.supplier}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="font-black text-lg">KSh {item.price.toLocaleString()}</p>
                          <span className="text-muted-foreground font-medium">/ {item.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-muted/30 rounded-2xl p-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 flex items-center justify-center hover:bg-white rounded-xl shadow-sm transition-all"><Minus className="h-4 w-4 text-primary"/></button>
                        <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 flex items-center justify-center hover:bg-white rounded-xl shadow-sm transition-all"><Plus className="h-4 w-4 text-primary"/></button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-[#EEE] border-dashed">
                      <p className="text-muted-foreground font-bold">No items in your order list yet.</p>
                      <Button variant="ghost" onClick={() => setView('warehouse')} className="mt-4 text-primary font-black uppercase text-xs">Browse Warehouse</Button>
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="bg-[#111] rounded-[3rem] p-10 text-white space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-6">
                      <p className="text-[10px] font-black uppercase text-white/60">Estimated Total</p>
                      <h3 className="text-3xl font-black">KSh {totalCost.toLocaleString()}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Delivery details</h4>
                        <div className="space-y-3">
                          <Select defaultValue="Nairobi" onValueChange={(v) => setFulfillmentForm(f => ({ ...f, county: v }))}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl text-white font-bold">
                              <SelectValue placeholder="Select County" />
                            </SelectTrigger>
                            <SelectContent>
                              {KENYA_COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="Exact Location / Site Address" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/30 font-bold"
                            onChange={(e) => setFulfillmentForm(f => ({ ...f, location: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Contact info</h4>
                        <div className="space-y-3">
                          <Input 
                            placeholder="Full Name" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/30 font-bold"
                            onChange={(e) => setFulfillmentForm(f => ({ ...f, name: e.target.value }))}
                          />
                          <Input 
                            placeholder="Phone Number (WhatsApp preferred)" 
                            className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-white/30 font-bold"
                            onChange={(e) => setFulfillmentForm(f => ({ ...f, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-16 rounded-[1.5rem] bg-primary text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-transform shadow-2xl shadow-primary/20"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit for Human Verification"}
                    </Button>
                    <p className="text-center text-[10px] font-bold text-white/40 uppercase">You will not be charged yet. A rep will call to verify site access.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'concierge' && (
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              {/* Genie Background Decor */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar-premium" ref={scrollRef}>
                <div className="max-w-3xl mx-auto space-y-10">
                  {messages.map((m, i) => (
                    <div key={i} className={cn(
                      "flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4",
                      m.role === 'user' ? "items-end" : "items-start"
                    )}>
                      {m.role === 'assistant' && (
                        <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className={cn(
                        "p-8 rounded-[2.5rem] max-w-[90%] font-medium leading-relaxed shadow-sm",
                        m.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-muted/30 text-[#111] rounded-tl-none border border-[#EEE]"
                      )}>
                        {m.content}
                      </div>
                      
                      {m.type === 'options' && m.options && (
                        <div className="flex flex-wrap gap-3 pt-2">
                          {m.options.map((opt, oi) => (
                            <Button 
                              key={oi} 
                              variant="outline" 
                              onClick={() => handleOptionClick(opt)}
                              className="rounded-2xl border-primary/20 bg-white hover:bg-primary/5 hover:border-primary text-[11px] font-bold h-12 px-6"
                            >
                              {opt}
                            </Button>
                          ))}
                        </div>
                      )}

                      {m.type === 'carousel' && m.items && (
                        <div className="w-full overflow-x-auto hide-scrollbar pb-4 pt-2">
                          <div className="flex gap-4">
                            {m.items.map((item, ii) => (
                              <div key={ii} className="min-w-[280px] bg-white rounded-[2rem] border border-[#EEE] p-5 shadow-sm">
                                <img src={item.image} className="w-full aspect-video object-cover rounded-2xl mb-4" />
                                <h4 className="font-bold text-sm">{item.name}</h4>
                                <p className="text-[10px] font-black text-primary uppercase mt-1">{item.supplier}</p>
                                <div className="flex justify-between items-center mt-4">
                                  <p className="font-black">KSh {item.price.toLocaleString()}</p>
                                  <Badge className="bg-muted text-[#111] hover:bg-muted border-none font-bold">Recommended</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 md:p-12 border-t bg-white/80 backdrop-blur-xl relative z-20">
                <div className="max-w-3xl mx-auto flex gap-4">
                  <div className="flex-1 relative group">
                    <Input 
                      placeholder="Type your message or project details..." 
                      className="h-16 rounded-[2rem] px-8 bg-muted/50 border-none shadow-inner text-lg font-medium group-focus-within:bg-white group-focus-within:shadow-2xl transition-all"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"><ClipboardList className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"><MapPin className="h-5 w-5" /></Button>
                    </div>
                  </div>
                  <Button 
                    className="h-16 w-16 rounded-[2rem] bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    onClick={() => handleSend()}
                  >
                    <Send className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[3rem] p-10 border-none">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="h-24 w-24 rounded-[3rem] bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black">Order Submitted!</h2>
              <p className="font-medium text-muted-foreground">Verification ID: PH-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="bg-muted/30 p-8 rounded-[2rem] w-full text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><PhoneCall className="h-4 w-4 text-primary"/></div>
                <p className="text-xs font-bold uppercase">Rep Callback: Within 30 mins</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Truck className="h-4 w-4 text-primary"/></div>
                <p className="text-xs font-bold uppercase">Est. Delivery: {fulfillmentForm.county} (24-48h)</p>
              </div>
            </div>
            <Button 
              className="w-full h-16 rounded-2xl bg-[#111] text-white font-black uppercase tracking-widest text-xs"
              onClick={() => {
                setIsOrderModalOpen(false);
                setCart([]);
                setView('warehouse');
                navigate('/');
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
