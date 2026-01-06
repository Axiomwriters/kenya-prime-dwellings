
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Star, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const ActiveAdvertCard = () => {
    const [activeTab, setActiveTab] = useState("listings");

    const promoListings = [
        {
            id: 1,
            title: "Penthouse with Ocean View",
            location: "Nyali, Mombasa",
            price: "KSh 28M",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=300",
            tag: "Hot Deal"
        },
        {
            id: 2,
            title: "Luxury Studio Apartment",
            location: "Kilimani, Nairobi",
            price: "KSh 6.5M",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300",
            tag: "New"
        }
    ];

    const promoPros = [
        {
            id: 1,
            name: "Elite Valuers Ltd",
            role: "Certified Valuer",
            rating: 4.9,
            reviews: 120,
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            role: "Mortgage Broker",
            rating: 5.0,
            reviews: 85,
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
        }
    ];

    return (
        <div className="relative group overflow-hidden rounded-xl border border-white/20 dark:border-white/10 shadow-2xl w-full max-w-full">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-black/40 dark:to-black/10 backdrop-blur-md z-0" />

            {/* Dynamic Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-all duration-700" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/50 transition-all duration-700" />

            <div className="relative z-10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/20 rounded-lg">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                        <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
                            Premium Picks
                        </h3>
                    </div>
                    <Badge variant="outline" className="animate-shimmer bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-500 dark:text-slate-400 border-slate-800">
                        Sponsored
                    </Badge>
                </div>

                <Tabs defaultValue="listings" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                        <TabsTrigger value="listings" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-black/50 data-[state=active]:shadow-sm">Properties</TabsTrigger>
                        <TabsTrigger value="pros" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-black/50 data-[state=active]:shadow-sm">Professionals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="listings" className="mt-4 space-y-3">
                        {promoListings.map((item) => (
                            <div key={item.id} className="group/item flex gap-3 p-2 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 transition-colors cursor-pointer border border-transparent hover:border-white/20 dark:hover:border-white/10">
                                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 relative">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-1 left-1 text-[10px] bg-red-500 text-white px-1.5 rounded font-bold">{item.tag}</div>
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <h4 className="text-sm font-semibold leading-tight group-hover/item:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-xs text-muted-foreground">{item.location}</p>
                                    <p className="text-sm font-bold text-primary mt-1">{item.price}</p>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                        <Button variant="secondary" className="w-full mt-2 bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70">
                            View All Deals
                        </Button>
                    </TabsContent>

                    <TabsContent value="pros" className="mt-4 space-y-3">
                        {promoPros.map((item) => (
                            <div key={item.id} className="group/item flex gap-3 p-2 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 transition-colors cursor-pointer border border-transparent hover:border-white/20 dark:hover:border-white/10">
                                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <div className="flex items-center gap-1">
                                        <h4 className="text-sm font-semibold leading-tight">{item.name}</h4>
                                        <ShieldCheck className="w-3 h-3 text-blue-500" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.role}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-medium">{item.rating}</span>
                                        <span className="text-[10px] text-muted-foreground">({item.reviews})</span>
                                    </div>
                                </div>
                                <Button size="sm" className="h-7 text-xs bg-primary/90 hover:bg-primary">Connect</Button>
                            </div>
                        ))}
                        <Button variant="secondary" className="w-full mt-2 bg-white/50 dark:bg-black/50 hover:bg-white/70 dark:hover:bg-black/70">
                            Find Experts
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
