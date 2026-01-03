import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Bed, Bath, Square } from "lucide-react";

export interface Property {
    id: string;
    type: "House" | "Apartment";
    image: string;
    valuation: number;
    location: string;
    beds: number;
    baths: number;
    sqft: number;
    title: string;
}

interface PropertyCardProps {
    property: Property;
    onViewProperty: (id: string) => void;
    onSeeLenders: () => void;
}

export function PropertyCard({ property, onViewProperty, onSeeLenders }: PropertyCardProps) {
    // Mock monthly payment calc (just for display)
    const estMonthly = Math.round(property.valuation * 0.005);

    return (
        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-28 overflow-hidden shrink-0">
                <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-none text-[9px] px-1.5 py-0 h-4 font-normal">
                        {property.type}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-md bg-emerald-500/90 text-white border-none text-[9px] px-1.5 py-0 h-4 font-medium shadow-sm">
                        Matches budget
                    </Badge>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <div className="backdrop-blur-md bg-black/60 text-white p-1.5 rounded border border-white/10 flex justify-between items-end">
                        <div>
                            <div className="text-[9px] text-gray-300 leading-none mb-0.5">Valuation</div>
                            <div className="text-xs font-bold leading-none">
                                KSh {property.valuation.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-[9px] font-medium text-emerald-400 flex items-center gap-0.5 bg-emerald-950/30 px-1 rounded">
                            <span className="text-[8px] text-gray-400">Est.</span> ~{estMonthly.toLocaleString()}/mo
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-2.5 flex flex-col flex-grow space-y-2">
                <div>
                    <h3 className="font-semibold text-sm line-clamp-1 leading-tight">{property.title}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="line-clamp-1">{property.location}</span>
                    </div>
                </div>

                {/* Features */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t pt-2 mt-auto">
                    <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="w-3 h-3" />
                        <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Square className="w-3 h-3" />
                        <span>{property.sqft} sqft</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-[10px] h-7 px-0 bg-transparent"
                        onClick={() => onViewProperty(property.id)}
                    >
                        View
                    </Button>
                    <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] h-7 px-0 transition-colors"
                        onClick={onSeeLenders}
                    >
                        3 lenders available
                    </Button>
                </div>
            </div>
        </div>
    );
}
