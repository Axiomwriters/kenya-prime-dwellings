import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LocationCarousel } from "@/components/short-stay/LocationCarousel";
import { DynamicCountyCarousel } from "@/components/short-stay/DynamicCountyCarousel";
import { StaySearchBar } from "@/components/short-stay/StaySearchBar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    SlidersHorizontal,
    ChevronDown,
    MapPin,
    Calendar,
    Users,
    Filter,
    ArrowUpDown,
    Check
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Enhanced Mock Data Generator
const generateProperties = (count: number, location: string, type: string) => {
    return Array.from({ length: count }).map((_, i) => {
        const rating = Math.round((4.0 + Math.random()) * 10) / 10;
        const reviews = Math.floor(Math.random() * 300) + 10;
        const price = Math.floor(Math.random() * 20000) + 3000;
        const superhost = Math.random() > 0.6;

        let badgeLabel = undefined;
        if (price < 5000) badgeLabel = "Great Value";
        else if (rating > 4.8) badgeLabel = "Top Rated";
        else if (reviews > 200) badgeLabel = "Popular";

        return {
            id: Math.random(),
            title: `${type} in ${location} - Unit ${i + 1}`,
            location: location,
            price: price,
            rating: rating,
            reviews: reviews,
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
            superhost: superhost,
            verifiedHost: Math.random() > 0.3,
            badgeLabel: badgeLabel,
        };
    });
};

const mombasaProperties = generateProperties(8, "Mombasa", "Apartment");
const kiambuProperties = generateProperties(8, "Kiambu", "Villa");
const nakuruProperties = generateProperties(8, "Nakuru", "Condo");
const kilifiProperties = generateProperties(8, "Kilifi", "Beach House");
const kwaleProperties = generateProperties(8, "Kwale", "Cottage");
const capeTownProperties = generateProperties(8, "Cape Town", "Luxury Suite");
const machakosProperties = generateProperties(8, "Machakos", "Bungalow");
const laikipiaProperties = generateProperties(8, "Laikipia", "Safari Lodge");

interface SearchFilters {
    location: string;
    checkIn: Date | null;
    checkOut: Date | null;
    adults: number;
    children: number;
    infants: number;
}

type SortOption = "recommended" | "price_low_high" | "rating_high_low" | "solo" | "long_stay";

export default function ShortStaySearch() {
    const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("recommended");
    const [showTotalPrice, setShowTotalPrice] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const handleSearch = (filters: SearchFilters) => {
        setSearchFilters(filters);
    };

    const handleClearFilters = () => {
        setSearchFilters(null);
        setActiveCategory(null);
    };

    // Filter properties based on search criteria
    const filterAndSortProperties = (properties: any[]) => {
        let filtered = properties;

        if (searchFilters) {
            filtered = filtered.filter((property) => {
                // Filter by location
                if (searchFilters.location && !property.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
                    return false;
                }
                // Filter by guest capacity
                const totalGuests = searchFilters.adults + searchFilters.children;
                if (totalGuests > property.beds) {
                    return false;
                }
                return true;
            });
        }

        // Apply additional category filters (Mock logic)
        if (activeCategory) {
            if (activeCategory === "Budget") filtered = filtered.filter(p => p.price < 8000);
            if (activeCategory === "Superhost") filtered = filtered.filter(p => p.superhost);
            if (activeCategory === "Villa") filtered = filtered.filter(p => p.type === "Villa");
        }

        // Sort Logic
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "price_low_high":
                    return a.price - b.price;
                case "rating_high_low":
                    return b.rating - a.rating; // Simple rating sort
                case "solo":
                    // Smallest beds first, then price
                    return a.beds - b.beds || a.price - b.price;
                case "long_stay":
                    // Lower price favored more heavily
                    return a.price - b.price;
                case "recommended":
                default:
                    // Weighted score: (rating * 0.4) + (price_score * 0.3) + (host_quality * 0.3)
                    // Normalizing for demo:
                    const scoreA = (a.rating * 10) + (20000 / a.price * 5) + (a.superhost ? 10 : 0);
                    const scoreB = (b.rating * 10) + (20000 / b.price * 5) + (b.superhost ? 10 : 0);
                    return scoreB - scoreA;
            }
        });
    };

    // Memoize processed lists
    const processedMombasa = useMemo(() => filterAndSortProperties(mombasaProperties), [searchFilters, sortBy, activeCategory, mombasaProperties]);
    const processedKiambu = useMemo(() => filterAndSortProperties(kiambuProperties), [searchFilters, sortBy, activeCategory, kiambuProperties]);
    const processedNakuru = useMemo(() => filterAndSortProperties(nakuruProperties), [searchFilters, sortBy, activeCategory, nakuruProperties]);
    const processedKilifi = useMemo(() => filterAndSortProperties(kilifiProperties), [searchFilters, sortBy, activeCategory, kilifiProperties]);
    const processedKwale = useMemo(() => filterAndSortProperties(kwaleProperties), [searchFilters, sortBy, activeCategory, kwaleProperties]);
    const processedCapeTown = useMemo(() => filterAndSortProperties(capeTownProperties), [searchFilters, sortBy, activeCategory, capeTownProperties]);
    const processedMachakos = useMemo(() => filterAndSortProperties(machakosProperties), [searchFilters, sortBy, activeCategory, machakosProperties]);
    const processedLaikipia = useMemo(() => filterAndSortProperties(laikipiaProperties), [searchFilters, sortBy, activeCategory, laikipiaProperties]);

    const hasActiveFilters = searchFilters !== null || activeCategory !== null;

    const categories = ["All", "Budget", "Superhost", "Villa", "Apartment", "Beachfront", "Pool", "Trending"];

    return (
        <div className="container py-4 space-y-6 animate-fade-in">

            {/* Context Bar & Search Refinement */}
            <div className="sticky top-[70px] z-30 bg-background/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0 border-b">
                {/* Top Row: Search Summary & Sort */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                    {/* Search Context Display */}
                    <div className="flex flex-wrap items-center gap-2 text-sm border rounded-full px-4 py-2 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer w-full md:w-auto">
                        <div className="flex items-center gap-1.5 font-medium border-r pr-3">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="truncate max-w-[100px] md:max-w-none">
                                {searchFilters?.location || "Anywhere"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium border-r pr-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>
                                {searchFilters?.checkIn ? "Nov 15-20" : "Any week"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                            <Users className="w-4 h-4 text-primary" />
                            <span>
                                {(searchFilters?.adults || 0) + (searchFilters?.children || 0) || "Add guests"}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto rounded-full -mr-2">
                            <Filter className="w-3 h-3" />
                        </Button>
                    </div>

                    {/* Controls: Sort & Total Price */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium whitespace-nowrap hidden sm:inline-block">Display total price</span>
                            <Switch
                                checked={showTotalPrice}
                                onCheckedChange={setShowTotalPrice}
                                aria-label="Toggle total price"
                            />
                        </div>

                        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full border-dashed">
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                    <span className="text-xs">
                                        {sortBy === "recommended" && "Recommended"}
                                        {sortBy === "price_low_high" && "Price: Low to High"}
                                        {sortBy === "rating_high_low" && "Rating: High to Low"}
                                        {sortBy === "solo" && "Best for Solo"}
                                        {sortBy === "long_stay" && "Best for Short Stay"}
                                    </span>
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortBy("recommended")}>
                                    Recommended {sortBy === "recommended" && <Check className="ml-auto w-4 h-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("price_low_high")}>
                                    Price: Low to High {sortBy === "price_low_high" && <Check className="ml-auto w-4 h-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("rating_high_low")}>
                                    Rating: High to Low {sortBy === "rating_high_low" && <Check className="ml-auto w-4 h-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortBy("solo")}>
                                    Best for Solo Travelers {sortBy === "solo" && <Check className="ml-auto w-4 h-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy("long_stay")}>
                                    Best for Long Stays {sortBy === "long_stay" && <Check className="ml-auto w-4 h-4" />}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0 mask-fade-right">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat || (cat === "All" && !activeCategory) ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveCategory(cat === "All" ? null : cat)}
                            className={cn(
                                "rounded-full h-8 px-4 text-xs font-medium transition-all shrink-0",
                                activeCategory === cat || (cat === "All" && !activeCategory)
                                    ? "bg-primary text-white shadow-md transform scale-105"
                                    : "bg-background hover:bg-muted border-dashed"
                            )}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-12 pb-16">
                {processedMombasa.length > 0 && (
                    <LocationCarousel
                        title="Popular homes in Mombasa"
                        properties={processedMombasa}
                        showTotalPrice={showTotalPrice}
                    />
                )}
                {processedKiambu.length > 0 && (
                    <LocationCarousel
                        title="Available in Kiambu this weekend"
                        properties={processedKiambu}
                        showTotalPrice={showTotalPrice}
                    />
                )}
                {processedNakuru.length > 0 && (
                    <LocationCarousel
                        title="Stay in Nakuru County"
                        properties={processedNakuru}
                        showTotalPrice={showTotalPrice}
                    />
                )}

                {/* Featured Section Break */}
                {processedCapeTown.length > 0 && (
                    <div className="py-8 bg-muted/30 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-3xl">
                        <DynamicCountyCarousel
                            properties={processedCapeTown}
                            showTotalPrice={showTotalPrice}
                        />
                    </div>
                )}

                {processedKilifi.length > 0 && (
                    <LocationCarousel
                        title="Available in Kilifi County this weekend"
                        properties={processedKilifi}
                        showTotalPrice={showTotalPrice}
                    />
                )}
                {processedKwale.length > 0 && (
                    <LocationCarousel
                        title="Homes in Kwale County"
                        properties={processedKwale}
                        showTotalPrice={showTotalPrice}
                    />
                )}
                {processedMachakos.length > 0 && (
                    <LocationCarousel
                        title="Check out homes in Machakos County"
                        properties={processedMachakos}
                        showTotalPrice={showTotalPrice}
                    />
                )}
                {processedLaikipia.length > 0 && (
                    <LocationCarousel
                        title="Popular homes in Laikipia"
                        properties={processedLaikipia}
                        showTotalPrice={showTotalPrice}
                    />
                )}

                {/* No Results Message */}
                {hasActiveFilters &&
                    processedMombasa.length === 0 &&
                    processedKiambu.length === 0 &&
                    processedNakuru.length === 0 &&
                    processedKilifi.length === 0 &&
                    processedKwale.length === 0 &&
                    processedCapeTown.length === 0 &&
                    processedMachakos.length === 0 &&
                    processedLaikipia.length === 0 && (
                        <div className="text-center py-24 bg-muted/20 rounded-xl">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No properties found</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                We couldn't find any properties matching your current filters. Try adjusting your search criteria.
                            </p>
                            <Button onClick={handleClearFilters} size="lg" className="rounded-full">
                                Clear all filters
                            </Button>
                        </div>
                    )}
            </div>

            <div className="flex justify-center mt-12 mb-8">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Continue exploring short stays</h3>
                    <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        Show more
                    </Button>
                </div>
            </div>
        </div>
    );
}
