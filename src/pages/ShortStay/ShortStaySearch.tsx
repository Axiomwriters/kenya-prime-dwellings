import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Map, List, Search } from "lucide-react";
import { LocationCarousel } from "@/components/short-stay/LocationCarousel";

// Enhanced Mock Data
const generateProperties = (count: number, location: string, type: string) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: Math.random(),
        title: `${type} in ${location} - Unit ${i + 1}`,
        location: location,
        price: Math.floor(Math.random() * 20000) + 3000,
        rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
        reviews: Math.floor(Math.random() * 300) + 10,
        image: `https://images.unsplash.com/photo-${[
            "1502672260266-1c1ef2d93688",
            "1522708323590-d24dbb6b0267",
            "1613490493576-7fde63acd811",
            "1499793983690-e29da59ef1c2",
            "1520250497591-112f2f40a3f4",
            "1493246507139-91e8fad9978e",
            "1512917774080-9991f1c4c750",
            "1600596542815-a6df4db0dbd6",
            "1600585154340-be6161a56a0c",
            "1580587771525-78b9dba3b91d"
        ][i % 10]}?w=800&auto=format&fit=crop&q=60`,
        type: type,
        beds: Math.floor(Math.random() * 4) + 1,
        superhost: Math.random() > 0.5,
    }));
};

const mombasaProperties = generateProperties(8, "Mombasa", "Apartment");
const kiambuProperties = generateProperties(8, "Kiambu", "Villa");
const nakuruProperties = generateProperties(8, "Nakuru", "Condo");
const kilifiProperties = generateProperties(8, "Kilifi", "Beach House");
const kwaleProperties = generateProperties(8, "Kwale", "Cottage");
const capeTownProperties = generateProperties(8, "Cape Town", "Luxury Suite");
const machakosProperties = generateProperties(8, "Machakos", "Bungalow");
const laikipiaProperties = generateProperties(8, "Laikipia", "Safari Lodge");

const categories = [
    { name: "Amazing Pools", icon: "🏊" },
    { name: "Beachfront", icon: "🏖️" },
    { name: "Cabins", icon: "🏡" },
    { name: "OMG!", icon: "🛸" },
    { name: "Trending", icon: "🔥" },
    { name: "Luxe", icon: "💎" },
    { name: "Castles", icon: "🏰" },
    { name: "Camping", icon: "⛺" },
    { name: "Farms", icon: "🚜" },
    { name: "Tiny Homes", icon: "🏠" },
];

export default function ShortStaySearch() {
    const [view, setView] = useState<"grid" | "map">("grid");

    return (
        <div className="container py-6 space-y-8 animate-fade-in">
            {/* Categories Bar */}
            <div className="sticky top-[64px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b md:border-none">
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {categories.map((cat) => (
                        <button key={cat.name} className="flex flex-col items-center gap-2 min-w-[64px] opacity-70 hover:opacity-100 transition-opacity group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <span className="text-xs font-medium whitespace-nowrap border-b-2 border-transparent group-hover:border-primary pb-1">{cat.name}</span>
                        </button>
                    ))}
                </div>
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

            {/* Content Sections */}
            <div className="space-y-8">
                <LocationCarousel
                    title="Popular homes in Mombasa"
                    properties={mombasaProperties}
                />
                <LocationCarousel
                    title="Available in Kiambu this weekend"
                    properties={kiambuProperties}
                />
                <LocationCarousel
                    title="Stay in Nakuru County"
                    properties={nakuruProperties}
                />
                <LocationCarousel
                    title="Available in Kilifi County this weekend"
                    properties={kilifiProperties}
                />
                <LocationCarousel
                    title="Homes in Kwale County"
                    properties={kwaleProperties}
                />
                <LocationCarousel
                    title="Places to stay in Cape Town"
                    properties={capeTownProperties}
                />
                <LocationCarousel
                    title="Check out homes in Machakos County"
                    properties={machakosProperties}
                />
                <LocationCarousel
                    title="Popular homes in Laikipia"
                    properties={laikipiaProperties}
                />
            </div>

            <div className="flex justify-center mt-12 mb-8">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Continue exploring short stays</h3>
                    <Button size="lg" className="rounded-full px-8">Show more</Button>
                </div>
            </div>
        </div>
    );
}
