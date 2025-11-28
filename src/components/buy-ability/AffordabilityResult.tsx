import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface AffordabilityResultProps {
    affordableAmount: number;
    monthlyPayment: number;
    ltv: number;
    onGetMatched: () => void;
    onRecalculate: () => void;
}

export function AffordabilityResult({
    affordableAmount,
    monthlyPayment,
    ltv,
    onGetMatched,
    onRecalculate,
}: AffordabilityResultProps) {
    const isGoodLTV = ltv <= 80;
    const isHighLTV = ltv > 90;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">You can afford a property up to</h3>
                <div className="text-4xl font-bold text-primary">
                    KSh {affordableAmount.toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="text-sm text-muted-foreground">Estimated Monthly Payment</div>
                    <div className="text-2xl font-semibold">
                        KSh {monthlyPayment.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Based on current average rates (13.5%)
                    </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="text-sm text-muted-foreground flex justify-between">
                        <span>Loan to Value (LTV)</span>
                        <span className={isGoodLTV ? "text-green-500" : isHighLTV ? "text-orange-500" : "text-blue-500"}>
                            {ltv}%
                        </span>
                    </div>
                    <Progress value={ltv} className="h-2" />
                    <div className="text-xs flex items-start gap-1.5 mt-1">
                        {isGoodLTV ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5" />
                        )}
                        <span className="text-muted-foreground">
                            {isGoodLTV
                                ? "Great! You have a healthy deposit."
                                : "A higher deposit could get you better rates."}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-4 space-y-3">
                <Button onClick={onGetMatched} className="w-full h-11 text-lg gap-2">
                    See Matched Lenders <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={onRecalculate} className="w-full">
                    Adjust Numbers
                </Button>
            </div>
        </div>
    );
}
