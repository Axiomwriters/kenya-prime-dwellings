import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, CreditCard, Smartphone, ShieldCheck, Star } from "lucide-react";

export default function BookingCheckout() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("card");

    // Mock Data
    const property = {
        title: "Modern Loft in Westlands with City Views",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
        rating: 4.8,
        reviews: 124,
        price: 8500,
    };

    const trip = {
        dates: "Nov 15 – 20",
        guests: "1 guest",
        nights: 5,
        cleaningFee: 1500,
        serviceFee: 2000,
    };

    const total = (property.price * trip.nights) + trip.cleaningFee + trip.serviceFee;

    const handlePayment = () => {
        // Simulate processing
        setTimeout(() => {
            navigate("/short-stay/confirmation");
        }, 1500);
    };

    return (
        <div className="container max-w-6xl py-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-8 cursor-pointer hover:underline" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-4 h-4" />
                <span className="font-medium">Request to book</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Trip & Payment */}
                <div className="space-y-8">
                    {/* Your Trip */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Your trip</h2>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium">Dates</h3>
                                <p className="text-muted-foreground">{trip.dates}</p>
                            </div>
                            <Button variant="link" className="font-semibold px-0">Edit</Button>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">Guests</h3>
                                <p className="text-muted-foreground">{trip.guests}</p>
                            </div>
                            <Button variant="link" className="font-semibold px-0">Edit</Button>
                        </div>
                    </section>

                    <Separator />

                    {/* Payment Method */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Pay with</h2>
                        <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="space-y-4">
                            {/* Credit Card */}
                            <div className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="cursor-pointer font-medium flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" /> Credit or Debit Card
                                    </Label>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            {/* M-Pesa */}
                            <div className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="mpesa" id="mpesa" />
                                    <Label htmlFor="mpesa" className="cursor-pointer font-medium flex items-center gap-2">
                                        <Smartphone className="w-5 h-5 text-green-600" /> M-Pesa
                                    </Label>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">FAST</span>
                            </div>

                            {/* PayPal */}
                            <div className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <Label htmlFor="paypal" className="cursor-pointer font-medium flex items-center gap-2">
                                        <span className="font-bold italic text-blue-600">PayPal</span>
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>

                        {/* Payment Details Form (Conditional) */}
                        {paymentMethod === 'card' && (
                            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <Input placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiration</Label>
                                        <Input placeholder="MM / YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVV</Label>
                                        <Input placeholder="123" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'mpesa' && (
                            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label>M-Pesa Phone Number</Label>
                                    <Input placeholder="07XX XXX XXX" />
                                    <p className="text-xs text-muted-foreground">You will receive a prompt on your phone to complete the payment.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Cancellation policy</h2>
                        <p className="text-muted-foreground mb-2"><span className="font-medium text-foreground">Free cancellation before Nov 10.</span> Cancel before check-in on Nov 15 for a partial refund.</p>
                    </section>

                    <Separator />

                    <Button size="lg" className="w-full text-lg h-12" onClick={handlePayment}>
                        Confirm and pay
                    </Button>
                </div>

                {/* Right Column: Price Details Card */}
                <div>
                    <Card className="sticky top-24 shadow-lg">
                        <CardHeader className="flex flex-row gap-4 space-y-0 pb-6">
                            <img src={property.image} alt="Property" className="w-28 h-28 object-cover rounded-lg" />
                            <div className="flex flex-col justify-between py-1">
                                <div>
                                    <p className="text-xs text-muted-foreground">Entire apartment</p>
                                    <p className="font-medium text-sm line-clamp-2">{property.title}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Star className="w-3 h-3 fill-primary text-primary" />
                                    <span className="font-medium">{property.rating}</span>
                                    <span className="text-muted-foreground">({property.reviews} reviews)</span>
                                </div>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Price details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="underline">KSh {property.price.toLocaleString()} x {trip.nights} nights</span>
                                    <span>KSh {(property.price * trip.nights).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="underline">Cleaning fee</span>
                                    <span>KSh {trip.cleaningFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="underline">Service fee</span>
                                    <span>KSh {trip.serviceFee.toLocaleString()}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-base">
                                    <span>Total (KES)</span>
                                    <span>KSh {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
