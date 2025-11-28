import { useState } from "react";
import { useParams } from "react-router-dom";
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
    ChevronDown
} from "lucide-react";

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
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=800&auto=format&fit=crop&q=60",
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
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [guests, setGuests] = useState(1);

    // Calculate total
    const nights = 5; // Mock duration
    const cleaningFee = 1500;
    const serviceFee = 2000;
    const total = (property.price * nights) + cleaningFee + serviceFee;

    return (
        <div className="container py-6 animate-fade-in">
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

            {/* Photo Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8 relative">
                <div className="md:col-span-2 md:row-span-2">
                    <img src={property.images[0]} alt="Main" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                </div>
                <div className="hidden md:block">
                    <img src={property.images[1]} alt="Sub 1" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                </div>
                <div className="hidden md:block">
                    <img src={property.images[2]} alt="Sub 2" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                </div>
                <div className="hidden md:block">
                    <img src={property.images[3]} alt="Sub 3" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                </div>
                <div className="hidden md:block relative">
                    <img src={property.images[4]} alt="Sub 4" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                    <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 gap-2">
                        Show all photos
                    </Button>
                </div>
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

                    {/* Calendar */}
                    <div className="pb-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">Select check-in date</h2>
                        <p className="text-muted-foreground text-sm mb-4">Add your travel dates for exact pricing</p>
                        <div className="bg-muted/20 rounded-xl p-4 w-fit">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow bg-background"
                            />
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
                                        <div className="text-sm">Nov 15</div>
                                    </div>
                                    <div className="p-3 hover:bg-muted/50 cursor-pointer">
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Checkout</div>
                                        <div className="text-sm">Nov 20</div>
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
                                onClick={() => window.location.href = `/short-stay/book/${property.id}`}
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
        </div>
    );
}
