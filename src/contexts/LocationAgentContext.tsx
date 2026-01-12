import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NAKURU_LOCATIONS, NakuruZone } from '@/data/nakuruLocations';

interface LocationAgentContextType {
    currentLocationFocus: NakuruZone | null;
    setLocationFocus: (zone: NakuruZone | null) => void;
    searchLocations: (query: string) => NakuruZone[];
    detectLocationFromText: (text: string) => NakuruZone | null;
    getZonesByParent: (parentName: string) => NakuruZone[];
    availableTowns: NakuruZone[];
}

const LocationAgentContext = createContext<LocationAgentContextType | undefined>(undefined);

export function LocationAgentProvider({ children }: { children: ReactNode }) {
    const [currentLocationFocus, setCurrentLocationFocus] = useState<NakuruZone | null>(null);

    // Filter only top-level towns/cities for initial selection
    const availableTowns = NAKURU_LOCATIONS.filter(
        z => z.type === 'City' || z.type === 'Town'
    );

    const searchLocations = (query: string): NakuruZone[] => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return NAKURU_LOCATIONS.filter(zone =>
            zone.name.toLowerCase().includes(lowerQuery) ||
            zone.description?.toLowerCase().includes(lowerQuery) ||
            zone.parentRegion?.toLowerCase().includes(lowerQuery)
        );
    };

    const detectLocationFromText = (text: string): NakuruZone | null => {
        if (!text) return null;
        const lowerText = text.toLowerCase();
        // Sort by name length descending to match longest specific names first (e.g. "Nakuru CBD" before "Nakuru")
        const sortedZones = [...NAKURU_LOCATIONS].sort((a, b) => b.name.length - a.name.length);

        return sortedZones.find(zone => lowerText.includes(zone.name.toLowerCase())) || null;
    };

    const getZonesByParent = (parentName: string): NakuruZone[] => {
        return NAKURU_LOCATIONS.filter(z => z.parentRegion === parentName);
    };

    return (
        <LocationAgentContext.Provider
            value={{
                currentLocationFocus,
                setLocationFocus: setCurrentLocationFocus,
                searchLocations,
                detectLocationFromText,
                getZonesByParent,
                availableTowns
            }}
        >
            {children}
        </LocationAgentContext.Provider>
    );
}

export function useLocationAgent() {
    const context = useContext(LocationAgentContext);
    if (context === undefined) {
        throw new Error('useLocationAgent must be used within a LocationAgentProvider');
    }
    return context;
}
