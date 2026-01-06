import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Bed, Bath, ArrowRight, MessageSquare, Home, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { ActionModal } from "./ActionModal";

export const HandpickedProperties = ({ maxPrice = 0 }: { maxPrice?: number }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'covered' | 'stretch'; property: any | null }>({
        isOpen: false,
        type: 'covered',
        property: null
    });

    // Mock data with varying prices
    const properties = [
        {
            id: 1,
            title: "Modern Family Home in Karen",
            location: "Karen, Nairobi",
            price: 45000000,
            monthly: 225000,
            beds: 4,
            baths: 4,
            sqft: 3500,
            image: "https://images.unsplash.com/photo-1600596542815-2250c385e311?auto=format&fit=crop&q=80&w=800",
            type: "House"
        },
        {
            id: 5,
            title: "Starter Studio in Membley",
            location: "Membley, Ruiru",
            price: 3200000,
            monthly: 18000,
            beds: 1,
            baths: 1,
            sqft: 450,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
            type: "Studio"
        },
        {
            id: 6,
            title: "Serviced Plot in Joska",
            location: "Joska, Kangundo Rd",
            price: 1500000,
            monthly: 0,
            beds: 0,
            baths: 0,
            sqft: 4000,
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
            type: "Land"
        },
        {
            id: 7,
            title: "2BR Apartment in Kitengela",
            location: "Kitengela, Kajiado",
            price: 4800000,
            monthly: 35000,
            beds: 2,
            baths: 2,
            sqft: 900,
            image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
            type: "Apartment"
        },
        {
            id: 2,
            title: "Exquisite Villa in Runda",
            location: "Runda, Nairobi",
            price: 55000000,
            monthly: 275000,
            beds: 5,
            baths: 5,
            sqft: 4200,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
            type: "House"
        },
        {
            id: 3,
            title: "Luxury Apartment in Kilimani",
            location: "Kilimani, Nairobi",
            price: 18000000,
            monthly: 120000,
            beds: 3,
            baths: 2,
            sqft: 1800,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
            type: "Apartment"
        },
        {
            id: 4,
            title: "Cozy Townhouse in Lavington",
            location: "Lavington, Nairobi",
            price: 35000000,
            monthly: 180000,
            beds: 4,
            baths: 3,
            sqft: 2200,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
            type: "Townhouse"
        }
    ];

    // Filter properties around the user's budget range (e.g. up to 120% of budget to show aspirational options too, but highlight appropriately)
    const affordableProperties = properties.map(p => ({
        ...p,
        isAffordable: p.price <= maxPrice,
        isStretch: p.price > maxPrice && p.price <= maxPrice * 1.2
    })).filter(p => p.isAffordable || p.isStretch)
        .sort((a, b) => a.price - b.price); // Show cheapest first

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // More than regular card width
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (affordableProperties.length === 0) {
        return (
            <Card className="bg-slate-950 text-white border-slate-800">
                <CardContent className="p-6 text-center text-slate-400">
                    <Home className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Adjust your inputs to see homes in your budget range.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-slate-950 text-white border-slate-800 overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-slate-100">
                        Handpicked homes you can afford today
                    </CardTitle>
                    <div className="flex gap-1">
                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer">
                            {affordableProperties.length} Properties
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 px-2">
                {/* Responsive container with Carousel controls */}
                <div className="relative group/carousel">
                    {/* Left Scroll Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full h-8 w-8 opacity-0 group-hover/carousel:opacity-100 transition-opacity border border-white/10 hidden md:flex"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Scrollable Area */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-smooth p-1"
                    >
                        {affordableProperties.map((property) => (
                            <div key={property.id} className="min-w-[280px] w-[85%] md:w-[280px] flex-shrink-0 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group relative snap-center shadow-lg hover:shadow-emerald-900/10 transition-all duration-300">
                                {/* Image & Badges */}
                                <div className="h-40 relative overflow-hidden">
                                    <img
                                        src={property.image}
                                        alt={property.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-2 pr-2">
                                        <Badge className="bg-slate-900/80 backdrop-blur text-white border-none">{property.type}</Badge>
                                        {property.isAffordable ? (
                                            <Badge className="bg-emerald-500/90 text-white border-none shadow-sm">Matches budget</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="bg-amber-600/90 text-white border-none shadow-sm">Stretch</Badge>
                                        )}
                                    </div>

                                    {/* Price Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-10">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Valuation</p>
                                                <p className="font-bold text-white shadow-sm text-lg leading-tight">{formatCurrency(property.price)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-emerald-400 font-medium bg-emerald-900/30 px-1.5 py-0.5 rounded">
                                                    ~{Math.round(property.monthly / 1000)}k/mo
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-3 space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-slate-100 truncate text-sm">{property.title}</h4>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/50" />
                                            {property.location}
                                        </p>
                                    </div>

                                    <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-3 px-1">
                                        <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-slate-500" /> {property.beds}</div>
                                        <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-slate-500" /> {property.baths}</div>
                                        <div className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5 text-slate-500" /> {property.sqft} sqft</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-8 text-xs w-full"
                                            onClick={() => navigate(`/properties/${property.id}`)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs border-none w-full shadow-emerald-900/20 shadow-lg"
                                            onClick={() => setModalState({ isOpen: true, type: property.isAffordable ? 'covered' : 'stretch', property })}
                                        >
                                            {property.isAffordable ? 'Fully Covered' : 'Get Qualified'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* View All Card */}
                        <div className="min-w-[100px] flex items-center justify-center">
                            <Button
                                variant="ghost"
                                className="flex-col gap-2 h-auto py-8 text-slate-400 hover:text-emerald-400 hover:bg-slate-900/50"
                                onClick={() => navigate('/properties')}
                            >
                                <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                                <span className="text-xs">View All</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Scroll Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full h-8 w-8 opacity-0 group-hover/carousel:opacity-100 transition-opacity border border-white/10 hidden md:flex"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="bg-slate-900/50 border-t border-slate-800 p-4 block">
                <p className="text-center text-xs text-slate-400 uppercase tracking-widest mb-4 font-semibold">
                    What's your smartest next move?
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white group">
                        <Home className="w-4 h-4 mr-2 group-hover:text-emerald-500 transition-colors" /> View More Homes
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <MessageSquare className="w-4 h-4 mr-2" /> Talk to Advisor
                    </Button>
                </div>
            </CardFooter>

            <ActionModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                type={modalState.type}
                property={modalState.property}
            />
        </Card>
    );
};
