import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "./PropertyCard";

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

interface LocationCarouselProps {
    title: string;
    subtitle?: string;
    properties: Property[];
}

export function LocationCarousel({ title, subtitle, properties }: LocationCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Adjust scroll amount as needed
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

    return (
        <div className="py-6 space-y-4">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>
                <div className="flex gap-2">
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

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:gap-6"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {properties.map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-[calc(100vw-3rem)] md:w-[300px] lg:w-[320px] snap-start">
                        <PropertyCard property={property} />
                    </div>
                ))}
            </div>
        </div>
    );
}
