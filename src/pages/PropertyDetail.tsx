import { useParams, useNavigate, Link } from "react-router-dom";
import { getAllProperties } from "@/utils/propertyParser";
import { PropertyHeroGallery } from "@/components/property/PropertyHeroGallery";
import { PropertyAgentCard } from "@/components/property/PropertyAgentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimilarProperties } from "@/components/SimilarProperties";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Car,
  School,
  ShoppingBag,
  Stethoscope,
  CheckCircle2
} from "lucide-react";
import { MapComponent } from "@/components/MapComponent";
import { cn } from "@/lib/utils";
import { mockProperties } from "@/data/mockListings";


export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Property Not Found</h2>
          <Button onClick={() => navigate("/properties")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  // Ensure 5 images for gallery
  const galleryImages = [...property.images];
  while (galleryImages.length < 5) {
    galleryImages.push(...property.images);
  }

  // Mock Agent Data (Enhanced)
  const agentData = {
    name: "Sarah Johnson",
    role: "Luxury Homes Specialist",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
    rating: 4.8,
    deals: 24,
    phone: "+254 700 000000",
    email: "sarah@example.com",
    verified: true,
    isOnline: true
  };

  return (
    <div key={id} className="min-h-screen bg-background pb-20">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">

        {/* HERO GALLERY */}
        <PropertyHeroGallery
          images={galleryImages.slice(0, 5)}
          title={property.title}
          location={property.location}
          labels={{ isForSale: property.listingType === 'sale', isLuxury: true }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN (Details) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Title & Price Header */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2 text-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    {property.location}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{property.priceFormatted}</div>
                  <div className="text-sm text-muted-foreground mt-1">Price Negotiable</div>
                </div>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <Badge variant="secondary" className="px-4 py-2 text-base font-medium bg-muted/50 hover:bg-muted border border-border/50">
                  <Bed className="w-5 h-5 mr-2 text-muted-foreground" /> {property.bedrooms} Bedrooms
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base font-medium bg-muted/50 hover:bg-muted border border-border/50">
                  <Bath className="w-5 h-5 mr-2 text-muted-foreground" /> {property.bathrooms} Bathrooms
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base font-medium bg-muted/50 hover:bg-muted border border-border/50">
                  <Ruler className="w-5 h-5 mr-2 text-muted-foreground" /> {property.landSize}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-base font-medium bg-muted/50 hover:bg-muted border border-border/50">
                  <Car className="w-5 h-5 mr-2 text-muted-foreground" /> 2 Parking
                </Badge>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About this property</h2>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                {property.description}
              </div>

              {/* Feature List Grid (Mock) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {["Swimming Pool", "Garden", "Security System", "Backup Generator", "Borehole", "Staff Quarters"].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Map & Highlights */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Location & Nearby</h2>
              <div className="rounded-xl overflow-hidden border border-border h-[400px] relative group">
                <MapComponent location={property.location} className="w-full h-full" />

                {/* Location Highlights Overlay */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-4 rounded-xl shadow-lg border border-border/50 max-w-xs hidden md:block">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Nearby Highlights</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300"><School className="w-4 h-4" /></div>
                      <span><strong>Braeburn School</strong> (5 mins)</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full text-pink-600 dark:text-pink-300"><ShoppingBag className="w-4 h-4" /></div>
                      <span><strong>Lavington Mall</strong> (8 mins)</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-600 dark:text-emerald-300"><Stethoscope className="w-4 h-4" /></div>
                      <span><strong>Nairobi Hospital</strong> (15 mins)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Sticky Agent) */}
          <div className="lg:col-span-4 relative h-full">
            <div className="sticky top-[90px]">
              <PropertyAgentCard agent={agentData} />
            </div>
          </div>

        </div>
      </div>

      {/* Similar Properties */}
      <div className="container mx-auto px-4">
        <SimilarProperties currentProperty={property} maxItems={6} />
      </div>
    </div>
  );
}
