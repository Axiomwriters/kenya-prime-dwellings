import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Map,
    Calendar,
    Users,
    DollarSign,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    MessageCircle,
    ArrowUpRight,
    MapPin
} from "lucide-react";

// Mock Data for Trips
const mockTrips = [
    {
        id: "TRIP-204",
        name: "Westlands Luxury Tour",
        client: "John & Mary Doe",
        date: "Sat, 24th Oct",
        time: "10:00 AM - 1:00 PM",
        status: "confirmed",
        properties: 4,
        paymentStatus: "paid",
        fee: 3500
    },
    {
        id: "TRIP-205",
        name: "Kilimani Investment Scout",
        client: "Peter Kamau",
        date: "Tue, 27th Oct",
        time: "2:00 PM - 4:00 PM",
        status: "pending_payment",
        properties: 3,
        paymentStatus: "pending",
        fee: 3000
    },
    {
        id: "TRIP-206",
        name: "Runda Mansion Viewing",
        client: "Sarah Jenkins (Diaspora)",
        date: "Fri, 30th Oct",
        time: "11:00 AM",
        status: "inquiry",
        properties: 1,
        paymentStatus: "unpaid",
        fee: 0
    }
];

export function AgentTripsPanel() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Trip Management</h2>
                    <p className="text-muted-foreground">Manage viewings, logistics, and client itineraries.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Map className="w-4 h-4 mr-2" /> Create New Trip
                </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Trips</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {/* Stats Overview */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Trips (This Month)</CardTitle>
                                <Map className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">+2 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Trip Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">KSh 42,500</div>
                                <p className="text-xs text-muted-foreground">+15% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Show-up Rate</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">94%</div>
                                <p className="text-xs text-muted-foreground">High commitment</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">Action required</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trips List */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Trips</CardTitle>
                            <CardDescription>
                                You have {mockTrips.length} active trips scheduled.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockTrips.map((trip) => (
                                    <div
                                        key={trip.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-primary/10 rounded-full text-primary mt-1">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-base">{trip.name}</h4>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-[10px] capitalize
                                                            ${trip.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600' :
                                                                trip.status === 'pending_payment' ? 'bg-amber-500/10 text-amber-600' :
                                                                    'bg-blue-500/10 text-blue-600'
                                                            }`}
                                                    >
                                                        {trip.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5" /> {trip.client}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" /> {trip.date} • {trip.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Map className="w-3.5 h-3.5" /> {trip.properties} Properties
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-sm font-bold">{trip.fee > 0 ? `KSh ${trip.fee.toLocaleString()}` : 'Free'}</div>
                                                <div className={`text-xs ${trip.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {trip.paymentStatus === 'paid' ? 'Paid' : trip.paymentStatus === 'pending' ? 'Pending Payment' : 'No Fee'}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Other tabs can be implemented similarly */}
                <TabsContent value="upcoming">
                    <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/10 dashed">
                        <p className="text-muted-foreground">Showing Filtered Upcoming trips...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
