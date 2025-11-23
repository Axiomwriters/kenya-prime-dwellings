import { Property } from "@/types/property";
import { ListingCard } from "./ListingCard";
import { getAllProperties, getSimilarProperties } from "@/utils/propertyParser";
import { useMemo } from "react";

interface SimilarPropertiesProps {
  currentProperty: Property;
  maxItems?: number;
}

export function SimilarProperties({ 
  currentProperty, 
  maxItems = 6 
}: SimilarPropertiesProps) {
  const allProperties = useMemo(() => getAllProperties(), []);
  
  const similarProperties = useMemo(() => 
    getSimilarProperties(currentProperty, allProperties, maxItems),
    [currentProperty, allProperties, maxItems]
  );

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border/50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Similar Properties</h2>
        <p className="text-muted-foreground">
          You might also be interested in these properties
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarProperties.map((property, index) => (
          <div
            key={property.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ListingCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
}
