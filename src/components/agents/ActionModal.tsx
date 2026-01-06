import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'covered' | 'stretch';
    property: any;
}

export const ActionModal = ({ isOpen, onClose, type, property }: ActionModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            const message = type === 'covered'
                ? "Agent connection request sent! They will contact you shortly."
                : "Pre-qualification request sent to lender! Expect a call soon.";
            toast.success(message);
        }, 1500);
    };

    if (!property) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {type === 'covered' ? (
                            <>
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                Great Match!
                            </>
                        ) : (
                            <>
                                <Zap className="w-6 h-6 text-amber-500" />
                                Stretch Your Budget
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {type === 'covered'
                            ? "This home fits perfectly within your calculated budget. Take the next step securely."
                            : "This home is slightly above your current limit, but partners like Equity Bank can help you bridge the gap."
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Lender Match Section */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">
                        {type === 'covered' ? "Best Mortgage Match" : "Recommended Solution"}
                    </h4>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-800">
                                {type === 'covered' ? "KCB" : "EQ"}
                            </div>
                            <div>
                                <p className="font-medium text-white">{type === 'covered' ? "KCB Home Loan" : "Jenga Plus"}</p>
                                <p className="text-xs text-slate-400">{type === 'covered' ? "12.5% Interest • Fixed" : "Up to 105% Financing"}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-950/30">
                            {type === 'covered' ? "Pre-Approvable" : "High Approval Chance"}
                        </Badge>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Your Name</Label>
                        <Input id="name" placeholder="John Doe" className="bg-slate-900 border-slate-800 focus:ring-emerald-500" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                        <Input id="phone" placeholder="+254 7..." className="bg-slate-900 border-slate-800 focus:ring-emerald-500" required />
                    </div>

                    {type === 'covered' && (
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-slate-300">Message to Agent</Label>
                            <Textarea
                                id="message"
                                defaultValue={`I'm interested in ${property.title}. Please contact me to schedule a viewing.`}
                                className="bg-slate-900 border-slate-800 focus:ring-emerald-500 min-h-[80px]"
                            />
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`w-full ${type === 'covered' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                "Sending..."
                            ) : (
                                type === 'covered' ? "Connect with Agent" : "Check Eligibility"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
