import { useState, useMemo, useEffect } from "react";
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
  ArrowUpRight
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

// Categories & Smart Sets
const CATEGORIES = [
  "All Materials",
  "Cement & Aggregates",
  "Steel & Metal",
  "Roofing",
  "Plumbing",
  "Electrical",
  "Finishing",
  "Prefab"
];

const SMART_SETS = [
  { id: "foundation", name: "Foundation Set", icon: "🧱" },
  { id: "superstructure", name: "Superstructure Set", icon: "🏗" },
  { id: "roofing", name: "Roofing Set", icon: "🏠" },
  { id: "finishing", name: "Finishing Set", icon: "🎨" },
];

const PROJECTS = [
  { id: "p1", name: "3-Bedroom Maisonette – Nakuru", type: "Maisonette", size: 150, location: "Nakuru" },
  { id: "p2", name: "Modern Studio – Kilimani", type: "Apartment", size: 45, location: "Nairobi" },
];

const PRODUCTS = [
  // CEMENT
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
    id: "c2",
    name: "Savannah Cement",
    spec: "50kg Bag, Type 42.5R",
    price: 1050,
    rating: 4.7,
    supplier: "Savannah Cement",
    verified: true,
    coverage: ["Nairobi", "Mombasa", "Nakuru"],
    stock: "Available near site",
    category: "Cement & Aggregates",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 180,
    sets: ["foundation", "superstructure"]
  },
  // STEEL
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
  },
  {
    id: "s2",
    name: "Steel Mesh (A142)",
    spec: "2.4m x 4.8m Sheet",
    price: 4200,
    rating: 4.6,
    supplier: "Apex Steel",
    verified: true,
    coverage: ["Nairobi", "Nakuru"],
    stock: "Available near site",
    category: "Steel & Metal",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 12,
    sets: ["foundation"]
  },
  // ROOFING
  {
    id: "r1",
    name: "Clay Roof Tiles",
    spec: "Standard Red, Interlocking",
    price: 85,
    rating: 4.7,
    supplier: "Manson Tiles",
    verified: true,
    coverage: ["Nairobi", "Machakos"],
    stock: "Available near site",
    category: "Roofing",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 1200,
    sets: ["roofing"]
  },
  {
    id: "r2",
    name: "Versatile Iron Sheets",
    spec: "Gauge 28, Charcoal Grey",
    price: 1250,
    rating: 4.8,
    supplier: "MRM (Mabati Rolling Mills)",
    verified: true,
    coverage: ["All Counties"],
    stock: "Available near site",
    category: "Roofing",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 48,
    sets: ["roofing"]
  }
];

export default function BuildingMaterialsShop() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [progress, setProgress] = useState(32);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (activeSet) {
      result = result.filter(p => p.sets?.includes(activeSet));
    } else if (activeCategory !== "All Materials") {
      result = result.filter(p => p.category === activeCategory);
    }
    return result;
  }, [activeCategory, activeSet]);

  const addToProject = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.info(`${product.name} is already in your project.`);
        return prev;
      }
      toast.success(`Added ${product.estimateNeeded} units to your project.`);
      return [...prev, { ...product, quantity: product.estimateNeeded }];
    });
  };

  const addSmartSet = (setId: string) => {
    const setMaterials = PRODUCTS.filter(p => p.sets?.includes(setId));
    setCart(prev => {
      const newItems = setMaterials.filter(m => !prev.find(item => item.id === m.id));
      const updatedCart = [...prev, ...newItems.map(m => ({ ...m, quantity: m.estimateNeeded }))];
      return updatedCart;
    });
    setActiveSet(setId);
    toast.success(`Smart Set applied. ${setMaterials.length} materials added.`);
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4 hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A]">Project-Aware Materials</h1>
            <p className="text-[10px] font-medium text-primary uppercase tracking-[0.1em]">Smart Materials Engine</p>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setIsCartOpen(true)} 
              className="relative border-none bg-muted/50 hover:bg-muted transition-colors px-4 rounded-full gap-2"
            >
              <Package className="h-4 w-4" />
              <span className="text-sm font-semibold">{cart.length}</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-8 px-4 md:px-8">
        {/* Above the Fold / Project Context */}
        <div className="mb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111] leading-tight">
                Build smarter. <br/>
                <span className="text-muted-foreground">Buy exactly what you need.</span>
              </h2>
              
              <div className="flex items-center gap-6 pt-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Project Coverage</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-muted" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-[10px] text-primary font-bold flex items-center gap-1">
                        <Info className="h-3 w-3" /> You've added foundation materials
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Foundation phase is 85% complete in your list.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-[320px] p-6 bg-white border rounded-3xl shadow-sm space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Project</label>
                <Select defaultValue={selectedProject.id} onValueChange={(val) => setSelectedProject(PROJECTS.find(p => p.id === val)!)}>
                  <SelectTrigger className="w-full bg-muted/30 border-none h-12 rounded-xl focus:ring-0">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-muted">
                    {PROJECTS.map(p => (
                      <SelectItem key={p.id} value={p.id} className="rounded-xl">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                <ShieldCheck className="h-3 w-3 text-primary" />
                Verified for {selectedProject.location} building codes
              </div>
            </div>
          </div>
        </div>

        {/* Smart Set Chips */}
        <div className="mb-10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary fill-primary" />
            Smart Sets
          </h3>
          <div className="flex flex-wrap gap-3">
            {SMART_SETS.map(set => (
              <Button
                key={set.id}
                variant="outline"
                onClick={() => addSmartSet(set.id)}
                className={cn(
                  "rounded-full h-12 px-6 border-muted transition-all duration-300 gap-3",
                  activeSet === set.id ? "bg-primary border-primary text-primary-foreground" : "hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <span className="text-xl">{set.icon}</span>
                <span className="font-semibold">{set.name}</span>
                <ArrowUpRight className={cn("h-3 w-3 opacity-50", activeSet === set.id && "opacity-100")} />
              </Button>
            ))}
            {activeSet && (
              <Button variant="ghost" onClick={() => setActiveSet(null)} className="h-12 px-4 rounded-full text-xs font-bold text-muted-foreground">
                Clear Set
              </Button>
            )}
          </div>
        </div>

        {/* Sticky Category Nav */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-6 bg-[#FDFDFD]/90 backdrop-blur-md mb-8">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-8">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSet(null);
                  }}
                  className={cn(
                    "text-sm font-bold transition-all relative pb-2 tracking-tight",
                    activeCategory === category && !activeSet
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category}
                  {activeCategory === category && !activeSet && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1" />
                  )}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white border border-[#EEE] rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all duration-500 flex flex-col">
              <div className="aspect-[5/4] overflow-hidden bg-[#F9F9F9] relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur text-[10px] font-bold text-black border-none px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">
                    <span>{product.supplier}</span>
                    {product.verified && <ShieldCheck className="h-3 w-3 text-primary" />}
                  </div>
                  <h3 className="font-bold text-xl tracking-tight leading-[1.1] text-[#111]">{product.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{product.spec}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0">
                      <p className="text-2xl font-black text-[#111]">KSh {product.price.toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                        Est. needed: <span className="text-primary">{product.estimateNeeded} bags</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><Info className="h-2.5 w-2.5" /></TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="text-[10px] max-w-[150px]">Based on {selectedProject.type}, {selectedProject.size}sqm in {selectedProject.location}.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold h-6">
                      {product.stock}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Button 
                    onClick={() => addToProject(product)}
                    className="w-full bg-[#111] hover:bg-primary text-white transition-all duration-300 rounded-2xl h-14 font-bold text-base gap-3 group/btn"
                  >
                    <Plus className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                    Add to Project
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Project Summary (Desktop Only) */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <Button 
          onClick={() => setIsCartOpen(true)}
          className="h-20 px-8 bg-[#111] hover:bg-primary text-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] gap-6 animate-in slide-in-from-right-10 duration-500"
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Project Materials</span>
            <span className="text-lg font-black">{cart.length} items · KSh {(totalCost / 1000000).toFixed(2)}M</span>
          </div>
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
            <LayoutGrid className="h-5 w-5" />
          </div>
        </Button>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 pb-safe">
        <Button 
          onClick={() => setIsCartOpen(true)}
          className="w-full h-14 bg-[#111] hover:bg-primary text-white rounded-2xl font-bold text-lg gap-3"
        >
          <LayoutGrid className="h-5 w-5" />
          View Project Cart ({cart.length})
        </Button>
      </div>

      {/* Slide-in Project Command Center */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto border-l-0 sm:border-l p-0">
          <div className="flex flex-col h-full bg-[#FDFDFD]">
            <div className="p-8 pb-6 border-b bg-white">
              <SheetHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-3xl font-black tracking-tight">Command Center</SheetTitle>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 rounded-lg h-7 font-bold">
                    ACTIVE BUILD
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#111]">{selectedProject.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {selectedProject.location}, Kenya
                  </p>
                </div>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                  <div className="w-24 h-24 bg-muted/50 rounded-[2rem] flex items-center justify-center animate-pulse">
                    <Package className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-muted-foreground">No materials added.</p>
                    <p className="text-xs text-muted-foreground/60 max-w-[200px]">Start by adding foundation materials or a Smart Set.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Phase Groups (Simulated) */}
                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">FOUNDATION PHASE</h5>
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="bg-white p-5 rounded-3xl space-y-5 border border-[#EEE] shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-muted">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span>{item.supplier}</span>
                                {item.verified && <ShieldCheck className="h-2.5 w-2.5 text-primary" />}
                              </div>
                              <h4 className="font-bold text-base truncate text-[#111]">{item.name}</h4>
                              <p className="font-black text-primary text-lg">KSh {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/30 rounded-2xl p-2 flex items-center justify-between">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-xl hover:bg-white shadow-sm"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-xl hover:bg-white shadow-sm"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="bg-muted/30 rounded-2xl p-2 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground">
                              <Truck className="h-3.5 w-3.5" />
                              2-3 Days ETA
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intelligence Tools */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">INTEL TOOLS</h5>
                    <div className="grid grid-cols-1 gap-3">
                      <Button variant="outline" className="h-14 rounded-2xl border-primary/20 bg-primary/5 text-primary font-bold text-sm gap-2 justify-start px-6">
                        <Zap className="h-4 w-4 fill-primary" />
                        Optimize Cost
                      </Button>
                      <Button variant="outline" className="h-14 rounded-2xl border-[#EEE] text-[#111] font-bold text-sm gap-2 justify-start px-6">
                        <ArrowUpRight className="h-4 w-4" />
                        Request Quotes
                      </Button>
                    </div>
                  </div>

                  {/* AI Advice */}
                  <div className="bg-[#111] rounded-[2rem] p-6 text-white space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary fill-primary" />
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">BUILD ADVISOR</h5>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                      You're entering the <span className="text-primary font-bold">Foundation Phase</span>. 
                      I've auto-filled TMT Steel and Cement bags to meet Nakuru's current soil density requirements.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span className="text-xs font-bold">Escrow Protected Purchase</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border-t space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-sm font-bold">Total Estimate</span>
                  <span className="text-sm font-bold">KSh {totalCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#111]">
                  <span className="text-lg font-black">Escrow Deposit</span>
                  <span className="text-3xl font-black leading-none">KSh {totalCost.toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full h-16 rounded-[1.5rem] bg-[#111] hover:bg-primary text-white text-lg font-black shadow-2xl shadow-black/10 transition-all duration-300">
                Lock Materials in Escrow
              </Button>
              <p className="text-[9px] text-center text-muted-foreground font-bold uppercase tracking-widest">
                Protected by PropertyHub Escrow Protocol
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
