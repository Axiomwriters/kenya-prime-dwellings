import { useState } from "react";
import { Search, MapPin, Calendar as CalendarIcon, Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

// All 47 Kenyan Counties
const kenyanCounties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kiambu", "Machakos",
    "Kajiado", "Narok", "Kilifi", "Kwale", "Taita-Taveta", "Lamu", "Tana River",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi",
    "Embu", "Kitui", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
    "Turkana", "West Pokot", "Samburu", "Trans-Nzoia", "Uasin Gishu",
    "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia",
    "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia",
    "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira"
].sort();

interface StaySearchBarProps {
    onSearch?: (filters: {
        location: string;
        checkIn: Date | null;
        checkOut: Date | null;
        adults: number;
        children: number;
        infants: number;
    }) => void;
}

export function StaySearchBar({ onSearch }: StaySearchBarProps) {
    const [location, setLocation] = useState("");
    const [locationOpen, setLocationOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [dateOpen, setDateOpen] = useState(false);
    const [guestOpen, setGuestOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const totalGuests = adults + children + infants;

    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                location,
                checkIn: dateRange?.from || null,
                checkOut: dateRange?.to || null,
                adults,
                children,
                infants,
            });
        }
    };

    const handleLocationSelect = (county: string) => {
        setLocation(county);
        setLocationOpen(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-stretch md:items-center bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl md:rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Where Section */}
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                        <button className="flex-1 px-4 py-3 text-left hover:bg-muted/50 transition-colors rounded-t-2xl md:rounded-l-full md:rounded-tr-none border-b md:border-b-0 md:border-r border-border/40">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Where</div>
                                    <div className="text-sm font-medium text-foreground truncate">
                                        {location || "Search destinations"}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="start" sideOffset={8}>
                        <div className="max-h-80 overflow-y-auto">
                            <div className="sticky top-0 bg-background p-3 border-b z-10">
                                <h3 className="font-semibold text-sm">Popular Destinations</h3>
                            </div>
                            <div className="p-1">
                                {kenyanCounties.map((county) => (
                                    <button
                                        key={county}
                                        onClick={() => handleLocationSelect(county)}
                                        className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span>{county}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* When Section */}
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                        <button className="flex-1 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b md:border-b-0 md:border-r border-border/40">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">When</div>
                                    <div className="text-sm font-medium text-foreground truncate">
                                        {dateRange?.from && dateRange?.to
                                            ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                                            : dateRange?.from
                                                ? format(dateRange.from, "MMM d")
                                                : "Add dates"}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm">Select dates</h3>
                                {dateRange && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => setDateRange(undefined)}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Who Section */}
                <Popover open={guestOpen} onOpenChange={setGuestOpen}>
                    <PopoverTrigger asChild>
                        <button className="flex-1 px-4 py-3 text-left hover:bg-muted/50 transition-colors md:rounded-r-full rounded-b-2xl md:rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Who</div>
                                    <div className="text-sm font-medium text-foreground truncate">
                                        {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : "Add guests"}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="end" sideOffset={8}>
                        <div className="p-4 space-y-4">
                            {/* Adults */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-sm">Adults</div>
                                    <div className="text-xs text-muted-foreground">Ages 13+</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                        disabled={adults <= 1}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">{adults}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setAdults(adults + 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-sm">Children</div>
                                    <div className="text-xs text-muted-foreground">Ages 2-12</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                        disabled={children <= 0}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">{children}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setChildren(children + 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Infants */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-sm">Infants</div>
                                    <div className="text-xs text-muted-foreground">Under 2</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setInfants(Math.max(0, infants - 1))}
                                        disabled={infants <= 0}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-medium">{infants}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7 rounded-full"
                                        onClick={() => setInfants(infants + 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Search Button */}
                <div className="hidden md:flex pr-1.5 pl-2">
                    <Button
                        onClick={handleSearch}
                        size="icon"
                        className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Mobile Search Button */}
                <div className="md:hidden px-4 pb-4 pt-2">
                    <Button
                        onClick={handleSearch}
                        className="w-full rounded-full bg-primary hover:bg-primary/90 shadow-md"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}
