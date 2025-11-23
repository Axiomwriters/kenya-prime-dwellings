import { useState, useMemo, useEffect, useRef } from "react";
import { getAllProperties } from "@/utils/propertyParser";
import { Property } from "@/types/property";
import { PropertyListingFilters } from "@/components/PropertyListingFilters";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { TopHeaderBar } from "@/components/TopHeaderBar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const ITEMS_PER_PAGE = 24;

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [propertyCategory, setPropertyCategory] = useState<"all" | "house" | "land">("all");
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const allProperties = useMemo(() => getAllProperties(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const matchesSearch =
        searchTerm === "" ||
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.agentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesListingType =
        listingType === "all" || property.listingType === listingType;

      const matchesCategory =
        propertyCategory === "all" || property.category === propertyCategory;

      return matchesSearch && matchesListingType && matchesCategory;
    });
  }, [allProperties, searchTerm, listingType, propertyCategory]);

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-x-hidden">
          <div className="min-h-screen bg-background">
            <TopHeaderBar />
            <DashboardHeader />
            
            <PropertyListingFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              listingType={listingType}
              setListingType={setListingType}
              propertyCategory={propertyCategory}
              setPropertyCategory={setPropertyCategory}
              totalProperties={allProperties.length}
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
                        <ListingCard property={property} />
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
