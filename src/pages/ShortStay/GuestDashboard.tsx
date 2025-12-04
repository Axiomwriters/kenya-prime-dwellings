import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MessageSquare, ChevronRight, Heart } from "lucide-react";

export default function GuestDashboard() {
    const navigate = useNavigate();

    // Mock Data
    const trips = [
        {
            id: 1,
            property: "Modern Loft in Westlands",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
            dates: "Nov 15 – 20, 2024",
            status: "upcoming",
            host: "Sarah",
        },
        {
            id: 2,
            property: "Beachfront Condo in Nyali",
            image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop&q=60",
            dates: "Aug 10 – 15, 2024",
            status: "completed",
            host: "James",
        },
        {
            id: 3,
            property: "Cozy Studio near CBD",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
            dates: "Jun 01 – 05, 2024",
            status: "canceled",
            host: "David",
        },
    ];

    return (
        <div className="container py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Stays</h1>

            <Tabs defaultValue="upcoming" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="canceled">Canceled</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {trips.filter(t => t.status === 'upcoming').length > 0 ? (
                        trips.filter(t => t.status === 'upcoming').map((trip) => (
                            <TripCard key={trip.id} trip={trip} navigate={navigate} />
                        ))
                    ) : (
                        <EmptyState message="No upcoming stays booked... yet!" action="Start exploring" onAction={() => navigate("/short-stay")} />
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {trips.filter(t => t.status === 'completed').map((trip) => (
                        <TripCard key={trip.id} trip={trip} navigate={navigate} />
                    ))}
                </TabsContent>

                <TabsContent value="canceled" className="space-y-4">
                    {trips.filter(t => t.status === 'canceled').map((trip) => (
                        <TripCard key={trip.id} trip={trip} navigate={navigate} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TripCard({ trip, navigate }: { trip: any, navigate: any }) {
    return (
        <Card className="flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/short-stay/trips/${trip.id}`)}>
            <div className="w-full md:w-64 h-48 md:h-auto bg-muted relative">
                <img src={trip.image} alt={trip.property} className="w-full h-full object-cover" />
                <Badge className={`absolute top-3 left-3 ${trip.status === 'upcoming' ? 'bg-green-500' :
                    trip.status === 'completed' ? 'bg-gray-500' : 'bg-red-500'
                    }`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-semibold mb-1">{trip.property}</h3>
                    <p className="text-muted-foreground mb-4">Hosted by {trip.host}</p>

                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{trip.dates}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>Nairobi, Kenya</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
                        <MessageSquare className="w-4 h-4 mr-2" /> Message Host
                    </Button>
                    {trip.status === 'upcoming' && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/short-stay/trips/${trip.id}`) }}>
                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

function EmptyState({ message, action, onAction }: { message: string, action: string, onAction: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl border-dashed">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">{message}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">Time to dust off your bags and start planning your next adventure.</p>
            <Button onClick={onAction}>{action}</Button>
        </div>
    )
}
