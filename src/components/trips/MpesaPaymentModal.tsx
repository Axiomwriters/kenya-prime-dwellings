import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface MpesaPaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: number;
    agentName: string;
    propertyCount: number;
    onSuccess: () => void;
}

export function MpesaPaymentModal({ open, onOpenChange, amount, agentName, propertyCount, onSuccess }: MpesaPaymentModalProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');

    const handlePayment = async () => {
        if (!phoneNumber.match(/^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/)) {
            toast.error("Invalid phone number", {
                description: "Please enter a valid Safaricom number."
            });
            return;
        }

        setLoading(true);
        setStep('processing');

        // Simulate API call to M-Pesa STK Push
        await new Promise(resolve => setTimeout(resolve, 3000));

        setLoading(false);
        setStep('success');
        
        // Simulate success callback
        setTimeout(() => {
            onSuccess();
            onOpenChange(false);
            setStep('input');
            setPhoneNumber("");
            toast.success("Payment Successful!", {
                description: `Trip with ${agentName} has been booked. Check your profile.`
            });
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs">
                            M
                        </span>
                        M-Pesa Checkout
                    </DialogTitle>
                    <DialogDescription>
                        Complete payment to book your viewing trip with <strong>{agentName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 'input' && (
                        <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-border/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Properties</span>
                                    <span className="font-medium">{propertyCount} Viewings</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Commitment Fee</span>
                                    <span className="font-medium">KSh {amount.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-border/50 my-2 pt-2 flex justify-between font-bold">
                                    <span>Total to Pay</span>
                                    <span className="text-green-600">KSh {amount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        placeholder="07XX XXX XXX"
                                        className="pl-9"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    You will receive an STK prompt on this number. Enter your PIN to complete the transaction.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center relative z-10">
                                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Check your phone</h3>
                                <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-1">
                                    We've sent an M-Pesa prompt to <strong>{phoneNumber}</strong>. Please verify and enter your PIN.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-green-700">Payment Confirmed!</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Your trip is booked. The agent has been notified.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 'input' && (
                        <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            Pay KSh {amount.toLocaleString()}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
