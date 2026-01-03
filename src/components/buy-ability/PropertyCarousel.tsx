import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard, Property } from "./PropertyCard";

interface PropertyCarouselProps {
    properties: Property[];
    onViewProperty: (id: string) => void;
    onSeeLenders: () => void;
}

export function PropertyCarousel({ properties, onViewProperty, onSeeLenders }: PropertyCarouselProps) {
    const [activeTab, setActiveTab] = useState<"House" | "Apartment">("House");

    // Calculate counts
    const houseCount = properties.filter(p => p.type === "House").length;
    const aptCount = properties.filter(p => p.type === "Apartment").length;

    const filteredProperties = properties.filter(p => p.type === activeTab);

    return (
        <div className="space-y-3 py-1 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">Handpicked homes you can afford today</h3>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
                    <TabsList className="h-7 bg-muted/60 p-0.5">
                        <TabsTrigger value="House" className="text-[10px] px-2.5 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
                            Houses ({houseCount})
                        </TabsTrigger>
                        <TabsTrigger value="Apartment" className="text-[10px] px-2.5 h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">
                            Apartments ({aptCount})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {filteredProperties.map((property) => (
                        <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                            <PropertyCard
                                property={property}
                                onViewProperty={onViewProperty}
                                onSeeLenders={onSeeLenders}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="-left-2 h-7 w-7" />
                    <CarouselNext className="-right-2 h-7 w-7" />
                </div>
            </Carousel>
        </div>
    );
}
