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
            className="group border-none shadow-none bg-transparent cursor-pointer h-full flex flex-col"
            onClick={() => navigate(`/short-stay/${property.id}`)}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted mb-3">
                <img
                    src={property.image}
                    alt={property.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 text-white hover:bg-white/20 hover:text-white rounded-full h-8 w-8 backdrop-blur-sm bg-black/10"
                >
                    <Heart className="w-5 h-5" />
                </Button>
                {property.superhost && (
                    <Badge className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white shadow-sm backdrop-blur-sm">
                        Superhost
                    </Badge>
                )}
                {property.badgeLabel && (
                    <Badge className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white shadow-sm backdrop-blur-sm">
                        {property.badgeLabel}
                    </Badge>
                )}
            </div>
            <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate pr-2 text-base">{property.location}</h3>
                    <div className="flex items-center gap-1 text-sm shrink-0">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span>{property.rating}</span>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-1">{property.title}</p>
                <p className="text-muted-foreground text-sm">Nov 15 - 20</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-semibold text-base">KSh {property.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">night</span>
                </div>
            </div>
        </Card>
    );
}
