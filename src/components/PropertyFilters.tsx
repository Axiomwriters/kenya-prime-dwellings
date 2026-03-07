import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Building, Building2, MapPin, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocationAgent } from "@/contexts/LocationAgentContext";

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

  const { currentLocationFocus } = useLocationAgent();

  const statusFilters = [
    { key: "all", label: currentLocationFocus ? `All in ${currentLocationFocus.name}` : "All Properties" },
    { key: "sale", label: "Buy" },
    { key: "rent", label: "Rent" },
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

  const useCases = ["All", "Student Housing", "Family Homes", "Investment", "Gated Communities", "First-Time Buyers", "Luxury Living", "Warehouses", "Mixed-Use"];

  const handleIntentClick = (key: string) => {
    if (key === "Land") {
      setActiveType("Land");
    } else {
      setActiveFilter(key);
      if (activeType === "Land") setActiveType("all");
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-1 mb-2 px-4 md:px-0">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Find Your Next Property
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Filter and explore properties tailored to your needs
        </p>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pb-2 px-4 md:px-0 whitespace-nowrap">
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
              "rounded-full h-9 px-4 text-sm transition-all duration-200 whitespace-nowrap",
              activeType === "Land"
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 border-transparent"
                : "border-border/60 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin className="w-3.5 h-3.5 mr-2" />
            Land
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-4 md:px-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore by Purpose</span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pb-1 text-sm px-4 md:px-0 whitespace-nowrap">
            {useCases.map((useCase) => (
              <Button
                key={useCase}
                variant={activeUseCase === useCase ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-full h-7 px-3 text-xs border border-transparent transition-all",
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
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-4 md:px-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Type</span>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 pb-2 px-4 md:px-0 whitespace-nowrap">
            <Button
              onClick={() => setActiveType("all")}
              variant={activeType === "all" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "rounded-md h-8 px-3 text-xs",
                activeType === "all"
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              All Types
            </Button>
            {typeFilters.map((type) => {
              if (type.key === 'all') return null;
              const Icon = type.icon;
              return (
                <Button
                  key={type.key}
                  onClick={() => setActiveType(type.key)}
                  variant={activeType === type.key ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-md h-8 px-3 text-xs",
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
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40 px-4 md:px-0">
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
