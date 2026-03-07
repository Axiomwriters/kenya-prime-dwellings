import { HardHat, Building, Paintbrush } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectTypePickerProps {
    selectedType: string;
    onSelect: (type: string) => void;
}

export function ProjectTypePicker({ selectedType, onSelect }: ProjectTypePickerProps) {
    const types = [
        {
            id: 'construction',
            title: 'New Construction',
            icon: HardHat,
            description: 'Building a new structure from the ground up'
        },
        {
            id: 'renovation',
            title: 'Renovation',
            icon: Building,
            description: 'Updating or remodeling an existing structure'
        },
        {
            id: 'interior-design',
            title: 'Interior Design',
            icon: Paintbrush,
            description: 'Designing and decorating interior spaces'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
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
