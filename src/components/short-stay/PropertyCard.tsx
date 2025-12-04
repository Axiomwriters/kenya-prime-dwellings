import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

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

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className="group border-none shadow-none bg-transparent cursor-pointer h-full flex flex-col transition-transform hover:scale-[1.02] duration-300"
            onClick={() => navigate(`/short-stay/${property.id}`)}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted mb-2 shadow-sm">
                <img
                    src={property.image}
                    alt={property.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:bg-white/20 hover:text-white rounded-full h-7 w-7 backdrop-blur-sm bg-black/10 transition-all hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add favorite logic here
                    }}
                >
                    <Heart className="w-4 h-4" />
                </Button>

                {/* Guest Favorite Badge - All Devices */}
                {property.rating >= 4.8 && (
                    <Badge className="absolute top-2 left-2 bg-white/95 text-black hover:bg-white shadow-md backdrop-blur-sm flex items-center gap-1 px-2 py-1 rounded-full border-none">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        <span className="font-medium text-[10px]">Guest favorite</span>
                    </Badge>
                )}

                {/* Superhost Badge - Fallback if not Guest Favorite */}
                {property.rating < 4.8 && property.superhost && (
                    <Badge className="absolute top-2 left-2 bg-white/95 text-black hover:bg-white shadow-md backdrop-blur-sm px-2 py-1 rounded-full border-none">
                        <span className="font-medium text-[10px]">Superhost</span>
                    </Badge>
                )}

                {/* Custom Badge Label - Fallback */}
                {property.rating < 4.8 && !property.superhost && property.badgeLabel && (
                    <Badge className="absolute top-2 left-2 bg-white/95 text-black hover:bg-white shadow-md backdrop-blur-sm px-2 py-1 rounded-full border-none">
                        <span className="font-medium text-[10px]">{property.badgeLabel}</span>
                    </Badge>
                )}
            </div>
            <div className="space-y-0.5 flex-1">
                <div className="flex justify-between items-start gap-1">
                    <h3 className="font-semibold truncate text-sm md:text-[15px] flex-1">{property.location}</h3>
                    <div className="flex items-center gap-0.5 text-xs shrink-0">
                        <Star className="w-3 h-3 fill-black text-black" />
                        <span className="font-medium">{property.rating}</span>
                    </div>
                </div>
                <p className="text-muted-foreground text-xs line-clamp-1">{property.title}</p>
                <p className="text-muted-foreground text-xs">Nov 15 - 20</p>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="font-semibold text-sm md:text-[15px]">KSh {property.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">night</span>
                </div>
            </div>
        </Card>
    );
}
