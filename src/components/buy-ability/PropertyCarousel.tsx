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

    const filteredProperties = properties.filter(p => p.type === activeTab);

    return (
        <div className="space-y-2 py-1 px-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Properties within your budget</h3>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-auto">
                    <TabsList className="h-6 bg-muted/50 p-0.5">
                        <TabsTrigger value="House" className="text-[10px] px-2 h-5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Houses</TabsTrigger>
                        <TabsTrigger value="Apartment" className="text-[10px] px-2 h-5 data-[state=active]:bg-background data-[state=active]:shadow-sm">Apartments</TabsTrigger>
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
                    <CarouselPrevious className="-left-2" />
                    <CarouselNext className="-right-2" />
                </div>
            </Carousel>
        </div>
    );
}
