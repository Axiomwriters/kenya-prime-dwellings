import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  Home,
  Calendar,
  Star,
  Building2,
  Clock
} from "lucide-react";

export function MockProfilePreview() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Contact Agent</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch with the listing agent for more information
          </p>
        </div>

        <div className="bg-background rounded-xl shadow-lg overflow-hidden border border-border/50">
          {/* Profile Header */}
          <div className="relative mb-6">
            <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 w-full" />

            <div className="px-8 pb-4">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl shrink-0">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Johnson" />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">SJ</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2 pt-2 md:pt-0 md:mb-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h1 className="text-3xl font-bold text-foreground">Sarah Johnson</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 w-fit border-green-200">
                      <CheckCircle className="w-3 h-3" /> Verified Agent
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Nairobi, Westlands
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined 2023
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      15 Active Listings
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto md:mb-4">
                  <Button className="flex-1 md:flex-none bg-[#25D366] hover:bg-[#20BA5A] text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dedicated real estate professional with over 5 years of experience in the Nairobi market.
                    Specializing in luxury residential properties and commercial spaces in Westlands and Kilimani.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Properties Sold</p>
                      <p className="text-sm text-muted-foreground">24+ (Last 12 months)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">Typically replies within 1 hr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Client Rating</p>
                      <p className="text-sm text-muted-foreground">4.9/5.0 (42 reviews)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="listings" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                  <TabsTrigger
                    value="listings"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Active Listings (2)
                  </TabsTrigger>
                  <TabsTrigger
                    value="sold"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Sold Properties
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="space-y-6">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {[1, 2].map((i) => (
                        <CarouselItem key={i} className="pl-4 md:basis-1/2">
                          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Home className="w-12 h-12 text-muted-foreground/50" />
                              </div>
                              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                                For Sale
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                Modern Apartment in Westlands
                              </h3>
                              <p className="text-xl font-bold text-primary mb-2">
                                KSh 15,000,000
                              </p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                                <MapPin className="w-4 h-4" />
                                Westlands, Nairobi
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>3 Beds</span>
                                <span>2 Baths</span>
                                <span>150 sqm</span>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-4">
                      <CarouselPrevious className="static translate-y-0" />
                      <CarouselNext className="static translate-y-0" />
                    </div>
                  </Carousel>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
