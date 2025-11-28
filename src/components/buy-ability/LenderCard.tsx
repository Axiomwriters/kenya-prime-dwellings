import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Percent } from "lucide-react";

export interface LenderProps {
    name: string;
    logo: string;
    interestRate: number;
    maxLTV: number;
    minDeposit: number;
    badges: string[];
    turnaroundTime: string;
    fees: string;
    onSelect: () => void;
}

export function LenderCard({
    name,
    logo,
    interestRate,
    maxLTV,
    minDeposit,
    badges,
    turnaroundTime,
    fees,
    onSelect,
}: LenderProps) {
    return (
        <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {/* Placeholder for logo if image fails or is not provided */}
                        {logo ? (
                            <img src={logo} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-bold text-primary">{name.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {badges.map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{interestRate}%</div>
                    <div className="text-xs text-muted-foreground">Interest Rate</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                    <div className="text-muted-foreground">Max LTV</div>
                    <div className="font-medium">{maxLTV}%</div>
                </div>
                <div>
                    <div className="text-muted-foreground">Min Deposit</div>
                    <div className="font-medium">{minDeposit}%</div>
                </div>
                <div>
                    <div className="text-muted-foreground">Turnaround</div>
                    <div className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {turnaroundTime}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                    Fees: {fees}
                </div>
                <Button onClick={onSelect} size="sm">
                    Apply for Pre-Approval
                </Button>
            </div>
        </div>
    );
}
