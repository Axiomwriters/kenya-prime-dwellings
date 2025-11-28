import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Building2, MapPin, Store, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeType: string;
  setActiveType: (type: string) => void;
  propertyCount: number;
  growthCount: number;
}

export function PropertyFilters({
  activeFilter,
  setActiveFilter,
  activeType,
  setActiveType,
  propertyCount,
  growthCount
}: FilterProps) {
  const [activeCategory, setActiveCategory] = useState<"properties" | "types" | "land" | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const statusFilters = [
    { key: "all", label: "All" },
    { key: "sale", label: "For Sale" },
    { key: "rent", label: "For Rent" },
    { key: "short_stay", label: "Short Stay" }
  ];

  const typeFilters = [
    { key: "all", label: "All Types", icon: Building },
    { key: "House", label: "House", icon: Home },
    { key: "Apartment", label: "Apartment", icon: Building2 },
    { key: "Villa", label: "Villa", icon: Building },
    { key: "Bungalow", label: "Bungalow", icon: Home },
    { key: "Townhouse", label: "Townhouse", icon: Home },
    { key: "Maisonette", label: "Maisonette", icon: Home },
    { key: "Office", label: "Office", icon: Building2 },
    { key: "Shop", label: "Shop", icon: Store },
  ];

  const handleCategoryClick = (category: "properties" | "types" | "land") => {
    if (category === "land") {
      setActiveCategory("land");
      setActiveType("Land");
      // Reset status filter to 'all' or keep as is? Usually land is for sale, but could be lease.
      // Let's keep status filter as is or reset to 'all' if user wants to see all land.
      // For now, let's not force status reset unless requested.
    } else {
      setActiveCategory(activeCategory === category ? null : category);
      if (category === "types" && activeType === "Land") {
         setActiveType("all"); // Reset type if moving away from Land specific view
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Category Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => handleCategoryClick("properties")}
          variant={activeCategory === "properties" ? "default" : "outline"}
          className={cn(
            "transition-all duration-200",
            activeCategory === "properties"
              ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
              : "border-border hover:border-primary hover:bg-primary/5"
          )}
        >
          All Properties
        </Button>

        <Button
          onClick={() => handleCategoryClick("types")}
          variant={activeCategory === "types" ? "default" : "outline"}
          className={cn(
            "transition-all duration-200",
            activeCategory === "types"
              ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
              : "border-border hover:border-primary hover:bg-primary/5"
          )}
        >
          All Types
        </Button>

        <Button
          onClick={() => handleCategoryClick("land")}
          variant={activeCategory === "land" ? "default" : "outline"}
          className={cn(
            "transition-all duration-200",
            activeCategory === "land"
              ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
              : "border-border hover:border-primary hover:bg-primary/5"
          )}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Land
        </Button>
      </div>

      {/* Sub-options Carousel */}
      {activeCategory && activeCategory !== "land" && (
        <div className="relative group animate-fade-in">
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activeCategory === "properties" && (
              statusFilters.map((filter) => (
                <Button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  variant={activeFilter === filter.key ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "whitespace-nowrap transition-all",
                    activeFilter === filter.key && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  {filter.label}
                </Button>
              ))
            )}

            {activeCategory === "types" && (
              typeFilters.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.key}
                    onClick={() => setActiveType(type.key)}
                    variant={activeType === type.key ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "whitespace-nowrap transition-all",
                      activeType === type.key && "bg-secondary text-secondary-foreground font-medium"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                );
              })
            )}
          </div>
          
          {/* Scroll Controls - Visible on hover if needed, or always for better UX */}
          {/* Simplified for now, relying on native touch/scroll */}
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Showing {propertyCount} properties</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-success/10 text-success border-success/20">
            <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
            {growthCount} in high-growth areas
          </Badge>
        </div>
      </div>
    </div>
  );
}