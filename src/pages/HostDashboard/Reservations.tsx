import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, DollarSign, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";

// Mock Data
const reservations = [
    {
        id: 1,
        guest: "John Doe",
        property: "Modern Loft in Westlands",
        checkIn: "2023-12-12",
        checkOut: "2023-12-15",
        nights: 3,
        guests: 2,
        total: 24000,
        status: "Confirmed",
        platform: "Airbnb",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        guest: "Jane Smith",
        property: "Cozy Studio near CBD",
        checkIn: "2023-12-14",
        checkOut: "2023-12-16",
        nights: 2,
        guests: 1,
        total: 12000,
        status: "Checked In",
        platform: "Booking.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        guest: "Mike Wilson",
        property: "Luxury Villa in Karen",
        checkIn: "2023-12-20",
        checkOut: "2023-12-27",
        nights: 7,
        guests: 6,
        total: 150000,
        status: "Pending",
        platform: "Direct",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60"
    }
];

export default function Reservations() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
                    <p className="text-muted-foreground">Track upcoming stays and manage bookings.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Export CSV</Button>
                    <Button>Create Booking</Button>
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="current">Currently Hosting</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="canceled">Canceled</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6 space-y-4">
                    {reservations.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Left Color Strip */}
                                <div className={`w-full md:w-2 h-2 md:h-auto ${booking.status === "Confirmed" ? "bg-green-500" :
                                        booking.status === "Pending" ? "bg-yellow-500" : "bg-blue-500"
                                    }`} />

                                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Guest Info */}
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={booking.avatar} />
                                            <AvatarFallback>{booking.guest[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg">{booking.guest}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="outline" className="text-xs font-normal">{booking.platform}</Badge>
                                                <span>• {booking.guests} Guests</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Check-in
                                            </p>
                                            <p className="font-medium">{booking.checkIn}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Duration
                                            </p>
                                            <p className="font-medium">{booking.nights} Nights</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" /> Total Payout
                                            </p>
                                            <p className="font-medium">KSh {booking.total.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        <div className="text-right mr-4">
                                            <Badge className={
                                                booking.status === "Confirmed" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                    booking.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                                                        "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                            }>
                                                {booking.status}
                                            </Badge>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="current">
                    <div className="p-8 text-center text-muted-foreground">No active stays right now.</div>
                </TabsContent>
                <TabsContent value="past">
                    <div className="p-8 text-center text-muted-foreground">No past stays to show.</div>
                </TabsContent>
                <TabsContent value="canceled">
                    <div className="p-8 text-center text-muted-foreground">No canceled bookings.</div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
