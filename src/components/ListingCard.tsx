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

interface ListingCardProps {
  property: Property;
}

export function ListingCard({ property }: ListingCardProps) {
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
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-card/50 backdrop-blur-sm border border-border/50">
      <PropertyImageCarousel images={property.images} title={property.title} />

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">
            {property.title}
          </h3>
          <Badge className={`${listingTypeColor} text-white shrink-0`}>
            {listingTypeText}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4 shrink-0" />
          <span className="truncate">{property.agentName}</span>
        </div>

        <p className="text-2xl font-bold text-primary">
          {property.priceFormatted}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link to={`/properties/${property.id}`} className="w-full">
            <Button className="w-full" variant="default">
              <ExternalLink className="w-4 h-4" />
              View Details
            </Button>
          </Link>
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleCall}
            variant="outline"
            className="w-full"
          >
            <Phone className="w-4 h-4" />
            Call
          </Button>
          <Button
            onClick={handleAIChat}
            variant="outline"
            className="w-full"
          >
            <MessageSquare className="w-4 h-4" />
            AI Chat
          </Button>
        </div>
      </div>
    </Card>
  );
}
