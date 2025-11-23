import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Building2, LandPlot } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyListingFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  listingType: "all" | "sale" | "rent";
  setListingType: (type: "all" | "sale" | "rent") => void;
  propertyCategory: "all" | "house" | "land";
  setPropertyCategory: (category: "all" | "house" | "land") => void;
  totalProperties: number;
  filteredCount: number;
}

export function PropertyListingFilters({
  searchTerm,
  setSearchTerm,
  listingType,
  setListingType,
  propertyCategory,
  setPropertyCategory,
  totalProperties,
  filteredCount,
}: PropertyListingFiltersProps) {
  return (
    <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, location, or agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button
              onClick={() => setListingType("all")}
              variant={listingType === "all" ? "default" : "outline"}
              size="sm"
            >
              All
            </Button>
            <Button
              onClick={() => setListingType("sale")}
              variant={listingType === "sale" ? "default" : "outline"}
              size="sm"
            >
              For Sale
            </Button>
            <Button
              onClick={() => setListingType("rent")}
              variant={listingType === "rent" ? "default" : "outline"}
              size="sm"
            >
              For Rent
            </Button>
          </div>

          <div className="w-px bg-border" />

          <div className="flex gap-2">
            <Button
              onClick={() => setPropertyCategory("all")}
              variant={propertyCategory === "all" ? "default" : "outline"}
              size="sm"
              className={cn(propertyCategory === "all" && "gap-2")}
            >
              {propertyCategory === "all" && <Home className="w-4 h-4" />}
              All
            </Button>
            <Button
              onClick={() => setPropertyCategory("house")}
              variant={propertyCategory === "house" ? "default" : "outline"}
              size="sm"
            >
              <Building2 className="w-4 h-4" />
              Houses
            </Button>
            <Button
              onClick={() => setPropertyCategory("land")}
              variant={propertyCategory === "land" ? "default" : "outline"}
              size="sm"
            >
              <LandPlot className="w-4 h-4" />
              Land
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
          <span className="font-semibold text-foreground">{totalProperties}</span> properties
        </div>
      </div>
    </div>
  );
}
