import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocationCarousel } from "@/components/short-stay/LocationCarousel";
import { DynamicCountyCarousel } from "@/components/short-stay/DynamicCountyCarousel";
import { StaySearchBar } from "@/components/short-stay/StaySearchBar";

// Enhanced Mock Data
const generateProperties = (count: number, location: string, type: string) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: Math.random(),
        title: `${type} in ${location} - Unit ${i + 1}`,
        location: location,
        price: Math.floor(Math.random() * 20000) + 3000,
        rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
        reviews: Math.floor(Math.random() * 300) + 10,
        image: `https://images.unsplash.com/photo-${[
            "1502672260266-1c1ef2d93688",
            "1522708323590-d24dbb6b0267",
            "1613490493576-7fde63acd811",
            "1499793983690-e29da59ef1c2",
            "1520250497591-112f2f40a3f4",
            "1493246507139-91e8fad9978e",
            "1512917774080-9991f1c4c750",
            "1600596542815-a6df4db0dbd6",
            "1600585154340-be6161a56a0c",
            "1580587771525-78b9dba3b91d"
        ][i % 10]}?w=800&auto=format&fit=crop&q=60`,
        type: type,
        beds: Math.floor(Math.random() * 4) + 1,
        superhost: Math.random() > 0.5,
    }));
};

const mombasaProperties = generateProperties(8, "Mombasa", "Apartment");
const kiambuProperties = generateProperties(8, "Kiambu", "Villa");
const nakuruProperties = generateProperties(8, "Nakuru", "Condo");
const kilifiProperties = generateProperties(8, "Kilifi", "Beach House");
const kwaleProperties = generateProperties(8, "Kwale", "Cottage");
const capeTownProperties = generateProperties(8, "Cape Town", "Luxury Suite");
const machakosProperties = generateProperties(8, "Machakos", "Bungalow");
const laikipiaProperties = generateProperties(8, "Laikipia", "Safari Lodge");



interface SearchFilters {
    location: string;
    checkIn: Date | null;
    checkOut: Date | null;
    adults: number;
    children: number;
    infants: number;
}

export default function ShortStaySearch() {
    const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);

    const handleSearch = (filters: SearchFilters) => {
        setSearchFilters(filters);
    };

    const handleClearFilters = () => {
        setSearchFilters(null);
    };

    // Filter properties based on search criteria
    const filterProperties = (properties: any[]) => {
        if (!searchFilters) return properties;

        return properties.filter((property) => {
            // Filter by location
            if (searchFilters.location && !property.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
                return false;
            }

            // Filter by guest capacity (beds should accommodate adults + children)
            const totalGuests = searchFilters.adults + searchFilters.children;
            if (totalGuests > property.beds) {
                return false;
            }

            return true;
        });
    };

    const filteredMombasa = filterProperties(mombasaProperties);
    const filteredKiambu = filterProperties(kiambuProperties);
    const filteredNakuru = filterProperties(nakuruProperties);
    const filteredKilifi = filterProperties(kilifiProperties);
    const filteredKwale = filterProperties(kwaleProperties);
    const filteredCapeTown = filterProperties(capeTownProperties);
    const filteredMachakos = filterProperties(machakosProperties);
    const filteredLaikipia = filterProperties(laikipiaProperties);

    const hasActiveFilters = searchFilters !== null;

    return (
        <div className="container py-6 space-y-8 animate-fade-in">
            {/* Search Bar */}
            <div className="sticky top-[130px] z-30 -mx-4 px-4 md:mx-0 md:px-0 pb-4">
                <StaySearchBar onSearch={handleSearch} />

                {hasActiveFilters && (
                    <div className="flex items-center justify-between mt-4 px-4">
                        <p className="text-sm text-muted-foreground">
                            {searchFilters?.location && `Showing results for ${searchFilters.location}`}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="text-sm"
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
                {filteredMombasa.length > 0 && (
                    <LocationCarousel
                        title="Popular homes in Mombasa"
                        properties={filteredMombasa}
                    />
                )}
                {filteredKiambu.length > 0 && (
                    <LocationCarousel
                        title="Available in Kiambu this weekend"
                        properties={filteredKiambu}
                    />
                )}
                {filteredNakuru.length > 0 && (
                    <LocationCarousel
                        title="Stay in Nakuru County"
                        properties={filteredNakuru}
                    />
                )}
                {filteredKilifi.length > 0 && (
                    <LocationCarousel
                        title="Available in Kilifi County this weekend"
                        properties={filteredKilifi}
                    />
                )}
                {filteredKwale.length > 0 && (
                    <LocationCarousel
                        title="Homes in Kwale County"
                        properties={filteredKwale}
                    />
                )}
                {filteredCapeTown.length > 0 && (
                    <DynamicCountyCarousel
                        properties={filteredCapeTown}
                    />
                )}
                {filteredMachakos.length > 0 && (
                    <LocationCarousel
                        title="Check out homes in Machakos County"
                        properties={filteredMachakos}
                    />
                )}
                {filteredLaikipia.length > 0 && (
                    <LocationCarousel
                        title="Popular homes in Laikipia"
                        properties={filteredLaikipia}
                    />
                )}

                {/* No Results Message */}
                {hasActiveFilters &&
                    filteredMombasa.length === 0 &&
                    filteredKiambu.length === 0 &&
                    filteredNakuru.length === 0 &&
                    filteredKilifi.length === 0 &&
                    filteredKwale.length === 0 &&
                    filteredCapeTown.length === 0 &&
                    filteredMachakos.length === 0 &&
                    filteredLaikipia.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                            <Button onClick={handleClearFilters}>Clear all filters</Button>
                        </div>
                    )}
            </div>

            <div className="flex justify-center mt-12 mb-8">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Continue exploring short stays</h3>
                    <Button size="lg" className="rounded-full px-8">Show more</Button>
                </div>
            </div>
        </div>
    );
}
