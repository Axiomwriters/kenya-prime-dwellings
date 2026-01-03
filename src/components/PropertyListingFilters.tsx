import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Building2, LandPlot } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyListingFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  listingType: "all" | "sale" | "rent";
  setListingType: (type: "all" | "sale" | "rent") => void;
  propertyCategory: "all" | "house" | "land" | "commercial";
  setPropertyCategory: (category: "all" | "house" | "land" | "commercial") => void;
  propertyUseCase: string;
  setPropertyUseCase: (useCase: string) => void;
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
  propertyUseCase,
  setPropertyUseCase,
  totalProperties,
  filteredCount,
}: PropertyListingFiltersProps) {
  const useCases = ["All", "Student Housing", "Warehouses", "Mixed-Use", "Investment", "Co-working"];

  return (
    <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, location, intent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Type Filters */}
            <div className="flex gap-2 p-1 bg-muted/20 rounded-lg">
              <Button
                onClick={() => setListingType("all")}
                variant={listingType === "all" ? "secondary" : "ghost"}
                size="sm"
                className="hover:bg-background shadow-none"
              >
                All
              </Button>
              <Button
                onClick={() => setListingType("sale")}
                variant={listingType === "sale" ? "secondary" : "ghost"}
                size="sm"
                className="hover:bg-background shadow-none"
              >
                For Sale
              </Button>
              <Button
                onClick={() => setListingType("rent")}
                variant={listingType === "rent" ? "secondary" : "ghost"}
                size="sm"
                className="hover:bg-background shadow-none"
              >
                For Rent
              </Button>
            </div>

            <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
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
                <Building2 className="w-4 h-4 mr-2" />
                Houses
              </Button>
              <Button
                onClick={() => setPropertyCategory("land")}
                variant={propertyCategory === "land" ? "default" : "outline"}
                size="sm"
              >
                <LandPlot className="w-4 h-4 mr-2" />
                Land
              </Button>
              <Button
                onClick={() => setPropertyCategory("commercial")}
                variant={propertyCategory === "commercial" ? "default" : "outline"}
                size="sm"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Commercial
              </Button>
            </div>
          </div>

          {/* Use-Case / Intent Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-sm">
             <span className="text-muted-foreground mr-2 text-xs font-medium uppercase tracking-wider shrink-0">Explore:</span>
             {useCases.map((useCase) => (
               <Button
                  key={useCase}
                  variant={propertyUseCase === useCase ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full h-7 px-3 text-xs border border-transparent",
                    propertyUseCase === useCase 
                      ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setPropertyUseCase(useCase)}
               >
                 {useCase}
               </Button>
             ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
              <span className="font-semibold text-foreground">{totalProperties}</span> properties
            </div>
            
            {/* Optional: Add "Best Match" sorting here if needed later */}
        </div>
      </div>
    </div>
  );
}
