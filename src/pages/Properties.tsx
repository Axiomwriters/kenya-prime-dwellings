import { useState, useMemo, useEffect, useRef } from "react";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { PropertyListingFilters } from "@/components/PropertyListingFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 24;

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [propertyCategory, setPropertyCategory] = useState<"all" | "house" | "land">("all");
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_listings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    return properties.filter((property) => {
      const matchesSearch =
        searchTerm === "" ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesListingType =
        listingType === "all" || property.listing_type === listingType;

      const matchesCategory =
        propertyCategory === "all" || property.category === propertyCategory;

      return matchesSearch && matchesListingType && matchesCategory;
    });
  }, [properties, searchTerm, listingType, propertyCategory]);

  const displayedProperties = filteredProperties.slice(0, displayedItems);
  const hasMore = displayedItems < filteredProperties.length;

  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [searchTerm, listingType, propertyCategory]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore]);

  const handleLoadMore = () => {
    setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      <PropertyListingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        listingType={listingType}
        setListingType={setListingType}
        propertyCategory={propertyCategory}
        setPropertyCategory={setPropertyCategory}
        totalProperties={properties?.length || 0}
        filteredCount={filteredProperties.length}
      />

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">No properties found</h2>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search term
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setListingType("all");
                setPropertyCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProperties.map((property, index) => (
                <div
                  key={property.id}
                  style={{
                    animationDelay: `${(index % ITEMS_PER_PAGE) * 0.05}s`,
                  }}
                >
                  <ListingCard
                    property={{
                      id: property.id,
                      title: property.title,
                      price: property.price,
                      priceFormatted: `KSh ${property.price.toLocaleString()}`,
                      location: property.location,
                      images: property.images || [],
                      propertyUrl: `/properties/${property.id}`,
                      agentName: "Agent", // Can fetch if needed
                      category: property.category as "house" | "land", // Type assertion as ListingCard might have stricter types
                      listingType: property.listing_type,
                      bedrooms: property.bedrooms || 0,
                      bathrooms: property.bathrooms || 0,
                      landSize: property.land_size || undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Load More Properties ({filteredProperties.length - displayedItems} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
