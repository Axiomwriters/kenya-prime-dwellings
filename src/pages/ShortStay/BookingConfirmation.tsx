import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageSquare, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
    const navigate = useNavigate();

    return (
        <div className="container max-w-3xl py-12 animate-fade-in flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-8">You're going to Nairobi! A confirmation email has been sent to you.</p>

            <Card className="w-full text-left mb-8 overflow-hidden">
                <div className="h-48 bg-muted relative">
                    <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-2xl font-bold">Modern Loft in Westlands</h2>
                        <p className="font-medium">Nov 15 – 20, 2024</p>
                    </div>
                </div>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    <div>
                        <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Check-in</p>
                        <p className="font-medium">Fri, Nov 15</p>
                        <p className="text-sm text-muted-foreground">After 2:00 PM</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Checkout</p>
                        <p className="font-medium">Wed, Nov 20</p>
                        <p className="text-sm text-muted-foreground">Before 11:00 AM</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground uppercase font-bold mb-1">Guests</p>
                        <p className="font-medium">1 guest</p>
                    </div>

                    <div className="md:col-span-3 pt-4 border-t">
                        <p className="text-sm text-muted-foreground uppercase font-bold mb-2">Address</p>
                        <p className="font-medium">Westlands Road, Nairobi, Kenya</p>
                        <p className="text-sm text-muted-foreground">Full address and access codes will be available 24 hours before check-in.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="gap-2" onClick={() => navigate("/short-stay/trips")}>
                    <Home className="w-4 h-4" /> Go to My Stays
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                    <MessageSquare className="w-4 h-4" /> Message Host
                </Button>
            </div>
        </div>
    );
}
