import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    MapPin,
    Key,
    Wifi,
    MessageSquare,
    Phone,
    FileText,
    Star
} from "lucide-react";

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data - In real app fetch by ID
    const trip = {
        id: 1,
        property: "Modern Loft in Westlands",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
        dates: "Nov 15 – 20, 2024",
        checkIn: "Fri, Nov 15 (2:00 PM)",
        checkOut: "Wed, Nov 20 (11:00 AM)",
        address: "Westlands Road, Nairobi, Kenya",
        host: {
            name: "Sarah",
            phone: "+254 700 000 000",
            image: "https://github.com/shadcn.png"
        },
        accessCode: "4829",
        wifiName: "WestlandsLoft_5G",
        wifiPass: "Safari2024",
        status: "upcoming" // or 'completed'
    };

    return (
        <div className="container max-w-4xl py-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-6 cursor-pointer hover:underline text-muted-foreground" onClick={() => navigate("/short-stay/trips")}>
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Stays</span>
            </div>

            {/* Hero Section */}
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
                <img src={trip.image} alt={trip.property} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                    <Badge className="mb-2 bg-green-500 hover:bg-green-600 border-none">Confirmed</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{trip.property}</h1>
                    <p className="text-lg opacity-90">{trip.dates}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Trip Info */}
                <div className="md:col-span-2 space-y-8">

                    {/* Check-in / Check-out */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Check-in</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-bold">{trip.checkIn.split('(')[0]}</p>
                                <p className="text-sm text-muted-foreground">{trip.checkIn.split('(')[1].replace(')', '')}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Checkout</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-bold">{trip.checkOut.split('(')[0]}</p>
                                <p className="text-sm text-muted-foreground">{trip.checkOut.split('(')[1].replace(')', '')}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Access Info */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-primary" /> Access Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                <div>
                                    <p className="font-medium">Smart Lock Code</p>
                                    <p className="text-xs text-muted-foreground">Enter this code on the keypad</p>
                                </div>
                                <span className="text-xl font-mono font-bold tracking-widest">{trip.accessCode}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                <div>
                                    <p className="font-medium">WiFi Password</p>
                                    <p className="text-xs text-muted-foreground">Network: {trip.wifiName}</p>
                                </div>
                                <span className="font-mono font-bold">{trip.wifiPass}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Directions */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> Getting there
                        </h2>
                        <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border">
                            <p className="text-muted-foreground">Map Component Placeholder</p>
                        </div>
                        <p className="mt-4 text-muted-foreground">
                            {trip.address}
                        </p>
                        <Button variant="outline" className="mt-2">Get Directions</Button>
                    </div>

                    <Separator />

                    {/* House Manual */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" /> House Manual
                        </h2>
                        <div className="space-y-2">
                            <details className="group border rounded-lg p-4 cursor-pointer">
                                <summary className="font-medium flex justify-between items-center">
                                    How to use the TV
                                    <ChevronLeft className="w-4 h-4 rotate-180 group-open:rotate-[-90deg] transition-transform" />
                                </summary>
                                <p className="mt-2 text-muted-foreground text-sm">Use the Samsung remote to access Netflix and YouTube. Press the Home button to switch apps.</p>
                            </details>
                            <details className="group border rounded-lg p-4 cursor-pointer">
                                <summary className="font-medium flex justify-between items-center">
                                    Garbage Disposal
                                    <ChevronLeft className="w-4 h-4 rotate-180 group-open:rotate-[-90deg] transition-transform" />
                                </summary>
                                <p className="mt-2 text-muted-foreground text-sm">Trash chute is located at the end of the hallway. Please separate recyclables.</p>
                            </details>
                        </div>
                    </div>

                </div>

                {/* Right Column: Host & Support */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Host</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <img src={trip.host.image} alt={trip.host.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold">{trip.host.name}</p>
                                    <p className="text-xs text-muted-foreground">Joined 2021</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="w-full gap-2">
                                    <MessageSquare className="w-4 h-4" /> Message
                                </Button>
                                <Button variant="outline" className="w-full gap-2">
                                    <Phone className="w-4 h-4" /> Call
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start h-auto py-3">
                                <div className="text-left">
                                    <p className="font-medium">Help Center</p>
                                    <p className="text-xs text-muted-foreground">Get help with your reservation</p>
                                </div>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start h-auto py-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <div className="text-left">
                                    <p className="font-medium">Cancel Reservation</p>
                                    <p className="text-xs opacity-70">See cancellation policy</p>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
