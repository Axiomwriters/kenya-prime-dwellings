
import { useState, useMemo, useEffect, useRef } from "react";
import { ListingCard } from "@/components/ListingCard";
import { ListingCTAcard } from "@/components/ListingCTAcard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, TrendingUp, Wallet, Map, Building } from "lucide-react";
import { PropertyListingFilters } from "@/components/PropertyListingFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 23; // Adjusted to make room for CTA card in a 24-grid layout logic if needed, or just append.

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [propertyCategory, setPropertyCategory] = useState<"all" | "house" | "land" | "commercial">("all");
  const [propertyUseCase, setPropertyUseCase] = useState("All");
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

      // Mock Use-Case Logic (since DB might not have this field yet)
      let matchesUseCase = true;
      if (propertyUseCase !== "All") {
        // Broader mocking based on price/title/category
        const lowerTitle = property.title.toLowerCase();
        const lowerCat = (property.category || "").toLowerCase();

        if (propertyUseCase === "Student Housing" && (property.price < 35000 || lowerTitle.includes("studio") || lowerTitle.includes("hostel"))) matchesUseCase = true;
        else if (propertyUseCase === "Investment" && (property.price < 15000000 || lowerTitle.includes("plot") || lowerCat === 'land')) matchesUseCase = true;
        else if (propertyUseCase === "Mixed-Use" && (lowerCat === 'commercial' || lowerCat === 'land')) matchesUseCase = true;
        else if (propertyUseCase === "Warehouses" && (lowerCat === 'commercial' || lowerTitle.includes("godown"))) matchesUseCase = true;
        else if (propertyUseCase === "Co-working" && (lowerCat === 'commercial' || lowerTitle.includes("office"))) matchesUseCase = true;
        else matchesUseCase = false;
      }

      return matchesSearch && matchesListingType && matchesCategory && matchesUseCase;
    });
  }, [properties, searchTerm, listingType, propertyCategory, propertyUseCase]);

  const displayedProperties = filteredProperties.slice(0, displayedItems);
  const hasMore = displayedItems < filteredProperties.length;

  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [searchTerm, listingType, propertyCategory, propertyUseCase]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small delay for effect
          setTimeout(() => {
            setDisplayedItems((prev) => prev + ITEMS_PER_PAGE);
          }, 500);
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

  // Helper to generate mock intent tags
  const getIntentTags = (property: any) => {
    const tags = [];
    const lowerCat = (property.category || "").toLowerCase();

    if (property.price > 40000000) tags.push("Luxury Collection");
    if (property.price < 18000000 && lowerCat.includes('house')) tags.push("Best Value");
    if (property.listing_type === 'rent' && property.price < 50000) tags.push("Fast Moving");
    if (lowerCat.includes('land') && property.price < 5000000) tags.push("High ROI");

    return tags.slice(0, 2);
  };

  // Helper to generate mock micro-data
  const getMicroData = (property: any) => {
    const data = [];
    const lowerCat = (property.category || "").toLowerCase();

    if (lowerCat.includes('land')) {
      data.push({ icon: Map, value: "Residential", label: "Zoning" });
      data.push({ icon: TrendingUp, value: "+12%", label: "Proj. ROI" });
    } else if (lowerCat.includes('house') || lowerCat.includes('apartment') || lowerCat.includes('villa')) {
      data.push({ icon: Wallet, value: `KSh ${Math.floor(property.price / 240).toLocaleString()}`, label: "Est. Mortgage" });
      data.push({ icon: TrendingUp, value: "High Demand", label: "Area" });
    }
    return data;
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
        propertyUseCase={propertyUseCase}
        setPropertyUseCase={setPropertyUseCase}
        totalProperties={properties?.length || 0}
        filteredCount={filteredProperties.length}
      />

      <div className="container mx-auto px-4 py-8">

        {/* Intent Grouping Header (Example) */}
        {propertyUseCase === "All" && (
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Fresh listings for you</h2>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
                setPropertyUseCase("All");
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
                      category: property.category as "house" | "land",
                      listingType: property.listing_type,
                      bedrooms: property.bedrooms || 0,
                      bathrooms: property.bathrooms || 0,
                      landSize: property.land_size || undefined,
                    }}
                    intentTags={getIntentTags(property)}
                    microData={getMicroData(property)}
                  />
                </div>
              ))}

              {/* View More / CTA Card embedded in grid if no more items, or right after */}
              {!hasMore && filteredProperties.length > 0 && (
                <div className="animate-fade-in">
                  <ListingCTAcard
                    onViewMore={() => setPropertyUseCase("All")}
                    context={propertyCategory !== 'all' ? propertyCategory : 'properties'}
                  />
                </div>
              )}
            </div>

            {hasMore && (
              <div className="flex flex-col items-center py-12 gap-4">
                {/* Smart Loader Card Effect - can be placed in grid or here. Placing here for now as a section ender. */}
                <div ref={loadMoreRef} className="w-full max-w-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Finding more properties...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
