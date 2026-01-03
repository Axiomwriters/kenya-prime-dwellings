import { Heart, Star, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface Property {
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
    verifiedHost?: boolean;
    badgeLabel?: string;
    images?: string[]; // For hover effect
}

interface PropertyCardProps {
    property: Property;
    showTotalPrice?: boolean;
    totalNights?: number;
}

export function PropertyCard({ property, showTotalPrice = false, totalNights = 5 }: PropertyCardProps) {
    const navigate = useNavigate();

    // Calculate total price including taxes (mock calculation)
    const totalPrice = property.price * totalNights;
    const totalPriceWithTax = Math.round(totalPrice * 1.16); // 16% VAT derived

    return (
        <Card
            className="group border-none shadow-none bg-transparent cursor-pointer h-full flex flex-col"
            onClick={() => navigate(`/short-stay/${property.id}`)}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-3 shadow-sm group-hover:shadow-md transition-all duration-300">
                <img
                    src={property.image}
                    alt={property.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />

                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 backdrop-blur-md bg-black/10 transition-all hover:scale-110 z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add favorite logic here
                    }}
                >
                    <Heart className="w-5 h-5" />
                </Button>

                {/* Badges Container */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {/* Guest Favorite / Superhost Badge */}
                    {property.rating >= 4.8 ? (
                        <Badge className="bg-white/95 text-black hover:bg-white shadow-sm backdrop-blur-md flex items-center gap-1.5 px-2.5 py-1 rounded-full border-none">
                            <Trophy className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold text-[11px]">Guest favorite</span>
                        </Badge>
                    ) : property.superhost ? (
                        <Badge className="bg-white/95 text-black hover:bg-white shadow-sm backdrop-blur-md px-2.5 py-1 rounded-full border-none flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            <span className="font-semibold text-[11px]">Superhost</span>
                        </Badge>
                    ) : null}

                    {/* Value / Deal Badges */}
                    {property.badgeLabel && (
                        <Badge variant="secondary" className="w-fit bg-emerald-500/90 text-white hover:bg-emerald-600 border-none shadow-sm backdrop-blur-md px-2.5 py-0.5 rounded-full">
                            <span className="font-semibold text-[10px] uppercase tracking-wide">{property.badgeLabel}</span>
                        </Badge>
                    )}
                </div>

                {/* Bottom Image Label */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <Badge variant="outline" className="bg-black/40 text-white border-none backdrop-blur-md text-[10px] font-medium px-2 py-0.5">
                        {property.type}
                    </Badge>
                </div>
            </div>

            <div className="space-y-1 flex-1 px-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                            <h3 className="font-bold truncate text-[15px] text-foreground leading-tight">{property.location}</h3>
                            {property.verifiedHost && (
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" aria-label="Verified Host" />
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm truncate leading-snug">{property.title}</p>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-black text-black" />
                        <span className="font-semibold text-sm">{property.rating}</span>
                        <span className="text-muted-foreground text-xs">({property.reviews})</span>
                    </div>
                </div>

                <div className="pt-1 flex flex-col">
                    {/* Pricing Section */}
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-lg leading-none">
                            KSh {showTotalPrice ? totalPriceWithTax.toLocaleString() : property.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground font-normal">
                            {showTotalPrice ? "total" : "/ night"}
                        </span>
                    </div>

                    {showTotalPrice && (
                        <p className="text-xs text-muted-foreground underline decoration-dotted mt-0.5 max-w-full truncate">
                            Includes taxes & fees • {totalNights} nights
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}

