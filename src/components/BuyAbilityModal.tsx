import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QuickCheckForm, QuickCheckData } from "./buy-ability/QuickCheckForm";
import { AffordabilityResult } from "./buy-ability/AffordabilityResult";
import { LenderCard } from "./buy-ability/LenderCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface BuyAbilityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Step = "quick-check" | "results" | "lenders";

// Mock Lenders Data
const MOCK_LENDERS = [
    {
        name: "KCB Bank",
        logo: "",
        interestRate: 13.5,
        maxLTV: 90,
        minDeposit: 10,
        badges: ["Fast Approval", "First-time Buyer"],
        turnaroundTime: "3-5 Days",
        fees: "1% Processing",
    },
    {
        name: "NCBA Loop",
        logo: "",
        interestRate: 13.0,
        maxLTV: 80,
        minDeposit: 20,
        badges: ["Digital Process", "Low Rate"],
        turnaroundTime: "24 Hours",
        fees: "Negotiable",
    },
    {
        name: "Co-op Bank",
        logo: "",
        interestRate: 13.8,
        maxLTV: 100,
        minDeposit: 0,
        badges: ["100% Financing", "Construction Loans"],
        turnaroundTime: "1 Week",
        fees: "Standard",
    },
];

export function BuyAbilityModal({ open, onOpenChange }: BuyAbilityModalProps) {
    const [step, setStep] = useState<Step>("quick-check");
    const [formData, setFormData] = useState<QuickCheckData | null>(null);
    const [results, setResults] = useState<{ affordableAmount: number; monthlyPayment: number; ltv: number } | null>(null);

    const handleCalculate = (data: QuickCheckData) => {
        setFormData(data);

        // Simple Affordability Logic (Rule of thumb: 35% of income for repayment)
        const maxMonthlyRepayment = (data.grossIncome - data.monthlyLiabilities) * 0.35;
        const interestRate = 0.135; // 13.5%
        const termsInYears = 20;
        const numberOfPayments = termsInYears * 12;

        // PV = PMT * [(1 - (1 + r)^-n) / r]
        const monthlyRate = interestRate / 12;
        const loanAmount = maxMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);

        const affordableAmount = Math.round(loanAmount + data.deposit);
        const ltv = Math.round((loanAmount / affordableAmount) * 100);

        setResults({
            affordableAmount,
            monthlyPayment: Math.round(maxMonthlyRepayment),
            ltv,
        });
        setStep("results");
    };

    const handleLenderSelect = (lenderName: string) => {
        toast.success(`Pre-approval request sent to ${lenderName}!`, {
            description: "They will contact you shortly to complete the process.",
        });
        onOpenChange(false);
        setStep("quick-check"); // Reset for next time
    };

    const handleBack = () => {
        if (step === "results") setStep("quick-check");
        if (step === "lenders") setStep("results");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {step !== "quick-check" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <DialogTitle>
                            {step === "quick-check" && "Know Your BuyAbility"}
                            {step === "results" && "Your Affordability Results"}
                            {step === "lenders" && "Matched Lenders"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {step === "quick-check" && "Discover what you can afford and get matched with the best lenders."}
                        {step === "results" && "Based on your income and deposit, here is what you can afford."}
                        {step === "lenders" && "These lenders match your profile and affordability."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === "quick-check" && (
                        <QuickCheckForm onCalculate={handleCalculate} />
                    )}

                    {step === "results" && results && (
                        <AffordabilityResult
                            affordableAmount={results.affordableAmount}
                            monthlyPayment={results.monthlyPayment}
                            ltv={results.ltv}
                            onGetMatched={() => setStep("lenders")}
                            onRecalculate={() => setStep("quick-check")}
                        />
                    )}

                    {step === "lenders" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                            {MOCK_LENDERS.map((lender) => (
                                <LenderCard
                                    key={lender.name}
                                    {...lender}
                                    onSelect={() => handleLenderSelect(lender.name)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
