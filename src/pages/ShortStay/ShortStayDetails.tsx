import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Star,
    MapPin,
    Share,
    Heart,
    Wifi,
    Car,
    Utensils,
    Wind,
    Tv,
    Coffee,
    CheckCircle2,
    ShieldCheck,
    User,
    Minus,
    Plus,
    ChevronDown,
    ArrowLeft,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { LocationCarousel } from "@/components/short-stay/LocationCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Mock Data (In a real app, fetch based on ID)
const property = {
    id: 1,
    title: "Modern Loft in Westlands with City Views",
    location: "Westlands, Nairobi, Kenya",
    price: 8500,
    rating: 4.8,
    reviews: 124,
    description: "Experience the best of Nairobi in this stylish, modern loft located in the heart of Westlands. Featuring floor-to-ceiling windows, a fully equipped kitchen, and high-speed WiFi, it's perfect for business travelers and couples. Enjoy the rooftop pool and gym access.",
    host: {
        name: "Sarah",
        image: "https://github.com/shadcn.png",
        joined: "Joined May 2021",
        superhost: true,
    },
    images: [
        { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80", category: "Living Room" },
        { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60", category: "Living Room" },
        { url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop&q=60", category: "Bedroom" },
        { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=60", category: "Bedroom" },
        { url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop&q=60", category: "Kitchen" },
        { url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60", category: "Kitchen" },
        { url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=60", category: "Bathroom" },
        { url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&auto=format&fit=crop&q=60", category: "Bathroom" },
        { url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=60", category: "View" },
        { url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=60", category: "Exterior" },
    ],
    amenities: [
        { name: "Fast WiFi", icon: Wifi },
        { name: "Free parking", icon: Car },
        { name: "Kitchen", icon: Utensils },
        { name: "Air conditioning", icon: Wind },
        { name: "HDTV with Netflix", icon: Tv },
        { name: "Coffee maker", icon: Coffee },
    ],
    rules: [
        "Check-in after 2:00 PM",
        "Checkout before 11:00 AM",
        "No smoking",
        "No parties or events",
    ],
};

export default function ShortStayDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to top when ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
    const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000));
    const [guests, setGuests] = useState(1);
    // const carouselRef = useRef<HTMLDivElement>(null); // Removed unused ref

    // Removed unused scroll function

    // Calculate total
    const nights = checkInDate && checkOutDate
        ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
        : 5;
    const cleaningFee = 1500;
    const serviceFee = 2000;
    const total = (property.price * nights) + cleaningFee + serviceFee;

    return (
        <div className="container py-6 animate-fade-in">
            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mb-4 -ml-2 hover:bg-muted"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm md:text-base">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-medium">{property.rating}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="underline cursor-pointer">{property.reviews} reviews</span>
                        <span className="text-muted-foreground">·</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="underline cursor-pointer">{property.location}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Share className="w-4 h-4" /> Share
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Heart className="w-4 h-4" /> Save
                        </Button>
                    </div>
                </div>
            </div>

            {/* Photo Carousel */}
            <div className="relative mb-8 group">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {property.images.map((image, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                                <div
                                    className="relative w-full h-[300px] md:h-[350px] rounded-xl overflow-hidden group/image cursor-pointer"
                                >
                                    <img
                                        src={image.url}
                                        alt={image.category}
                                        className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-3 left-3">
                                        <Badge className="bg-black/60 text-white hover:bg-black/70 backdrop-blur-sm border-none">
                                            {image.category}
                                        </Badge>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm border-none opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm border-none opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0" />
                </Carousel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Host Info */}
                    <div className="flex justify-between items-center pb-6 border-b">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Hosted by {property.host.name}</h2>
                            <p className="text-muted-foreground text-sm">Superhost · {property.host.joined}</p>
                        </div>
                        <Avatar className="w-14 h-14 border">
                            <AvatarImage src={property.host.image} />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-4 pb-6 border-b">
                        <div className="flex gap-4">
                            <div className="mt-1"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                            <div>
                                <h3 className="font-medium">Self check-in</h3>
                                <p className="text-muted-foreground text-sm">Check yourself in with the smart lock.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><Star className="w-6 h-6 text-primary" /></div>
                            <div>
                                <h3 className="font-medium">Experienced host</h3>
                                <p className="text-muted-foreground text-sm">{property.host.name} has 124 reviews for other places.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><MapPin className="w-6 h-6 text-primary" /></div>
                            <div>
                                <h3 className="font-medium">Great location</h3>
                                <p className="text-muted-foreground text-sm">95% of recent guests gave the location a 5-star rating.</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="pb-6 border-b">
                        <p className="leading-relaxed text-muted-foreground">
                            {property.description}
                        </p>
                        <Button variant="link" className="px-0 mt-2 font-semibold">Show more <ChevronDown className="w-4 h-4 ml-1" /></Button>
                    </div>

                    {/* Amenities */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">What this place offers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {property.amenities.map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-muted-foreground" />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="mt-6">Show all 32 amenities</Button>
                    </div>

                    {/* Location Map */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">Where you'll be</h2>
                        <Card className="overflow-hidden border-muted">
                            <div className="relative w-full h-[400px] bg-muted/10">
                                {/* Google Maps Placeholder */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-8">
                                    <MapPin className="w-16 h-16 mb-4 text-primary" />
                                    <p className="text-lg font-medium mb-2">Google Maps Integration</p>
                                    <p className="text-sm text-center max-w-md">
                                        This will display the exact location when connected to Google Maps API
                                    </p>
                                    <div className="mt-4 px-4 py-2 bg-background border rounded-lg">
                                        <p className="text-xs font-mono">{property.location}</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{property.location}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        The exact location will be provided after booking confirmation.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Calendar */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">Select your dates</h2>
                        <p className="text-muted-foreground text-sm mb-4">Add your travel dates for exact pricing</p>

                        {/* Mobile: Single Range Calendar */}
                        <div className="lg:hidden bg-muted/20 rounded-xl p-4 w-fit">
                            <Calendar
                                mode="range"
                                selected={{
                                    from: checkInDate,
                                    to: checkOutDate
                                }}
                                onSelect={(range) => {
                                    if (range?.from) {
                                        setCheckInDate(range.from);
                                    }
                                    if (range?.to) {
                                        setCheckOutDate(range.to);
                                    }
                                }}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                numberOfMonths={1}
                                className="rounded-md border shadow bg-background"
                            />
                        </div>

                        {/* Desktop: Dual Calendars */}
                        <div className="hidden lg:grid grid-cols-2 gap-6">
                            {/* Check-in Calendar */}
                            <div className="bg-muted/20 rounded-xl p-4 w-fit">
                                <h3 className="text-sm font-semibold mb-3">Check-in date</h3>
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={(date) => {
                                        setCheckInDate(date);
                                        // If checkout is before or same as new checkin, adjust it
                                        if (date && checkOutDate && checkOutDate <= date) {
                                            const newCheckout = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                                            setCheckOutDate(newCheckout);
                                        }
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="rounded-md border shadow bg-background"
                                />
                            </div>

                            {/* Checkout Calendar */}
                            <div className="bg-muted/20 rounded-xl p-4 w-fit">
                                <h3 className="text-sm font-semibold mb-3">Checkout date</h3>
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={setCheckOutDate}
                                    disabled={(date) => {
                                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                                        if (date < today) return true;
                                        if (!checkInDate) return false;
                                        // Disable dates on or before check-in date
                                        return date <= checkInDate;
                                    }}
                                    className="rounded-md border shadow bg-background"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="relative">
                    <Card className="sticky top-24 shadow-lg border-muted-foreground/20">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-end">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">KSh {property.price.toLocaleString()}</span>
                                    <span className="text-muted-foreground">night</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-3 h-3 fill-primary text-primary" />
                                    <span className="font-medium">{property.rating}</span>
                                    <span className="text-muted-foreground underline">({property.reviews} reviews)</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Date/Guest Inputs */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-2 border-b">
                                    <div className="p-3 border-r hover:bg-muted/50 cursor-pointer">
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Check-in</div>
                                        <div className="text-sm">
                                            {checkInDate ? checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add date'}
                                        </div>
                                    </div>
                                    <div className="p-3 hover:bg-muted/50 cursor-pointer">
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Checkout</div>
                                        <div className="text-sm">
                                            {checkOutDate ? checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add date'}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
                                    <div>
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Guests</div>
                                        <div className="text-sm">{guests} guest{guests > 1 ? 's' : ''}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)) }} disabled={guests <= 1}><Minus className="w-3 h-3" /></Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={(e) => { e.stopPropagation(); setGuests(guests + 1) }}><Plus className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                                onClick={() => navigate(`/short-stay/book/${property.id}`)}
                            >
                                Reserve
                            </Button>

                            <p className="text-center text-xs text-muted-foreground">You won't be charged yet</p>

                            {/* Price Breakdown */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="underline">KSh {property.price.toLocaleString()} x {nights} nights</span>
                                    <span>KSh {(property.price * nights).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="underline">Cleaning fee</span>
                                    <span>KSh {cleaningFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="underline">Service fee</span>
                                    <span>KSh {serviceFee.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>KSh {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-4 flex justify-center gap-2 text-muted-foreground text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="underline">Report this listing</span>
                    </div>
                </div>
            </div>

            <Separator className="my-12" />

            {/* Reviews Section */}
            <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 fill-primary text-primary" />
                    {property.rating} · {property.reviews} reviews
                </h2>

                {/* Rating Breakdown Mock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
                    {["Cleanliness", "Accuracy", "Communication", "Location", "Check-in", "Value"].map(cat => (
                        <div key={cat} className="flex items-center justify-between">
                            <span className="text-sm">{cat}</span>
                            <div className="flex items-center gap-2 w-1/2">
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[95%]"></div>
                                </div>
                                <span className="text-xs font-bold">4.9</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">Jane Doe</h4>
                                    <p className="text-xs text-muted-foreground">Oct 2024</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                "Absolutely loved our stay! The place was exactly as described, super clean, and the view was breathtaking. Sarah was a fantastic host."
                            </p>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="mt-8">Show all {property.reviews} reviews</Button>
            </div>

            <Separator className="my-12" />

            {/* Location Map */}
            {/* Similar Listings */}
            <div className="mb-12">
                <LocationCarousel
                    title="Similar homes you may like"
                    properties={[
                        {
                            id: 101,
                            title: "Cozy Studio in Kileleshwa",
                            location: "Kileleshwa, Nairobi",
                            price: 4500,
                            rating: 4.8,
                            reviews: 85,
                            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
                            type: "Apartment",
                            beds: 1,
                            superhost: false,
                            badgeLabel: "Budget friendly"
                        },
                        {
                            id: 102,
                            title: "Luxury 2BR in Kilimani",
                            location: "Kilimani, Nairobi",
                            price: 9500,
                            rating: 4.9,
                            reviews: 120,
                            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
                            type: "Apartment",
                            beds: 2,
                            superhost: true,
                            badgeLabel: "Most booked"
                        },
                        {
                            id: 103,
                            title: "Modern Loft near CBD",
                            location: "CBD, Nairobi",
                            price: 6000,
                            rating: 4.7,
                            reviews: 45,
                            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=60",
                            type: "Loft",
                            beds: 1,
                            superhost: false,
                            badgeLabel: "New"
                        },
                        {
                            id: 104,
                            title: "Spacious Villa in Karen",
                            location: "Karen, Nairobi",
                            price: 15000,
                            rating: 5.0,
                            reviews: 200,
                            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60",
                            type: "Villa",
                            beds: 4,
                            superhost: true,
                            badgeLabel: "Guest favorite"
                        }
                    ]}
                />
            </div>
        </div>
    );
}
