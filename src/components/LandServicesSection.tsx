import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, MapPin, Home, Handshake, Building, Landmark } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AnimatedCountyText } from "@/components/AnimatedCountyText";

// Import land service images
import landSellingImg from "@/assets/villa-lavington.jpg";
import landBuyingImg from "@/assets/house-nairobi-1.jpg";
import landBrokerageImg from "@/assets/hotel-cbd-nairobi.jpg";
import landLeasingImg from "@/assets/bungalow-karen.jpg";
import agriculturalImg from "@/assets/house-kiambu.jpg";
import commercialImg from "@/assets/apartment-westlands.jpg";
import residentialImg from "@/assets/house-runda.jpg";
import industrialImg from "@/assets/house-thika-road.jpg";

interface LandService {
  id: string;
  name: string;
  icon: any;
  image: string;
  averagePrice: string;
  growth: string;
  listings: number;
  description: string;
  details: string;
}

const landServicesData = {
  all: [
    {
      id: "1",
      name: "Land Selling",
      icon: Landmark,
      image: landSellingImg,
      averagePrice: "KSh 2.5M/acre",
      growth: "+18%",
      listings: 342,
      description: "Professional land selling services with market expertise",
      details: "Premium locations with verified titles and legal documentation"
    },
    {
      id: "2",
      name: "Land Buying",
      icon: Home,
      image: landBuyingImg,
      averagePrice: "KSh 1.8M/acre",
      growth: "+22%",
      listings: 456,
      description: "Expert guidance for secure land acquisition processes",
      details: "Due diligence, valuation, and transaction support services"
    },
    {
      id: "3",
      name: "Land Brokerage",
      icon: Handshake,
      image: landBrokerageImg,
      averagePrice: "3.5% commission",
      growth: "+25%",
      listings: 278,
      description: "Connecting buyers and sellers with professional mediation",
      details: "Transparent processes with legal compliance and fast transactions"
    },
    {
      id: "4",
      name: "Land Leasing",
      icon: Building,
      image: landLeasingImg,
      averagePrice: "KSh 15K/month",
      growth: "+14%",
      listings: 189,
      description: "Flexible leasing options for agricultural and commercial use",
      details: "Short and long-term agreements with competitive rental rates"
    }
  ],
  selling: [
    {
      id: "1",
      name: "Premium Land Selling",
      icon: Landmark,
      image: landSellingImg,
      averagePrice: "KSh 3.2M/acre",
      growth: "+20%",
      listings: 125,
      description: "High-value land selling in prime locations",
      details: "Exclusive properties with maximum market exposure"
    },
    {
      id: "5",
      name: "Agricultural Land Sales",
      icon: Landmark,
      image: agriculturalImg,
      averagePrice: "KSh 1.8M/acre",
      growth: "+15%",
      listings: 98,
      description: "Fertile agricultural land with water access",
      details: "Verified soil quality and irrigation potential"
    },
    {
      id: "6",
      name: "Commercial Land Sales",
      icon: Landmark,
      image: commercialImg,
      averagePrice: "KSh 4.5M/acre",
      growth: "+28%",
      listings: 67,
      description: "Strategic commercial plots for development",
      details: "Prime locations with development approvals"
    }
  ],
  buying: [
    {
      id: "2",
      name: "Investment Land Purchase",
      icon: Home,
      image: landBuyingImg,
      averagePrice: "KSh 2.1M/acre",
      growth: "+24%",
      listings: 234,
      description: "Strategic land acquisition for investment portfolios",
      details: "Market analysis and future growth potential assessment"
    },
    {
      id: "7",
      name: "Residential Land Buying",
      icon: Home,
      image: residentialImg,
      averagePrice: "KSh 1.5M/acre",
      growth: "+18%",
      listings: 156,
      description: "Perfect plots for building your dream home",
      details: "Residential zones with utility connections available"
    },
    {
      id: "8",
      name: "Industrial Land Purchase",
      icon: Home,
      image: industrialImg,
      averagePrice: "KSh 2.8M/acre",
      growth: "+21%",
      listings: 89,
      description: "Industrial plots with excellent infrastructure access",
      details: "Strategic locations near transport hubs and utilities"
    }
  ],
  brokerage: [
    {
      id: "3",
      name: "Premium Brokerage",
      icon: Handshake,
      image: landBrokerageImg,
      averagePrice: "4% commission",
      growth: "+30%",
      listings: 145,
      description: "High-end land transaction facilitation services",
      details: "White-glove service for luxury land transactions"
    },
    {
      id: "9",
      name: "Standard Brokerage",
      icon: Handshake,
      image: commercialImg,
      averagePrice: "3% commission",
      growth: "+22%",
      listings: 198,
      description: "Professional mediation for all land transactions",
      details: "Efficient processes with transparent fee structure"
    },
    {
      id: "10",
      name: "Bulk Land Brokerage",
      icon: Handshake,
      image: industrialImg,
      averagePrice: "2.5% commission",
      growth: "+18%",
      listings: 76,
      description: "Specialized services for large-scale land deals",
      details: "Volume discounts and expedited processing"
    }
  ],
  leasing: [
    {
      id: "4",
      name: "Agricultural Leasing",
      icon: Building,
      image: landLeasingImg,
      averagePrice: "KSh 12K/month",
      growth: "+16%",
      listings: 98,
      description: "Productive farmland for seasonal and long-term use",
      details: "Flexible terms with optional equipment inclusion"
    },
    {
      id: "11",
      name: "Commercial Land Lease",
      icon: Building,
      image: commercialImg,
      averagePrice: "KSh 25K/month",
      growth: "+19%",
      listings: 65,
      description: "Prime commercial plots for business development",
      details: "Strategic locations with high visibility and foot traffic"
    },
    {
      id: "12",
      name: "Event Space Leasing",
      icon: Building,
      image: residentialImg,
      averagePrice: "KSh 8K/day",
      growth: "+12%",
      listings: 43,
      description: "Spacious venues for events and temporary installations",
      details: "Flexible daily, weekly, and monthly rental options"
    }
  ],
  professionals: [
    {
      id: "13",
      name: "Architectural Services",
      icon: Building,
      image: commercialImg,
      averagePrice: "Project-based",
      growth: "+15%",
      listings: 45,
      description: "Expert architectural design and planning services",
      details: "Blueprints, 3D modeling, and approval processing"
    },
    {
      id: "14",
      name: "Valuation Experts",
      icon: DollarSign,
      image: landSellingImg,
      averagePrice: "Standard Rates",
      growth: "+10%",
      listings: 32,
      description: "Certified property and land valuation services",
      details: "Accurate market value assessment and reporting"
    },
    {
      id: "15",
      name: "Engineers",
      icon: TrendingUp,
      image: industrialImg,
      averagePrice: "Consultation",
      growth: "+18%",
      listings: 28,
      description: "Structural, civil, and electrical engineering solutions",
      details: "Professional design, analysis, and supervision"
    },
    {
      id: "16",
      name: "Contractors",
      icon: Users,
      image: landBuyingImg,
      averagePrice: "Contract-based",
      growth: "+20%",
      listings: 56,
      description: "Reliable building and construction contractors",
      details: "Residential and commercial project execution"
    },
    {
      id: "17",
      name: "Foremen",
      icon: Users,
      image: landLeasingImg,
      averagePrice: "Daily/Monthly",
      growth: "+12%",
      listings: 89,
      description: "Experienced site supervisors for your projects",
      details: "On-site management and team coordination"
    },
    {
      id: "18",
      name: "Clerks of Works",
      icon: Handshake,
      image: residentialImg,
      averagePrice: "Monthly Rate",
      growth: "+14%",
      listings: 24,
      description: "Independent quality control and site inspection",
      details: "Ensuring compliance with standards and specifications"
    },
    {
      id: "19",
      name: "Building Materials",
      icon: Home,
      image: agriculturalImg,
      averagePrice: "Market Rates",
      growth: "+25%",
      listings: 150,
      description: "Quality construction materials and supplies",
      details: "Sourcing and delivery of building essentials",
      href: "/shop/building-materials"
    }
  ]
};

const categoryLabels = {
  all: "All Services",
  selling: "Land Selling",
  buying: "Land Buying",
  brokerage: "Brokerage",
  leasing: "Land Leasing",
  professionals: "Certified Building Professionals"
};

export function LandServicesSection() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof landServicesData>("all");
  const navigate = useNavigate();

  const currentServices = landServicesData[activeCategory];

  const ServiceCard = ({ service, index }: { service: LandService; index: number }) => {
    const IconComponent = service.icon;

    return (
      <Card
        className="group hover:shadow-lg transition-all duration-300 animate-fade-in border-border/50 overflow-hidden w-full"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwVjE1MEgyMjVWMTAwSDE3NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyBpZD0iSWNvblNldF9JY29ucF9MaW5lX0NhbWVyYSIgZGF0YS1uYW1lPSJJY29uU2V0L0ljb25wL0xpbmUvQ2FtZXJhIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgM0gxNUwxNyA1SDIxQTIgMiAwIDAgMSAyMyA3VjE5QTIgMiAwIDAgMSAyMSAyMUgzQTIgMiAwIDAgMSAxIDE5VjdBMiAyIDAgMCAxIDMgNUg3TDkgM1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMyIgcj0iNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
              e.currentTarget.classList.add('bg-muted');
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {service.growth}
            </span>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground mb-2">
                  {service.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Average Rate</span>
              <span className="text-lg font-bold text-foreground flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {service.averagePrice}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Active Listings</span>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                <Users className="w-4 h-4" />
                {service.listings} available
              </span>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">{service.details}</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((parseInt(service.growth.replace('%', '').replace('+', '')) * 3), 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Market performance</p>
            </div>
            
            {service.id === "19" && (
              <div className="pt-4">
                <Button 
                  onClick={() => navigate(service.href || "/")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                >
                  <Building className="w-5 h-5" />
                  Shop Building Materials
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Land Services in <AnimatedCountyText />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive land solutions for selling, buying, brokerage, leasing, and certified building professionals with expert guidance and market insights
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={activeCategory === key ? "default" : "outline"}
                onClick={() => setActiveCategory(key as keyof typeof landServicesData)}
                className="px-6 py-2"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative px-4 sm:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {currentServices.map((service, index) => (
                <CarouselItem key={service.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <ServiceCard service={service} index={index} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 -translate-x-1/2 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white h-12 w-12 shadow-lg z-30 opacity-70 hover:opacity-100 transition-all duration-300" />
            <CarouselNext className="absolute right-0 translate-x-1/2 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-white h-12 w-12 shadow-lg z-30 opacity-70 hover:opacity-100 transition-all duration-300" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}