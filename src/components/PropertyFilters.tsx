import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Home, Building, Building2, MapPin } from "lucide-react";

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeType: string;
  setActiveType: (type: string) => void;
  propertyCount: number;
  growthCount: number;
}

export function PropertyFilters({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  activeType,
  setActiveType,
  propertyCount,
  growthCount
}: FilterProps) {
  const statusFilters = [
    { key: "all", label: "All Properties", active: true },
    { key: "sale", label: "For Sale" },
    { key: "rent", label: "For Rent" }
  ];

  const typeFilters = [
    { key: "all", label: "All Types", icon: Building },
    { key: "house", label: "House", icon: Home },
    { key: "apartment", label: "Apartment", icon: Building2 },
    { key: "villa", label: "Villa", icon: Building },
    { key: "bungalow", label: "Bungalow", icon: Home }
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by location, property type, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background border-border focus:border-primary transition-colors"
        />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {statusFilters.map((filter) => (
          <Button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            variant={activeFilter === filter.key ? "default" : "outline"}
            className={`transition-all duration-200 ${
              activeFilter === filter.key
                ? "bg-primary text-primary-foreground shadow-button hover:bg-primary/90"
                : "border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            {filter.label}
          </Button>
        ))}
        <Button variant="outline" className="border-border hover:border-primary hover:bg-primary/5">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Property Type Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {typeFilters.map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.key}
              onClick={() => setActiveType(type.key)}
              variant={activeType === type.key ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-200 ${
                activeType === type.key
                  ? "bg-secondary text-secondary-foreground shadow-button hover:bg-secondary/90"
                  : "border-border hover:border-secondary hover:bg-secondary/5"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {type.label}
            </Button>
          );
        })}
      </div>

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