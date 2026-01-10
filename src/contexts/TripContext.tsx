import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

export interface TripProperty {
    id: string;
    title: string;
    location: string;
    price: string;
    image: string;
    agent: string;
}

interface TripContextType {
    tripItems: TripProperty[];
    addToTrip: (property: TripProperty) => void;
    removeFromTrip: (id: string) => void;
    isInTrip: (id: string) => boolean;
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
    const [tripItems, setTripItems] = useState<TripProperty[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const addToTrip = (property: TripProperty) => {
        if (tripItems.length >= 7) {
            toast.error("Trip limit reached", {
                description: "You can only add up to 7 properties per trip."
            });
            return;
        }
        if (tripItems.some(item => item.id === property.id)) {
            toast.info("Already in trip", {
                description: "This property is already in your viewing trip."
            });
            return;
        }
        setTripItems(prev => [...prev, property]);
        toast.success("Added to Viewing Trip", {
            description: `${property.title} has been added to your itinerary.`
        });
        setSidebarOpen(true);
    };

    const removeFromTrip = (id: string) => {
        setTripItems(prev => prev.filter(item => item.id !== id));
        toast.info("Property removed", {
            description: "Property removed from your viewing trip."
        });
    };

    const isInTrip = (id: string) => {
        return tripItems.some(item => item.id === id);
    };

    return (
        <TripContext.Provider value={{ tripItems, addToTrip, removeFromTrip, isInTrip, isSidebarOpen, setSidebarOpen }}>
            {children}
        </TripContext.Provider>
    );
}

export function useTrip() {
    const context = useContext(TripContext);
    if (context === undefined) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
}
