import { useState, useEffect } from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "./PropertyCard";
import { cn } from "@/lib/utils";

const kenyaCounties = [
    "Nairobi", "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi",
    "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga",
    "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia",
    "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru",
    "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma",
    "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira"
];

interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    type: string;
    beds: number;
    superhost: boolean;
    badgeLabel?: string;
}

interface DynamicCountyCarouselProps {
    properties: Property[];
    showTotalPrice?: boolean;
}

type FilterType = "popular" | "nextMonth" | "future";

export function DynamicCountyCarousel({ properties, showTotalPrice }: DynamicCountyCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentCountyIndex, setCurrentCountyIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>("popular");

    // Animate county text
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);

            setTimeout(() => {
                setCurrentCountyIndex((prev) => (prev + 1) % kenyaCounties.length);
                setIsAnimating(false);
            }, 300);

        }, 3000); // Each county displays for 3 seconds

        return () => clearInterval(interval);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            const newScrollLeft =
                direction === "left"
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        // Reset scroll position when filter changes
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
    };

    // Filter properties based on active filter
    const getFilteredProperties = () => {
        switch (activeFilter) {
            case "popular":
                // Show highest rated properties
                return [...properties].sort((a, b) => b.rating - a.rating);
            case "nextMonth":
                // Show properties (in real app, filter by availability)
                return properties;
            case "future":
                // Show properties for future dates
                return [...properties].reverse();
            default:
                return properties;
        }
    };

    const filteredProperties = getFilteredProperties();

    return (
        <div className="py-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-1">
                <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-baseline gap-2 flex-wrap">
                        <span>Top locations to stay in</span>
                        <span
                            className={`inline-block transition-all duration-500 ease-in-out text-primary ${isAnimating
                                ? 'opacity-0 transform -translate-y-2'
                                : 'opacity-100 transform translate-y-0'
                                }`}
                        >
                            {kenyaCounties[currentCountyIndex]}
                        </span>
                    </h2>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <Button
                            variant={activeFilter === "popular" ? "default" : "outline"}
                            className={cn(
                                "transition-all duration-200",
                                activeFilter === "popular"
                                    ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
                                    : "border-border hover:border-primary hover:bg-primary/5"
                            )}
                            onClick={() => handleFilterChange("popular")}
                        >
                            Popular homes
                        </Button>
                        <Button
                            variant={activeFilter === "nextMonth" ? "default" : "outline"}
                            className={cn(
                                "transition-all duration-200",
                                activeFilter === "nextMonth"
                                    ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
                                    : "border-border hover:border-primary hover:bg-primary/5"
                            )}
                            onClick={() => handleFilterChange("nextMonth")}
                        >
                            Available next month
                        </Button>
                        <Button
                            variant={activeFilter === "future" ? "default" : "outline"}
                            className={cn(
                                "transition-all duration-200",
                                activeFilter === "future"
                                    ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
                                    : "border-border hover:border-primary hover:bg-primary/5"
                            )}
                            onClick={() => handleFilterChange("future")}
                        >
                            Future getaways
                        </Button>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden md:flex gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Properties Carousel */}
            <div
                ref={scrollContainerRef}
                className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 transition-opacity duration-300"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {filteredProperties.map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-[calc(100vw-80px)] md:w-[220px] lg:w-[235px] xl:w-[245px] snap-start">
                        <PropertyCard property={property} showTotalPrice={showTotalPrice} />
                    </div>
                ))}
            </div>
        </div>
    );
}
