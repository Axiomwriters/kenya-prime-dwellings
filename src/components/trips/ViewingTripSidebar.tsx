import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Map, Trash2, Calendar as CalendarIcon, Clock, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { useTrip, TripProperty } from "@/contexts/TripContext";
import { Separator } from "@/components/ui/separator";
import { MpesaPaymentModal } from "./MpesaPaymentModal";
import { toast } from "sonner";

interface ViewingTripSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ViewingTripSidebar({ open, onOpenChange }: ViewingTripSidebarProps) {
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
        // Logic to clear these items or mark them as "booked" in a real app
        // For now, we'll just close the sidebar to simulate completion
        setTimeout(() => {
            setSidebarOpen(false);
        }, 500);
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:w-[450px] flex flex-col p-0 gap-0 border-l border-border/50 shadow-2xl">
                    <SheetHeader className="p-6 pb-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <SheetTitle className="flex items-center gap-2 text-xl">
                            <Map className="w-5 h-5 text-primary" />
                            Viewing Trip Builder
                        </SheetTitle>
                        <SheetDescription>
                            Group properties by agent to book efficient viewing trips.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-hidden flex flex-col bg-muted/5">
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-8">
                                {/* Empty State */}
                                {tripItems.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/20">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <Map className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-medium text-foreground mb-1">Your Itinerary is Empty</h3>
                                        <p className="text-sm max-w-[200px] mb-4">Start browsing properties and add them to your trip.</p>
                                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                                            Explore Properties
                                        </Button>
                                    </div>
                                )}

                                {/* Agent Groups */}
                                {Object.entries(agentGroups).map(([agentName, items]) => {
                                    const isReadyForBooking = items.length >= 5;
                                    const remaining = 5 - items.length;

                                    return (
                                        <div key={agentName} className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold">{agentName}</h4>
                                                        <p className="text-[10px] text-muted-foreground">{items.length} Properties Selected</p>
                                                    </div>
                                                </div>
                                                {isReadyForBooking ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-none flex gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> Ready to Book
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                                        Add {remaining} more
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Progress Bar for Agent Group */}
                                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isReadyForBooking ? 'bg-green-500' : 'bg-primary'}`}
                                                    style={{ width: `${(items.length / 5) * 100 > 100 ? 100 : (items.length / 5) * 100}%` }}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex gap-3 bg-card p-2 rounded-lg border shadow-sm group relative hover:shadow-md transition-all">
                                                        <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md object-cover" />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-semibold truncate leading-tight mb-1">{item.title}</h4>
                                                            <p className="text-xs text-muted-foreground truncate">{item.location}</p>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-xs font-semibold text-primary">{item.price}</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeFromTrip(item.id)}
                                                            className="h-7 w-7 absolute -top-2 -right-2 bg-background shadow-sm border rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white hover:border-destructive"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Booking Action for this Agent */}
                                            <div className="pt-2">
                                                {isReadyForBooking ? (
                                                    <Button
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                                                        onClick={() => handleBookTrip(agentName, items.length)}
                                                    >
                                                        Book Trip with {agentName.split(' ')[0]} (KSh 2,500) <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                ) : (
                                                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10 border-dashed">
                                                        <p className="text-xs text-muted-foreground">
                                                            Select <span className="font-bold text-primary">{remaining} more properties</span> from this agent to book a viewing trip.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <Separator className="mt-4" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Date Picker (Global) */}
                            {tripItems.length > 0 && (
                                <div className="space-y-3 mt-6">
                                    <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-primary" /> Preferred Viewing Date
                                    </h3>
                                    <div className="border rounded-xl p-3 flex justify-center bg-card shadow-sm">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md"
                                        />
                                    </div>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </SheetContent>
            </Sheet>

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
        </>
    );
}
