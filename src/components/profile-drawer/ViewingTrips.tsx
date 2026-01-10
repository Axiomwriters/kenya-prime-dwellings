import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, DollarSign, Download, MapPin, MessageCircle, MoreHorizontal, Navigation } from "lucide-react";

export function ViewingTrips() {
    // Mock Data
    const trips = [
        {
            id: 1,
            name: "Westlands Apartment Hunt",
            status: "Confirmed",
            agent: "Sarah Wanjiku",
            date: "Jan 12 - Jan 14",
            seen: 5,
            total: 7,
            paymentStatus: "Paid",
            balance: 0
        },
        {
            id: 2,
            name: "Kilimani Investment Scouting",
            status: "Pending",
            agent: "David Kamau",
            date: "Jan 20",
            seen: 0,
            total: 4,
            paymentStatus: "Due",
            balance: 1500
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    My Viewing Trips
                </h3>
                <Button variant="link" className="h-auto p-0 text-xs text-primary">View All</Button>
            </div>

            <div className="space-y-3">
                {trips.map((trip) => (
                    <Card key={trip.id} className="p-4 bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all hover:bg-card/80">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-medium text-sm text-foreground">{trip.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{trip.date}</span>
                                </div>
                            </div>
                            <Badge
                                variant={trip.status === "Confirmed" ? "secondary" : "outline"}
                                className={trip.status === "Confirmed" ? "bg-green-500/10 text-green-600 border-green-500/20" : "text-yellow-600 border-yellow-500/20 bg-yellow-500/10"}
                            >
                                {trip.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-background/50 rounded-md p-2 border border-border/50">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold block mb-0.5">Properties</span>
                                <span className="text-sm font-medium">{trip.seen} of {trip.total} seen</span>
                            </div>
                            <div className="bg-background/50 rounded-md p-2 border border-border/50">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold block mb-0.5">Fees</span>
                                {trip.paymentStatus === "Paid" ? (
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <CheckCircle className="w-3 h-3" /> Paid
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                                        <DollarSign className="w-3 h-3" /> Due: KSh {trip.balance}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1 border-primary/20 hover:bg-primary/5 hover:text-primary">
                                <MapPin className="w-3 h-3 mr-1.5" /> Itinerary
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1 border-primary/20 hover:bg-primary/5 hover:text-primary">
                                <MessageCircle className="w-3 h-3 mr-1.5" /> Chat Agent
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
