import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Home, TrendingUp } from "lucide-react";
import { BuyAbilityModal } from "@/components/BuyAbilityModal";

// Import property images
import houseThikaRoad from "@/assets/house-thika-road.jpg";
import apartmentRiverside from "@/assets/apartment-riverside.jpg";
import houseSyokimau from "@/assets/house-syokimau.jpg";
import apartmentParklands from "@/assets/apartment-parklands.jpg";

const buyAbilityProperties = [
  {
    id: "ba-1",
    image: houseThikaRoad,
    price: "KSh 12,500,000",
    location: "Thika Road, Nairobi",
    beds: 3,
    baths: 2,
    sqm: 220,
  },
  {
    id: "ba-2",
    image: apartmentRiverside,
    price: "KSh 8,900,000",
    location: "Riverside, Nairobi",
    beds: 2,
    baths: 2,
    sqm: 150,
  },
  {
    id: "ba-3",
    image: houseSyokimau,
    price: "KSh 6,750,000",
    location: "Syokimau, Machakos",
    beds: 3,
    baths: 2,
    sqm: 180,
  },
  {
    id: "ba-4",
    image: apartmentParklands,
    price: "KSh 10,200,000",
    location: "Parklands, Nairobi",
    beds: 2,
    baths: 2,
    sqm: 140,
  },
];

export function BuyAbilitySection() {
  const [api, setApi] = useState<CarouselApi>();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    if (!api || isHovered) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api, isHovered]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Know Your BuyAbility
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Discover what you can afford and explore properties within your budget
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Mortgage Calculator Card */}
          <div className="w-full">
            <Card className="bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500">
              <CardContent className="p-8 space-y-8">
                {/* Logo Header */}
                <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-lg">PropertyHub Loans</span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <p className="text-lg text-foreground font-light leading-relaxed">
                    Find out what you can afford and start your home search confidently.
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full h-14 text-base font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-primary hover:bg-primary/90"
                  onClick={() => setIsModalOpen(true)}
                >
                  Let's get started
                </Button>
              </CardContent>
            </Card>
          </div>

          <BuyAbilityModal open={isModalOpen} onOpenChange={setIsModalOpen} />

          {/* Right: Property Carousel */}
          <div
            className="w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 1,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {buyAbilityProperties.map((property, index) => (
                  <CarouselItem key={property.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                    <PropertyCardItem property={property} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
              <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyCardItem({
  property,
  index
}: {
  property: typeof buyAbilityProperties[0];
  index: number;
}) {
  return (
    <Card
      className="overflow-hidden border border-border/50 rounded-2xl hover:shadow-2xl transition-all duration-600 hover:-translate-y-1 animate-fade-in group cursor-pointer bg-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.location}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Badge Overlay */}
        <div className="absolute top-4 left-4">
          <Badge
            className="px-3 py-1.5 text-xs font-semibold shadow-lg rounded-full"
            style={{
              backgroundColor: "hsl(24, 100%, 50%)",
              color: "white",
              border: "none"
            }}
          >
            Within BuyAbility
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-4">
        {/* Placeholder Text Bars */}
        <div className="space-y-2.5">
          <div className="h-2.5 bg-muted/60 rounded-full w-full" />
          <div className="h-2.5 bg-muted/60 rounded-full w-4/5" />
          <div className="h-2.5 bg-muted/60 rounded-full w-3/5" />
        </div>
      </CardContent>
    </Card>
  );
}
