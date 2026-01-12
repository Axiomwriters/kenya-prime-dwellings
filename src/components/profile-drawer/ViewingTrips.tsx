import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, Clock, DollarSign, MapPin, MessageCircle, MoreHorizontal, Navigation, User, Trash2, CheckCircle2, ArrowRight, Calendar as CalendarIcon, Map } from "lucide-react";
import { useTrip, TripProperty } from "@/contexts/TripContext";
import { MpesaPaymentModal } from "@/components/trips/MpesaPaymentModal";
import { Separator } from "@/components/ui/separator";

export function ViewingTrips() {
    // Active Trip Builder Logic
    const { tripItems, removeFromTrip, setSidebarOpen } = useTrip();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedAgentForBooking, setSelectedAgentForBooking] = useState<{ name: string, count: number } | null>(null);

    // Group items by agent
    const agentGroups = useMemo(() => {
        const groups: { [key: string]: TripProperty[] } = {};
        tripItems.forEach(item => {
            const agentName = item.agent || "Unknown Agent";
            if (!groups[agentName]) {
                groups[agentName] = [];
            }
            groups[agentName].push(item);
        });
        return groups;
    }, [tripItems]);

    const handleBookTrip = (agentName: string, count: number) => {
        setSelectedAgentForBooking({ name: agentName, count });
        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        // Logic to clear items would go here
        // For now preventing sidebar close to keep context in drawer
    };

    // Past Trips Mock Data (History)
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
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    Trip Builder & History
                </h3>
            </div>

            {/* --- ACTIVE TRIP BUILDER SECTION --- */}
            <div className="space-y-4">
                {tripItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/20">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <Map className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-medium text-foreground text-sm mb-1">Itinerary Empty</h3>
                        <p className="text-xs max-w-[180px]">Add properties to build a viewing trip.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(agentGroups).map(([agentName, items]) => {
                            const isReadyForBooking = items.length >= 5;
                            const remaining = 5 - items.length;

                            return (
                                <div key={agentName} className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-xl bg-muted/50 p-3 border border-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">{agentName}</h4>
                                                <p className="text-[10px] text-muted-foreground">{items.length} Properties</p>
                                            </div>
                                        </div>
                                        {isReadyForBooking ? (
                                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-none flex gap-1 h-6">
                                                <CheckCircle2 className="w-3 h-3" /> Ready
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] h-6 text-muted-foreground">
                                                Add {remaining}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${isReadyForBooking ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: `${(items.length / 5) * 100 > 100 ? 100 : (items.length / 5) * 100}%` }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3 bg-card p-2 rounded-lg border shadow-sm group relative hover:shadow-md transition-all">
                                                <img src={item.image} alt={item.title} className="w-12 h-12 rounded-md object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-semibold truncate leading-tight mb-1">{item.title}</h4>
                                                    <p className="text-[10px] text-muted-foreground truncate">{item.location}</p>
                                                    <div className="flex items-center justify-between mt-0.5">
                                                        <span className="text-[10px] font-semibold text-primary">{item.price}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFromTrip(item.id)}
                                                    className="h-6 w-6 absolute -top-1.5 -right-1.5 bg-background shadow-sm border rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white hover:border-destructive"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Booking Action */}
                                    <div className="pt-2">
                                        {isReadyForBooking ? (
                                            <Button
                                                className="w-full h-9 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 text-xs"
                                                onClick={() => handleBookTrip(agentName, items.length)}
                                            >
                                                Book Trip (KSh 2,500) <ArrowRight className="w-3 h-3 ml-2" />
                                            </Button>
                                        ) : (
                                            <div className="text-center p-2 bg-primary/5 rounded-lg border border-primary/10 border-dashed">
                                                <p className="text-[10px] text-muted-foreground">
                                                    Select <span className="font-bold text-primary">{remaining} more</span> to book.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Date Picker */}
                        <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                            <h3 className="text-xs font-medium text-foreground flex items-center gap-2">
                                <CalendarIcon className="w-3 h-3 text-primary" /> Preferred Date
                            </h3>
                            <div className="border rounded-xl p-2 flex justify-center bg-card shadow-sm scale-90 origin-top-left w-full">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Separator className="bg-border/50" />

            {/* --- TRIP HISTORY SECTION --- */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        My History
                    </h4>
                    <Button variant="link" className="h-auto p-0 text-[10px] text-primary">View All</Button>
                </div>
                {trips.map((trip) => (
                    <Card key={trip.id} className="p-4 bg-card hover:bg-muted/50 transition-all border border-border/50">
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
                            <div className="bg-muted/50 rounded-md p-2 border border-border/50">
                                <span className="text-[10px] uppercase text-muted-foreground font-semibold block mb-0.5">Properties</span>
                                <span className="text-sm font-medium">{trip.seen} of {trip.total} seen</span>
                            </div>
                            <div className="bg-muted/50 rounded-md p-2 border border-border/50">
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

            {selectedAgentForBooking && (
                <MpesaPaymentModal
                    open={paymentModalOpen}
                    onOpenChange={setPaymentModalOpen}
                    amount={2500}
                    agentName={selectedAgentForBooking.name}
                    propertyCount={selectedAgentForBooking.count}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
