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
    if (ref.current) ref.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) ref.current.scrollBy({ left: 300, behavior: 'smooth' });
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

      <main className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full relative">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col h-full bg-[#FDFDFD]">
          
          {view === 'warehouse' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar-premium">
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
                              <Select defaultValue="Bamburi">
                                <SelectTrigger className="h-12 rounded-2xl text-[11px] font-bold bg-muted/30 border-none">
                                  <SelectValue placeholder="Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                  {product.brands?.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}
                            <div className="flex items-center bg-muted/30 rounded-2xl h-12 px-2">
                              <button className="flex-1 flex justify-center hover:bg-white rounded-xl h-8 items-center transition-all"><Minus className="h-3 w-3"/></button>
                              <span className="w-8 text-center text-sm font-black">1</span>
                              <button className="flex-1 flex justify-center hover:bg-white rounded-xl h-8 items-center transition-all"><Plus className="h-3 w-3"/></button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">From</p>
                              <p className="font-black text-2xl text-[#111]">KSh {product.price.toLocaleString()}</p>
                            </div>
                            <Button 
                              onClick={() => {
                                setCart([...cart, { ...product, quantity: 1 }]);
                                toast.success("Added to Order List");
                              }}
                              className="rounded-2xl h-14 px-8 bg-[#111] hover:bg-primary transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-black/5"
                            >
                              Add to Cart
                            </Button>
                          </div>
                          
                          <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-muted-foreground hover:text-primary gap-2 h-10">
                            <PhoneCall className="h-4 w-4" /> Talk to Rep
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contextual AI Genie Entry */}
              <section className="px-6 py-20 bg-muted/10">
                <div className="max-w-4xl mx-auto bg-[#111] rounded-[4rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -mr-48 -mt-48" />
                  <div className="flex-1 space-y-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 bg-primary rounded-[1.5rem] flex items-center justify-center">
                        <Sparkles className="h-7 w-7 text-white fill-white" />
                      </div>
                      <h3 className="text-[11px] font-black tracking-[0.3em] uppercase opacity-60">AI GENIE INTELLIGENCE</h3>
                    </div>
                    <h2 className="text-4xl font-black leading-tight">Not sure what you need? Let Genie handle the complexity.</h2>
                    <p className="text-white/60 font-medium text-lg leading-relaxed">Genie validates quantities, estimates project totals, and flags unrealistic orders automatically.</p>
                    <Button 
                      onClick={() => setView('concierge')}
                      className="rounded-2xl h-16 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-[0.15em] transition-all shadow-2xl shadow-primary/40"
                    >
                      Ask Genie to Estimate
                    </Button>
                  </div>
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-64 h-64 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center text-7xl animate-pulse">🧠</div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {view === 'concierge' && (
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 md:p-8">
              {/* Chat Window */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-8 pb-32 scroll-smooth pr-4 custom-scrollbar-premium">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}>
                    <div className={cn(
                      "p-7 rounded-[2.5rem] text-[16px] font-medium leading-relaxed shadow-lg",
                      m.role === 'user' 
                        ? "bg-[#111] text-white rounded-tr-none" 
                        : "bg-white border border-[#EEE] rounded-tl-none text-[#222]"
                    )}>
                      {m.content}
                    </div>
                    
                    {m.type === 'carousel' && m.items && (
                      <div className="w-full mt-6 relative group/carousel">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recommended Materials</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-muted-foreground/20">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-muted-foreground/20">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="w-full whitespace-nowrap rounded-[3rem] border-2 border-primary/10 bg-white/50 backdrop-blur-sm">
                          <div className="flex w-max p-6 gap-6">
                            {m.items.map((item, idx) => (
                              <div key={idx} className="w-[300px] bg-white rounded-[2.5rem] border border-[#EEE] p-5 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-black text-base truncate">{item.name}</h4>
                                  <p className="text-[10px] font-bold text-primary uppercase">{item.supplier}</p>
                                  <p className="font-black text-lg">KSh {item.price.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-2xl text-center">
                                  <p className="text-[10px] font-black text-primary uppercase">Automated Sourcing Ready</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="h-2 custom-scrollbar-premium" />
                        </ScrollArea>
                      </div>
                    )}

                    {m.options && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {m.options.map(opt => (
                          <Button 
                            key={opt} 
                            variant="outline" 
                            size="lg"
                            onClick={() => handleOptionClick(opt)}
                            className="rounded-full text-[12px] font-black border-[#DDD] hover:border-primary hover:bg-primary/5 hover:text-primary transition-all h-11 px-8 shadow-sm hover:shadow-md uppercase tracking-wider"
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
              <div className="fixed bottom-0 left-0 right-0 p-4 md:p-12 bg-gradient-to-t from-[#FDFDFD] via-[#FDFDFD] to-transparent pointer-events-none">
                <div className="max-w-4xl mx-auto space-y-4 pointer-events-auto">
                  <div className="relative group">
                    <Input 
                      placeholder="Tell Genie about your project..." 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="h-20 pl-8 pr-20 bg-white border-[#E0E0E0] rounded-[2.5rem] shadow-2xl shadow-black/5 text-[17px] font-medium focus-visible:ring-primary focus-visible:ring-offset-0 focus:border-primary/50 transition-all"
                    />
                    <Button 
                      onClick={() => handleSend()}
                      size="icon" 
                      className="absolute right-3 top-3 h-14 w-14 rounded-2xl bg-[#111] hover:bg-primary transition-all shadow-xl active:scale-95"
                    >
                      <Send className="h-6 w-6" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground font-black tracking-[0.3em] opacity-60 uppercase">
                    POWERED BY PROPERTYHUB AI GENIE™
                  </p>
                </div>
              </div>
            </div>
          )}

          {view === 'board' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar-premium">
              <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Board Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 uppercase">Order Curation</Badge>
                      <span className="text-xs text-muted-foreground font-bold">• Fulfillment Pending</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-[#111] leading-none">
                      Your Project Order List
                    </h2>
                    <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Fulfillment via verified regional suppliers
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl h-14 px-8 border-[#EEE] font-black text-xs uppercase tracking-[0.15em] gap-3 hover:bg-muted/50 transition-all shadow-sm">
                      <ClipboardList className="h-4 w-4" /> Save Draft
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit for Fulfillment"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {cart.length > 0 ? (
                    cart.map((item, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-[3rem] border border-[#F0F0F0] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="flex gap-6 items-center">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-[9px] font-black bg-muted/50 text-muted-foreground border-none px-2 uppercase">{item.category || "Material"}</Badge>
                              <span className="text-[10px] text-primary font-black tracking-widest uppercase">Ready for Quote</span>
                            </div>
                            <h4 className="font-extrabold text-lg text-[#111] truncate">{item.name}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{item.supplier} • {item.spec}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="font-black text-xl text-[#111]">Est. KSh {item.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3 pr-2">
                            <div className="flex items-center bg-[#F8F8F8] p-1 rounded-2xl border">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all text-[#111]"><Minus className="h-4 w-4"/></button>
                              <span className="w-12 text-center text-sm font-black text-[#111]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all text-[#111]"><Plus className="h-4 w-4"/></button>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                              <Package className="h-3 w-3 text-primary" /> Verification Required
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-[3rem] space-y-4 bg-muted/5">
                       <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-3xl">🛒</div>
                       <p className="font-bold text-muted-foreground">Your order list is empty.</p>
                       <Button variant="link" onClick={() => setView('warehouse')} className="font-black text-primary uppercase text-xs tracking-widest">Browse Materials</Button>
                    </div>
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="bg-muted/10 p-10 rounded-[3rem] space-y-6">
                    <div className="flex justify-between items-center border-b border-[#DDD] pb-6">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Estimated Subtotal</p>
                      <p className="text-3xl font-black text-[#111]">KSh {totalCost.toLocaleString()}</p>
                    </div>
                    <div className="flex items-start gap-4 text-muted-foreground">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-xs font-medium leading-relaxed">This is an estimated subtotal for order curation. A PropertyHub representative will verify stock and current market prices with regional suppliers before finalizing your order.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fulfillment Dialog */}
          <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
            <DialogContent className="sm:max-w-[500px] rounded-[3rem] p-8">
              <DialogHeader className="space-y-4">
                <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-black text-center tracking-tight">Order Fulfillment</DialogTitle>
                <DialogDescription className="text-center font-medium leading-relaxed">
                  Your order has been received and is being curated. Please provide your contact details for verification.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Input placeholder="Full Name" className="h-14 rounded-2xl bg-muted/30 border-none font-medium" />
                <Input placeholder="Phone Number" className="h-14 rounded-2xl bg-muted/30 border-none font-medium" />
                <Select defaultValue="Nairobi">
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none font-medium">
                    <SelectValue placeholder="Select County" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nairobi">Nairobi</SelectItem>
                    <SelectItem value="Mombasa">Mombasa</SelectItem>
                    <SelectItem value="Nakuru">Nakuru</SelectItem>
                    <SelectItem value="Kiambu">Kiambu</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Preferred Delivery Date" type="date" className="h-14 rounded-2xl bg-muted/30 border-none font-medium" />
              </div>

              <div className="bg-[#111] p-6 rounded-2xl text-white space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 text-center">HOW IT WORKS</p>
                <p className="text-[13px] font-medium text-center opacity-80 leading-relaxed">
                  A PropertyHub representative will contact you shortly to confirm pricing, delivery logistics, and secure payment.
                </p>
              </div>

              <DialogFooter className="mt-6">
                <Button 
                  onClick={() => {
                    setIsOrderModalOpen(false);
                    toast.success("Order submitted for curation!");
                    setView('warehouse');
                  }}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20"
                >
                  Confirm Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            
            <div className="flex-1 p-10 space-y-12 overflow-y-auto custom-scrollbar-premium">
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
                    ? "Based on your bungalow choice, I've prioritized local stone suppliers to minimize structural transport costs by 15%."
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
    </div>
  );
}
