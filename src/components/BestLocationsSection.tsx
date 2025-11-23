import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, DollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnimatedCountyText } from "./AnimatedCountyText";

// Import images
import apartmentWestlands from "@/assets/apartment-westlands.jpg";
import apartmentKilimani from "@/assets/apartment-kilimani.jpg";
import apartmentParklands from "@/assets/apartment-parklands.jpg";
import bungalowKaren from "@/assets/bungalow-karen.jpg";
import houseRunda from "@/assets/house-runda.jpg";
import villaLavington from "@/assets/villa-lavington.jpg";
import hotelCBD from "@/assets/hotel-cbd-nairobi.jpg";
import hotelGigiri from "@/assets/hotel-gigiri.jpg";
import apartmentRiverside from "@/assets/apartment-riverside.jpg";
import houseSyokimau from "@/assets/house-syokimau.jpg";
import houseKiambu from "@/assets/house-kiambu.jpg";
import houseThikaRoad from "@/assets/house-thika-road.jpg";

interface Location {
  id: string;
  name: string;
  averagePrice: string;
  growth: string;
  properties: number;
  description: string;
  image: string;
}

const locationData = {
  rent: [
    {
      id: "1",
      name: "Westlands",
      averagePrice: "KSh 35,000/month",
      growth: "+12%",
      properties: 156,
      description: "Prime business district with modern amenities",
      image: apartmentWestlands
    },
    {
      id: "2",
      name: "Kilimani",
      averagePrice: "KSh 42,000/month",
      growth: "+18%",
      properties: 89,
      description: "Vibrant neighborhood with excellent connectivity",
      image: apartmentKilimani
    },
    {
      id: "3",
      name: "Parklands",
      averagePrice: "KSh 28,000/month",
      growth: "+8%",
      properties: 134,
      description: "Peaceful residential area with good schools",
      image: apartmentParklands
    }
  ],
  sell: [
    {
      id: "4",
      name: "Karen",
      averagePrice: "KSh 25M",
      growth: "+15%",
      properties: 67,
      description: "Exclusive suburb with luxury properties",
      image: bungalowKaren
    },
    {
      id: "5",
      name: "Runda",
      averagePrice: "KSh 32M",
      growth: "+22%",
      properties: 43,
      description: "Upscale residential with diplomatic presence",
      image: houseRunda
    },
    {
      id: "6",
      name: "Lavington",
      averagePrice: "KSh 28M",
      growth: "+19%",
      properties: 78,
      description: "Prestigious location with green spaces",
      image: villaLavington
    }
  ],
  shortStay: [
    {
      id: "7",
      name: "CBD Nairobi",
      averagePrice: "KSh 8,500/night",
      growth: "+25%",
      properties: 92,
      description: "Central location perfect for business travelers",
      image: hotelCBD
    },
    {
      id: "8",
      name: "Gigiri",
      averagePrice: "KSh 12,000/night",
      growth: "+30%",
      properties: 34,
      description: "Diplomatic quarter with premium accommodations",
      image: hotelGigiri
    },
    {
      id: "9",
      name: "Riverside",
      averagePrice: "KSh 6,800/night",
      growth: "+14%",
      properties: 56,
      description: "Modern area with shopping and entertainment",
      image: apartmentRiverside
    }
  ],
  buy: [
    {
      id: "10",
      name: "Syokimau",
      averagePrice: "KSh 8.5M",
      growth: "+28%",
      properties: 187,
      description: "Fast-growing area near the airport",
      image: houseSyokimau
    },
    {
      id: "11",
      name: "Kiambu",
      averagePrice: "KSh 6.2M",
      growth: "+24%",
      properties: 203,
      description: "Affordable options with great potential",
      image: houseKiambu
    },
    {
      id: "12",
      name: "Thika Road",
      averagePrice: "KSh 7.8M",
      growth: "+32%",
      properties: 145,
      description: "Rapidly developing corridor with infrastructure",
      image: houseThikaRoad
    }
  ]
};

const categoryLabels = {
  rent: "Best for Rent",
  sell: "Best for Sale", 
  shortStay: "Best for Short Stay",
  buy: "Best to Buy"
};

export function BestLocationsSection() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof locationData>("rent");
  const currentLocations = locationData[activeCategory];

  const LocationCard = ({ location, index }: { location: Location; index: number }) => (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 animate-fade-in border-border/50 overflow-hidden w-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={location.image} 
          alt={`${location.name} property`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {location.growth}
          </span>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {location.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {location.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Average Price</span>
            <span className="text-lg font-bold text-foreground flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {location.averagePrice}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Available Properties</span>
            <span className="text-sm font-semibold text-foreground">
              {location.properties} listings
            </span>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((parseInt(location.growth.replace('%', '').replace('+', '')) * 3), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Market performance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Top Locations in <AnimatedCountyText />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover the most sought-after areas based on market trends and property performance
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() => setActiveCategory(key as keyof typeof locationData)}
                className="px-6 py-2"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {currentLocations.map((location, index) => (
                <CarouselItem key={location.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                  <LocationCard location={location} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
            <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}