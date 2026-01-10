import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Download, FileText, Wallet } from "lucide-react";

export function PaymentsCenter() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    Payments & Commitments
                </h3>
            </div>

            <Card className="p-4 bg-gradient-to-br from-card to-background border-primary/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Invested</p>
                        <h4 className="text-xl font-bold font-mono">KSh 45,000</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm p-2 bg-background/50 rounded border border-border/50">
                        <span className="text-muted-foreground">Trip Fees</span>
                        <span className="font-medium">KSh 5,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 bg-background/50 rounded border border-border/50">
                        <span className="text-muted-foreground">Booking Deposits</span>
                        <span className="font-medium">KSh 40,000</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-primary">Buying Journey</span>
                        <span className="text-muted-foreground">70% Complete</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[70%] rounded-full" />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center pt-1">You are almost there! Next step: Finalize Mortgage.</p>
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs h-8 border-dashed">
                    <FileText className="w-3 h-3 mr-1.5 text-muted-foreground" /> Receipts
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs h-8 border-dashed">
                    <Download className="w-3 h-3 mr-1.5 text-muted-foreground" /> Statement
                </Button>
            </div>
        </div>
    );
}
