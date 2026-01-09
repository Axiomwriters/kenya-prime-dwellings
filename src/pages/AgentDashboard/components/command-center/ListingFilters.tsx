import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, House, Building2, Store } from "lucide-react";

interface ListingFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export function ListingFilters({ activeFilter, onFilterChange }: ListingFiltersProps) {
    const filters = [
        "All Listings",
        "Student Housing",
        "Family Homes",
        "Investment",
        "Gated Communities",
        "First-Time Buyers",
        "Luxury Living",
        "Warehouses",
        "Mixed-Use"
    ];

    const types = [
        { label: "Houses", icon: House },
        { label: "Apartments", icon: Building2 },
        { label: "Commercial", icon: Store },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <Badge
                            key={filter}
                            variant={activeFilter === filter ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1.5 text-sm hover:bg-secondary/80 transition-colors"
                            onClick={() => onFilterChange(filter)}
                        >
                            {filter}
                        </Badge>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    More Filters
                </Button>
            </div>

            {/* Quick Type Toggles (Optional visuals) */}
            <div className="hidden md:flex gap-2 pb-2 border-b border-border/40">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider my-auto mr-2">
                    Property Type:
                </span>
                {types.map((type) => (
                    <Button key={type.label} variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
