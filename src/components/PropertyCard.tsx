import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Phone, MessageSquare, Eye, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  sqm: number;
  type: "For Sale" | "For Rent";
  isHighGrowth?: boolean;
  status: "sale" | "rent";
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewDetails = () => {
    toast.success(`Opening details for ${property.title}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in ${property.title} located in ${property.location} for ${property.price}. Could you provide more details?`;
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp...");
  };

  const handleCall = () => {
    window.open('tel:+254700000000');
    toast.success("Initiating call...");
  };

  const handleChat = () => {
    toast.success("AI Chat Assistant coming soon!");
  };

  const handleLocationClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location + ", Nairobi, Kenya")}`;
    window.open(googleMapsUrl, '_blank');
    toast.success("Opening location in Google Maps...");
  };

  return (
    <Card className="group relative overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in hover:scale-[1.02] border-border/50">
      {/* Property Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <div className={`aspect-[4/3] bg-muted transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={property.image}
          alt={property.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isHighGrowth && (
            <Badge className="bg-success text-success-foreground hover:bg-success/90 px-2 py-1 text-xs font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              High Growth Area
            </Badge>
          )}
          <Badge 
            className={`px-2 py-1 text-xs font-medium ${
              property.status === "sale" 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            }`}
          >
            {property.type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Property Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-xl font-bold text-primary">{property.price}</p>
          <button
            onClick={handleLocationClick}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm group/location"
          >
            <MapPin className="w-4 h-4 group-hover/location:animate-bounce-gentle" />
            {property.location}
          </button>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.sqm} sqm</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleViewDetails}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 shadow-button"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button 
            onClick={handleWhatsApp}
            className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground transition-all duration-200 hover:scale-105 shadow-button"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={handleCall}
            className="transition-all duration-200 hover:scale-105 border-primary/20 hover:border-primary hover:bg-primary/5"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button 
            onClick={handleChat}
            className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-200 hover:scale-105 shadow-button"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}