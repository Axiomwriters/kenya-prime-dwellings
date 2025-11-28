import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, Star, Heart, Wifi, Car, Utensils, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock Data
const properties = [
    {
        id: 1,
        title: "Modern Loft in Westlands",
        location: "Westlands, Nairobi",
        price: 8500,
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
        type: "Entire apartment",
        beds: 2,
        superhost: true,
    },
    {
        id: 2,
        title: "Cozy Studio near CBD",
        location: "Kilimani, Nairobi",
        price: 4500,
        rating: 4.6,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
        type: "Studio",
        beds: 1,
        superhost: false,
    },
    {
        id: 3,
        title: "Luxury Villa in Karen",
        location: "Karen, Nairobi",
        price: 25000,
        rating: 4.9,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
        type: "Entire villa",
        beds: 4,
        superhost: true,
    },
    {
        id: 4,
        title: "Beachfront Condo",
        location: "Nyali, Mombasa",
        price: 12000,
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop&q=60",
        type: "Entire condo",
        beds: 3,
        superhost: true,
    },
    {
        id: 5,
        title: "Treehouse Retreat",
        location: "Watamu",
        price: 15000,
        rating: 4.95,
        reviews: 300,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60",
        type: "Treehouse",
        beds: 2,
        superhost: true,
    },
    {
        id: 6,
        title: "Safari Lodge Tent",
        location: "Maasai Mara",
        price: 35000,
        rating: 5.0,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60",
        type: "Tent",
        beds: 2,
        superhost: true,
    },
];

const categories = [
    { name: "Amazing Pools", icon: "🏊" },
    { name: "Beachfront", icon: "🏖️" },
    { name: "Cabins", icon: "🏡" },
    { name: "OMG!", icon: "🛸" },
    { name: "Trending", icon: "🔥" },
    { name: "Luxe", icon: "💎" },
];

export default function ShortStaySearch() {
    const navigate = useNavigate();
    const [view, setView] = useState<"grid" | "map">("grid");

    return (
        <div className="container py-6 space-y-6 animate-fade-in">
            {/* Categories Bar */}
            <div className="flex items-center gap-8 overflow-x-auto pb-4 no-scrollbar">
                {categories.map((cat) => (
                    <button key={cat.name} className="flex flex-col items-center gap-2 min-w-[64px] opacity-70 hover:opacity-100 transition-opacity group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="text-xs font-medium whitespace-nowrap border-b-2 border-transparent group-hover:border-primary pb-1">{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border rounded-xl p-4 shadow-sm bg-card">
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" className="rounded-full">Price</Button>
                    <Button variant="outline" className="rounded-full">Type of place</Button>
                    <Button variant="outline" className="rounded-full">Amenities</Button>
                    <div className="h-6 w-px bg-border mx-2" />
                    <div className="flex items-center gap-2">
                        <Switch id="instant-book" />
                        <label htmlFor="instant-book" className="text-sm font-medium cursor-pointer">Instant Book</label>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <Button
                        variant={view === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("grid")}
                        className="gap-2"
                    >
                        <List className="w-4 h-4" /> Grid
                    </Button>
                    <Button
                        variant={view === "map" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("map")}
                        className="gap-2"
                    >
                        <Map className="w-4 h-4" /> Map
                    </Button>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties.map((property) => (
                    <Card key={property.id} className="group border-none shadow-none bg-transparent cursor-pointer" onClick={() => navigate(`/short-stay/${property.id}`)}>
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-3">
                            <img
                                src={property.image}
                                alt={property.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            <Button variant="ghost" size="icon" className="absolute top-3 right-3 text-white hover:bg-white/20 hover:text-white rounded-full">
                                <Heart className="w-5 h-5" />
                            </Button>
                            {property.superhost && (
                                <Badge className="absolute top-3 left-3 bg-white text-black hover:bg-white">Superhost</Badge>
                            )}
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold truncate pr-2">{property.location}</h3>
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-3 h-3 fill-primary text-primary" />
                                    <span>{property.rating}</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm">{property.type}</p>
                            <p className="text-muted-foreground text-sm">Nov 15 - 20</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="font-semibold">KSh {property.price.toLocaleString()}</span>
                                <span className="text-sm">night</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Button variant="outline" size="lg">Show more</Button>
            </div>
        </div>
    );
}
