import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home, Landmark, Users, Building2, TreePine } from "lucide-react";
import { KENYAN_COUNTIES } from "@/data/counties";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SearchAutocompleteProps {
    onSearch: (term: string) => void;
    initialValue?: string;
    className?: string;
}

interface Suggestion {
    type: "county" | "property" | "land" | "professional";
    category: string;
    value: string;
    description?: string;
}

// Property options
const PROPERTY_OPTIONS = [
    { label: "Houses for Sale", type: "property" as const, category: "sale", keywords: ["house", "home", "sale", "buy"] },
    { label: "Apartments for Sale", type: "property" as const, category: "sale", keywords: ["apartment", "flat", "condo", "sale", "buy"] },
    { label: "Houses for Rent", type: "property" as const, category: "rent", keywords: ["house", "home", "rent", "rental"] },
    { label: "Apartments for Rent", type: "property" as const, category: "rent", keywords: ["apartment", "flat", "condo", "rent", "rental"] },
];

// Land options
const LAND_OPTIONS = [
    { label: "Land for Sale", type: "land" as const, category: "sale", keywords: ["land", "plot", "acre", "sale", "buy"] },
    { label: "Land for Lease", type: "land" as const, category: "lease", keywords: ["land", "plot", "acre", "lease", "rent"] },
];

// Professional options
const PROFESSIONAL_OPTIONS = [
    { label: "Certified Architects", type: "professional" as const, category: "architect", keywords: ["architect", "design", "building", "professional"] },
    { label: "Certified Engineers", type: "professional" as const, category: "engineer", keywords: ["engineer", "structural", "civil", "professional"] },
    { label: "Certified Surveyors", type: "professional" as const, category: "surveyor", keywords: ["surveyor", "land", "survey", "professional"] },
    { label: "Certified Contractors", type: "professional" as const, category: "contractor", keywords: ["contractor", "builder", "construction", "professional"] },
];

export function SearchAutocomplete({ onSearch, initialValue = "", className }: SearchAutocompleteProps) {
    const [inputValue, setInputValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim().length === 0) {
            setSuggestions([]);
            setIsOpen(false);
            onSearch(value);
            return;
        }

        const lowerValue = value.toLowerCase();
        const allSuggestions: Suggestion[] = [];

        // Add county matches
        const countyMatches = KENYAN_COUNTIES.filter((county) =>
            county.toLowerCase().includes(lowerValue)
        ).map((county) => ({
            type: "county" as const,
            category: "location",
            value: county,
        }));
        allSuggestions.push(...countyMatches);

        // Add property matches
        const propertyMatches = PROPERTY_OPTIONS.filter((option) =>
            option.keywords.some((keyword) => keyword.includes(lowerValue)) ||
            option.label.toLowerCase().includes(lowerValue)
        ).map((option) => ({
            type: option.type,
            category: option.category,
            value: option.label,
        }));
        allSuggestions.push(...propertyMatches);

        // Add land matches
        const landMatches = LAND_OPTIONS.filter((option) =>
            option.keywords.some((keyword) => keyword.includes(lowerValue)) ||
            option.label.toLowerCase().includes(lowerValue)
        ).map((option) => ({
            type: option.type,
            category: option.category,
            value: option.label,
        }));
        allSuggestions.push(...landMatches);

        // Add professional matches
        const professionalMatches = PROFESSIONAL_OPTIONS.filter((option) =>
            option.keywords.some((keyword) => keyword.includes(lowerValue)) ||
            option.label.toLowerCase().includes(lowerValue)
        ).map((option) => ({
            type: option.type,
            category: option.category,
            value: option.label,
        }));
        allSuggestions.push(...professionalMatches);

        setSuggestions(allSuggestions);
        setIsOpen(allSuggestions.length > 0);
        onSearch(value);
    };

    const handleSelect = (value: string) => {
        setInputValue(value);
        setIsOpen(false);
        onSearch(value);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case "county":
                return <MapPin className="w-4 h-4" />;
            case "property":
                return <Home className="w-4 h-4" />;
            case "land":
                return <Landmark className="w-4 h-4" />;
            case "professional":
                return <Users className="w-4 h-4" />;
            default:
                return <Search className="w-4 h-4" />;
        }
    };

    const getBadgeForCategory = (type: string, category: string) => {
        if (type === "property" || type === "land") {
            return category === "sale" ? (
                <Badge className="bg-success/20 text-success border-success/30 text-xs">Sale</Badge>
            ) : category === "rent" ? (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Rent</Badge>
            ) : (
                <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">Lease</Badge>
            );
        }
        return null;
    };

    const groupedSuggestions = {
        counties: suggestions.filter((s) => s.type === "county"),
        properties: suggestions.filter((s) => s.type === "property"),
        land: suggestions.filter((s) => s.type === "land"),
        professionals: suggestions.filter((s) => s.type === "professional"),
    };

    const hasAnySuggestions = Object.values(groupedSuggestions).some((group) => group.length > 0);

    return (
        <div ref={wrapperRef} className={cn("relative w-full", className)}>
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search properties, locations, professionals..."
                    className="pl-10 rounded-full bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary shadow-sm w-full h-9 text-sm placeholder:text-xs sm:placeholder:text-sm"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (inputValue.trim().length > 0 && hasAnySuggestions) setIsOpen(true);
                    }}
                />
            </div>

            {isOpen && hasAnySuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-[9999] animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-[500px] overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        {/* Counties Section */}
                        {groupedSuggestions.counties.length > 0 && (
                            <div className="mb-3">
                                <div className="flex items-center gap-2 px-3 py-2 mb-1">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        Counties
                                    </h3>
                                </div>
                                <div className="space-y-0.5">
                                    {groupedSuggestions.counties.slice(0, 5).map((suggestion) => (
                                        <button
                                            key={suggestion.value}
                                            onClick={() => handleSelect(suggestion.value)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-primary/10 rounded-xl flex items-center gap-3 text-sm transition-all duration-200 group"
                                        >
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                {getIconForType(suggestion.type)}
                                            </div>
                                            <span className="font-medium">{suggestion.value}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Properties Section */}
                        {groupedSuggestions.properties.length > 0 && (
                            <div className="mb-3">
                                <div className="flex items-center gap-2 px-3 py-2 mb-1 border-t border-border/30 pt-3">
                                    <Building2 className="w-4 h-4 text-success" />
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        Properties
                                    </h3>
                                </div>
                                <div className="space-y-0.5">
                                    {groupedSuggestions.properties.map((suggestion) => (
                                        <button
                                            key={suggestion.value}
                                            onClick={() => handleSelect(suggestion.value)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-success/10 rounded-xl flex items-center justify-between gap-3 text-sm transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-all">
                                                    {getIconForType(suggestion.type)}
                                                </div>
                                                <span className="font-medium">{suggestion.value}</span>
                                            </div>
                                            {getBadgeForCategory(suggestion.type, suggestion.category)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Land Section */}
                        {groupedSuggestions.land.length > 0 && (
                            <div className="mb-3">
                                <div className="flex items-center gap-2 px-3 py-2 mb-1 border-t border-border/30 pt-3">
                                    <TreePine className="w-4 h-4 text-accent" />
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        Land
                                    </h3>
                                </div>
                                <div className="space-y-0.5">
                                    {groupedSuggestions.land.map((suggestion) => (
                                        <button
                                            key={suggestion.value}
                                            onClick={() => handleSelect(suggestion.value)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-accent/10 rounded-xl flex items-center justify-between gap-3 text-sm transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                                                    {getIconForType(suggestion.type)}
                                                </div>
                                                <span className="font-medium">{suggestion.value}</span>
                                            </div>
                                            {getBadgeForCategory(suggestion.type, suggestion.category)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Professionals Section */}
                        {groupedSuggestions.professionals.length > 0 && (
                            <div className="mb-1">
                                <div className="flex items-center gap-2 px-3 py-2 mb-1 border-t border-border/30 pt-3">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                        Professional Experts
                                    </h3>
                                </div>
                                <div className="space-y-0.5">
                                    {groupedSuggestions.professionals.map((suggestion) => (
                                        <button
                                            key={suggestion.value}
                                            onClick={() => handleSelect(suggestion.value)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-purple-500/10 rounded-xl flex items-center gap-3 text-sm transition-all duration-200 group"
                                        >
                                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                                {getIconForType(suggestion.type)}
                                            </div>
                                            <span className="font-medium">{suggestion.value}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
