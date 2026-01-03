import { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { getAllProperties, getSimilarProperties } from "@/utils/propertyParser";
import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <section className="py-12 border-t border-border/50 overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Similar Properties</h2>
          <p className="text-muted-foreground">
            You might also be interested in these properties
          </p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {similarProperties.map((property) => (
            <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="h-full">
                <PropertyCard property={{
                  id: property.id,
                  title: property.title,
                  price: property.priceFormatted,
                  location: property.location,
                  image: property.images[0],
                  beds: property.bedrooms || 0,
                  baths: property.bathrooms || 0,
                  sqm: typeof property.landSize === 'number' ? property.landSize : parseInt(property.landSize?.toString() || '0'),
                  type: property.listingType === 'sale' ? "For Sale" : "For Rent",
                  status: property.listingType === 'sale' ? 'sale' : 'rent',
                  propertyType: property.category,
                  isHighGrowth: false
                }} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4 md:absolute md:top-1/2 md:-translate-y-1/2 md:w-full md:justify-between md:left-0 md:px-0 md:mt-0 pointer-events-none">
          <CarouselPrevious className="static translate-y-0 md:absolute md:-left-12 pointer-events-auto bg-background/80 hover:bg-background shadow-md border-border" />
          <CarouselNext className="static translate-y-0 md:absolute md:-right-12 pointer-events-auto bg-background/80 hover:bg-background shadow-md border-border" />
        </div>
      </Carousel>
    </section >
  );
}
