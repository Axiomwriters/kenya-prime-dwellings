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
    placeholder?: string;
}


interface Suggestion {
    type: 'county' | 'property' | 'land' | 'professional';
    value: string;
    category?: string;
}

const PROPERTY_TYPES = [
    { value: 'Houses for Sale', type: 'property', category: 'sale' },
    { value: 'Houses for Rent', type: 'property', category: 'rent' },
    { value: 'Apartments for Sale', type: 'property', category: 'sale' },
    { value: 'Apartments for Rent', type: 'property', category: 'rent' },
] as const;

const LAND_TYPES = [
    { value: 'Land for Sale', type: 'land', category: 'sale' },
    { value: 'Land for Lease', type: 'land', category: 'lease' },
] as const;

const PROFESSIONAL_TYPES = [
    'Architects',
    'Engineers',
    'Contractors',
    'Surveyors',
    'Interior Designers',
] as const;

export function SearchAutocomplete({ onSearch, initialValue = "", className, placeholder = "Search properties, locations, professionals..." }: SearchAutocompleteProps) {
    const [inputValue, setInputValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setIsOpen(value.trim().length > 0);
    };

    const handleSelect = (value: string) => {
        setInputValue(value);
        onSearch(value);
        setIsOpen(false);
    };

    // Filter suggestions based on input
    const filteredCounties = KENYAN_COUNTIES.filter(county =>
        county.toLowerCase().includes(inputValue.toLowerCase())
    ).map(county => ({ type: 'county' as const, value: county }));

    const filteredProperties = PROPERTY_TYPES.filter(prop =>
        prop.value.toLowerCase().includes(inputValue.toLowerCase())
    ).map(prop => ({ type: prop.type, value: prop.value, category: prop.category }));

    const filteredLand = LAND_TYPES.filter(land =>
        land.value.toLowerCase().includes(inputValue.toLowerCase())
    ).map(land => ({ type: land.type, value: land.value, category: land.category }));

    const filteredProfessionals = PROFESSIONAL_TYPES.filter(prof =>
        prof.toLowerCase().includes(inputValue.toLowerCase())
    ).map(prof => ({ type: 'professional' as const, value: prof }));

    const groupedSuggestions = {
        counties: filteredCounties,
        properties: filteredProperties,
        land: filteredLand,
        professionals: filteredProfessionals,
    };

    const hasAnySuggestions =
        filteredCounties.length > 0 ||
        filteredProperties.length > 0 ||
        filteredLand.length > 0 ||
        filteredProfessionals.length > 0;

    const getIconForType = (type: string) => {
        switch (type) {
            case 'county':
                return <MapPin className="w-4 h-4" />;
            case 'property':
                return <Home className="w-4 h-4" />;
            case 'land':
                return <TreePine className="w-4 h-4" />;
            case 'professional':
                return <Users className="w-4 h-4" />;
            default:
                return <Search className="w-4 h-4" />;
        }
    };

    const getBadgeForCategory = (type: string, category?: string) => {
        if (!category) return null;

        const variant = category === 'sale' ? 'default' : category === 'rent' ? 'secondary' : 'outline';
        return (
            <Badge variant={variant} className="text-xs capitalize">
                {category}
            </Badge>
        );
    };


    return (
        <div ref={wrapperRef} className={cn("relative w-full", className)}>
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder={placeholder}
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
