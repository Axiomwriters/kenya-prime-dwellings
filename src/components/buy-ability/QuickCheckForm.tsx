import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuickCheckFormProps {
    onCalculate: (data: QuickCheckData) => void;
}

export interface QuickCheckData {
    grossIncome: number;
    monthlyLiabilities: number;
    deposit: number;
}

export function QuickCheckForm({ onCalculate }: QuickCheckFormProps) {
    const [grossIncome, setGrossIncome] = useState<string>("");
    const [monthlyLiabilities, setMonthlyLiabilities] = useState<string>("");
    const [deposit, setDeposit] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate({
            grossIncome: Number(grossIncome) || 0,
            monthlyLiabilities: Number(monthlyLiabilities) || 0,
            deposit: Number(deposit) || 0,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="income" className="flex items-center gap-2">
                        Gross Monthly Income
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Your total monthly income before tax and deductions.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                        <Input
                            id="income"
                            type="number"
                            placeholder="e.g. 150,000"
                            className="pl-12"
                            value={grossIncome}
                            onChange={(e) => setGrossIncome(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="liabilities" className="flex items-center gap-2">
                        Monthly Liabilities
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Total monthly loan repayments (car, personal loans, etc).</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                        <Input
                            id="liabilities"
                            type="number"
                            placeholder="e.g. 30,000"
                            className="pl-12"
                            value={monthlyLiabilities}
                            onChange={(e) => setMonthlyLiabilities(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="deposit" className="flex items-center gap-2">
                        Available Deposit / Savings
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cash you have available for a down payment.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">KSh</span>
                        <Input
                            id="deposit"
                            type="number"
                            placeholder="e.g. 1,000,000"
                            className="pl-12"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full h-11 text-lg gap-2">
                <Calculator className="w-4 h-4" /> Calculate BuyAbility
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                We use this to estimate your borrowing power. No credit check required.
            </p>
        </form>
    );
}
