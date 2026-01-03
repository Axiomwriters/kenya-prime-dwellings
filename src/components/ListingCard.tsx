import { Property } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyImageCarousel } from "./PropertyImageCarousel";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  ExternalLink,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";

export interface ListingCardProps {
  property: Property;
  intentTags?: string[]; // e.g., ["High ROI", "Best Value"]
  microData?: {
    icon: React.ElementType;
    label: string;
    value: string;
    tooltip?: string;
  }[];
}

export function ListingCard({ property, intentTags, microData }: ListingCardProps) {
  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in ${property.title} at ${property.location} for ${property.priceFormatted}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = () => {
    toast.info("Contact agent for phone details");
  };

  const handleAIChat = () => {
    toast.info("AI Chat feature coming soon!");
  };

  const listingTypeColor =
    property.listingType === "sale" ? "bg-primary" : "bg-blue-500";
  const listingTypeText =
    property.listingType === "sale" ? "For Sale" : "For Rent";

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-card/50 backdrop-blur-sm border border-border/50 flex flex-col h-full">
      <div className="relative">
        <PropertyImageCarousel images={property.images} title={property.title} />
        {/* Intent Tags Overlay */}
        {intentTags && intentTags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10 pointer-events-none">
            {intentTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-black/60 text-white hover:bg-black/70 backdrop-blur-md border-none text-[10px] font-medium shadow-sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <Badge className={`${listingTypeColor} text-white shrink-0 shadow-sm`}>
            {listingTypeText}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        {/* Micro-Data Section */}
        {microData && microData.length > 0 && (
             <div className="flex flex-wrap gap-x-4 gap-y-2 py-1 border-t border-b border-border/40 my-1">
                {microData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground" title={item.tooltip}>
                        <item.icon className="w-3.5 h-3.5 text-primary/70" />
                        <span className="font-medium text-foreground/80">{item.value}</span>
                        <span className="text-[10px] opacity-70">{item.label}</span>
                    </div>
                ))}
             </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4 shrink-0" />
          <span className="truncate">{property.agentName}</span>
        </div>

        <p className="text-2xl font-bold text-primary">
          {property.priceFormatted}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-auto">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          {property.landSize && (
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{property.landSize}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 mt-2">
          <Link to={`/properties/${property.id}`} className="w-full">
            <Button className="w-full shadow-sm hover:shadow-md transition-all" variant="default">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-sm hover:shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleCall}
            variant="outline"
            className="w-full hover:bg-muted"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            onClick={handleAIChat}
            variant="outline"
            className="w-full hover:bg-muted"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}
