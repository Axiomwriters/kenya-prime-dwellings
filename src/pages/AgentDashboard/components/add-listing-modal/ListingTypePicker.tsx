import { Building2, Home, Map as MapIcon, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingTypePickerProps {
    selectedType: string;
    onSelect: (type: string) => void;
}

export function ListingTypePicker({ selectedType, onSelect }: ListingTypePickerProps) {
    const types = [
        {
            id: 'house',
            title: 'Apartment / House',
            icon: Home,
            description: 'Residential properties for living'
        },
        {
            id: 'commercial',
            title: 'Commercial',
            icon: Building2,
            description: 'Offices, shops, and warehouses'
        },
        {
            id: 'land',
            title: 'Land',
            icon: MapIcon,
            description: 'Plots and acreage for sale/lease'
        },
        {
            id: 'short_stay',
            title: 'Short Stay',
            icon: Hotel,
            description: 'Holiday homes and airbnbs'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {types.map((type) => (
                <button
                    key={type.id}
                    type="button"
                    onClick={() => onSelect(type.id)}
                    className={cn(
                        "relative flex flex-col items-start p-6 rounded-xl border-2 transition-all hover:bg-muted/50 text-left",
                        selectedType === type.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border/50 hover:border-primary/50"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-lg mb-4",
                        selectedType === type.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                        <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </button>
            ))}
        </div>
    );
}
