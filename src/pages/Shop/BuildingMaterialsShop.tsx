import { useState } from "react";
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
  AlertTriangle
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
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Mock Data
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

const PROJECTS = [
  { id: "p1", name: "3-Bedroom Maisonette – Nakuru", type: "Maisonette", size: 150 },
  { id: "p2", name: "Modern Studio – Kilimani", type: "Apartment", size: 45 },
];

const PRODUCTS = [
  {
    id: "1",
    name: "Bamburi Tembo Cement",
    spec: "50kg Bag, Type 32.5N",
    price: 950,
    rating: 4.8,
    coverage: ["Nairobi", "Kiambu", "Nakuru"],
    stock: "In Stock",
    category: "Cement & Aggregates",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 220
  },
  {
    id: "2",
    name: "TMT Steel Bars",
    spec: "12mm High-Strength",
    price: 1450,
    rating: 4.9,
    coverage: ["All Counties"],
    stock: "Low Stock",
    category: "Steel & Metal",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 45
  },
  {
    id: "3",
    name: "Clay Roof Tiles",
    spec: "Standard Red, Interlocking",
    price: 85,
    rating: 4.7,
    coverage: ["Nairobi", "Machakos"],
    stock: "In Stock",
    category: "Roofing",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    estimateNeeded: 1200
  }
];

export default function BuildingMaterialsShop() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = activeCategory === "All Materials" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const addToProject = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev;
      return [...prev, { ...product, quantity: product.estimateNeeded }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">Building Materials Shop</h1>
            <p className="text-xs text-muted-foreground">Powered by Chuma Mart AI</p>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-6 px-4 md:px-8">
        {/* Above the Fold / Project Context */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Build smarter.</h2>
              <p className="text-muted-foreground text-lg">Buy exactly what your project needs.</p>
            </div>
            
            <div className="w-full md:w-[320px] space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Project</label>
              <Select defaultValue={selectedProject.id} onValueChange={(val) => setSelectedProject(PROJECTS.find(p => p.id === val)!)}>
                <SelectTrigger className="w-full bg-muted/30 border-none h-12">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECTS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sticky Category Nav */}
        <div className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-background border-b mb-8 overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-6">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "text-sm font-medium transition-all relative pb-2",
                    activeCategory === category 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category}
                  {activeCategory === category && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1" />
                  )}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.spec}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xl font-bold">KSh {product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Per Unit</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none font-medium">
                    {product.stock}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.coverage.slice(0, 2).map(c => (
                    <Badge key={c} variant="outline" className="text-[10px] py-0">{c}</Badge>
                  ))}
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => addToProject(product)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-medium gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Project
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Slide-in Project Cart */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pr-6">
            <SheetTitle className="text-2xl font-bold">Project Cart</SheetTitle>
            <SheetDescription className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {selectedProject.name}
              </Badge>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No materials added yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-muted/30 p-4 rounded-2xl space-y-4 border border-border/50">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{item.spec}</p>
                          <p className="font-bold text-primary">KSh {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="bg-background/80 rounded-xl p-3 flex items-center justify-between border">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-bold w-12 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                          <Info className="h-3.5 w-3.5 text-primary" />
                          Auto-estimated
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] px-1">
                        <span className="text-muted-foreground">Delivery Timeline:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          2-3 Days
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Advisor Section */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">AI Material Advisor</h5>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Based on your <span className="font-semibold">{selectedProject.type}</span> project, 
                    your current material set covers the <span className="font-semibold">Superstructure</span> phase.
                  </p>
                  <div className="pt-1">
                    <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold">
                      Why this amount?
                    </Button>
                  </div>
                </div>

                {/* Warnings */}
                <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-tight">
                    TMT Steel Bars are in high demand. Secure stock now to prevent site delays.
                  </p>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Project Subtotal</span>
                <span className="text-xl font-bold">KSh {totalCost.toLocaleString()}</span>
              </div>
              <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
                Proceed to Project Phases
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Prices include VAT. Delivery calculated at checkout based on site location.
              </p>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
