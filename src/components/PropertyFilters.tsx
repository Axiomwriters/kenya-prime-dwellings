import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Building2, MapPin, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeType: string;
  setActiveType: (type: string) => void;
  propertyCount: number;
  growthCount: number;
  activeUseCase: string;
  setActiveUseCase: (useCase: string) => void;
}

export function PropertyFilters({
  activeFilter,
  setActiveFilter,
  activeType,
  setActiveType,
  propertyCount,
  growthCount,
  activeUseCase,
  setActiveUseCase
}: FilterProps) {
  // Removed unused state and ref


  const statusFilters = [
    { key: "all", label: "All Properties" },
    { key: "sale", label: "Buy" },
    { key: "rent", label: "Rent" },
    // { key: "short_stay", label: "Short Stay" } // Included if needed, but user emphasized "All | Buy | Rent | Land"
  ];
  // Adding Land to the primary intent logic implies handling it as a specific action

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

  const useCases = ["All", "Student Housing", "Family Homes", "Investment", "Gated Communities", "First-Time Buyers", "Luxury Living", "Warehouses", "Mixed-Use"];

  const handleIntentClick = (key: string) => {
    if (key === "Land") {
      setActiveType("Land");
      // "Land" usually implies For Sale, but we can leave filter as is or set to All/Sale.
      // If the user wants "Land" as a primary intent alongside Buy/Rent, it might be best to just set the type.
    } else {
      setActiveFilter(key);
      if (activeType === "Land") setActiveType("all"); // If switching back to Buy/Rent, maybe clear Land type?
    }
  };



  return (
    <div className="space-y-4 w-full">
      {/* 1. Global Section Header */}
      <div className="space-y-1 mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Find Your Next Property
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Filter and explore properties tailored to your needs
        </p>
      </div>

      {/* 2. Primary Intent Controls (Market) */}
      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.key}
            onClick={() => handleIntentClick(filter.key)}
            variant={activeFilter === filter.key && activeType !== 'Land' ? "default" : "outline"}
            className={cn(
              "rounded-full h-9 px-4 text-sm transition-all duration-200",
              activeFilter === filter.key && activeType !== 'Land'
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 border-transparent"
                : "border-border/60 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </Button>
        ))}
        <Button
          onClick={() => handleIntentClick("Land")}
          variant={activeType === "Land" ? "default" : "outline"}
          className={cn(
            "rounded-full h-9 px-4 text-sm transition-all duration-200",
            activeType === "Land"
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 border-transparent"
              : "border-border/60 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground"
          )}
        >
          <MapPin className="w-3.5 h-3.5 mr-2" />
          Land
        </Button>
      </div>

      {/* 3. Explore by Purpose (Horizontal Scroll) - Moved Up */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore by Purpose</span>
        </div>
        <div 
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-sm -mx-1 px-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {useCases.map((useCase) => (
            <Button
              key={useCase}
              variant={activeUseCase === useCase ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "rounded-full h-7 px-3 text-xs border border-transparent transition-all whitespace-nowrap",
                activeUseCase === useCase
                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setActiveUseCase(useCase)}
            >
              {useCase}
            </Button>
          ))}
        </div>
      </div>

      {/* 4. Property Type Filters (Horizontal Scroll) - Moved Down */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Type</span>
        </div>
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-linear-fade -mx-1 px-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Button
            onClick={() => setActiveType("all")}
            variant={activeType === "all" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "rounded-md h-8 px-3 text-xs whitespace-nowrap transition-all",
              activeType === "all"
                ? "bg-secondary text-secondary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All Types
          </Button>
          {typeFilters.map((type) => {
            if (type.key === 'all') return null; // Skip 'all' as we added it manually
            const Icon = type.icon;
            return (
              <Button
                key={type.key}
                onClick={() => setActiveType(type.key)}
                variant={activeType === type.key ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-md h-8 px-3 text-xs whitespace-nowrap transition-all",
                  activeType === type.key
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-3.5 h-3.5 mr-2 opacity-70" />
                {type.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Showing {propertyCount} properties</span>
        </div>
        {growthCount > 0 && (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors">
            <span className="w-1.5 h-1.5 bg-success rounded-full mr-2 animate-pulse"></span>
            {growthCount} in high-growth areas
          </Badge>
        )}
      </div>
    </div>
  );
}