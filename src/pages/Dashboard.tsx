import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { StatsSection } from "@/components/StatsSection";
import { BestAgentsSection } from "@/components/BestAgentsSection";
import { BestLocationsSection } from "@/components/BestLocationsSection";
import { BuyAbilitySection } from "@/components/BuyAbilitySection";
import { LandServicesSection } from "@/components/LandServicesSection";
import { NewsBlogSection } from "@/components/NewsBlogSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Home, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { mockProperties } from "@/data/mockListings";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeType, setActiveType] = useState("all");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["dashboard-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_listings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Combine Supabase data with mock data
      return [...(data || []), ...mockProperties];
    },
  });

  // Filter properties based on search term, status filter, and type filter
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    let filtered = properties;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.location.toLowerCase().includes(term) ||
          property.category.toLowerCase().includes(term) ||
          property.listing_type.toLowerCase().includes(term)
      );
    }

    // Filter by status (sale/rent/short_stay)
    if (activeFilter !== "all") {
      filtered = filtered.filter((property) => property.listing_type === activeFilter);
    }

    // Filter by property type
    if (activeType !== "all") {
      filtered = filtered.filter((property) => property.category === activeType);
    }

    return filtered;
  }, [properties, searchTerm, activeFilter, activeType]);

  const growthCount = filteredProperties.length; // Simplified for now

  const PropertyCardWrapper = ({ property, index }: { property: any; index: number }) => {
    // Handle image display: check property.image (mock) or property.images[0] (Supabase)
    const displayImage = property.image || (property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg");

    return (
      <div
        className="animate-scale-in w-full"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <PropertyCard
          property={{
            id: property.id,
            title: property.title,
            price: `KSh ${property.price.toLocaleString()}`,
            location: property.location,
            image: displayImage,
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            sqm: property.land_size ? (typeof property.land_size === 'string' ? parseInt(property.land_size) : property.land_size) : 0,
            type: property.listing_type === "sale" ? "For Sale" : property.listing_type === "rent" ? "For Rent" : "Short Stay",
            status: property.listing_type,
            isHighGrowth: false, // Not in DB yet
            propertyType: property.category
          }}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 w-full">
      <div className="min-h-screen bg-background animate-fade-in">

        <StatsSection />

        <main className="max-w-7xl mx-auto py-8 px-[20px]">
          <div className="space-y-8">
            {/* Filters */}
            <PropertyFilters
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              activeType={activeType}
              setActiveType={setActiveType}
              propertyCount={filteredProperties.length}
              growthCount={growthCount}
            />

            {/* Properties Carousel */}
            <div className="relative">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                    slidesToScroll: 1,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {filteredProperties.map((property, index) => (
                      <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                        <PropertyCardWrapper property={property} index={index} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
                  <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
                </Carousel>
              )}
            </div>

            {/* No Results */}
            {!isLoading && filteredProperties.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters to find more properties.
                </p>
              </div>
            )}
          </div>
        </main>

        <BestAgentsSection />
        <BestLocationsSection />
        <BuyAbilitySection />
        <LandServicesSection />
        <FAQSection />
        <NewsBlogSection />
        <Footer />

      </div>
    </div>
  );
}