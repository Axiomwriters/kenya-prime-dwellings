import { useParams, useNavigate, Link } from "react-router-dom";
import { getAllProperties } from "@/utils/propertyParser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimilarProperties } from "@/components/SimilarProperties";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Ruler,
  ExternalLink,
  User,
} from "lucide-react";
import { MapComponent } from "@/components/MapComponent";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockProperties } from "@/data/mockListings";
import { AgentContactCard } from "@/components/AgentContactCard";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  let property = getAllProperties().find((p) => p.id === id);

  // Fallback to mock data if not found
  if (!property) {
    const mockProperty = mockProperties.find((p) => p.id === id);
    if (mockProperty) {
      // Map mock property to expected structure
      property = {
        id: mockProperty.id,
        title: mockProperty.title,
        price: mockProperty.price,
        priceFormatted: `KSh ${mockProperty.price.toLocaleString()}`,
        location: mockProperty.location,
        description: mockProperty.description,
        images: [mockProperty.image], // Mock data currently has single image
        bedrooms: mockProperty.bedrooms,
        bathrooms: mockProperty.bathrooms,
        landSize: mockProperty.land_size,
        listingType: mockProperty.listing_type,
        category: mockProperty.category.toLowerCase(),
        agentName: "Sarah Johnson", // Default for mock
        agentPhone: "+254 712 345 678",
        propertyUrl: "#",
        dateAdded: new Date(mockProperty.created_at).toLocaleDateString(),
      };
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The property you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/properties")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = property.images[selectedImageIndex] || property.images[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/properties")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <Badge
                className="absolute top-4 right-4"
                variant={property.listingType === "sale" ? "default" : "secondary"}
              >
                For {property.listingType === "sale" ? "Sale" : "Rent"}
              </Badge>
            </div>

            {/* Image Gallery */}
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden bg-muted transition-all",
                      selectedImageIndex === index
                        ? "ring-2 ring-primary"
                        : "hover:opacity-80"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Details */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {property.priceFormatted}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  {property.landSize && (
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{property.landSize}</span>
                    </div>
                  )}
                  <Badge variant="outline" className="text-sm">
                    {property.category === "house" ? "House" : "Land"}
                  </Badge>
                </div>

                {/* Agent Info */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Listed by: {property.agentName}</span>
                  </div>
                </div>

                {/* Original Listing Link */}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => window.open(property.propertyUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original Listing
                </Button>
              </CardContent>
            </Card>

            {/* Map View */}
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-lg">
                <MapComponent location={property.location} className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Agent Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AgentContactCard 
                agentName={property.agentName}
                agentPhone={property.agentPhone}
                propertyTitle={property.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      <div className="container mx-auto px-4">
        <SimilarProperties currentProperty={property} maxItems={6} />
      </div>
    </div>
  );
}
