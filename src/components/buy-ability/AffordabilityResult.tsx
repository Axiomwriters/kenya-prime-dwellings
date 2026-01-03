import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2,
    AlertCircle,
    Info,
    ShieldCheck,
    ChevronDown,
    ChevronUp,
    Home,
    MessageSquare,
    RefreshCw
} from "lucide-react";
import { PropertyCarousel } from "./PropertyCarousel";
import { Property } from "./PropertyCard";
import { useNavigate } from "react-router-dom";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import real images
import houseKaren from "@/assets/bungalow-karen.jpg";
import aptKilimani from "@/assets/apartment-kilimani.jpg";
import houseRunda from "@/assets/house-runda.jpg";
import aptWestlands from "@/assets/apartment-westlands.jpg";

interface AffordabilityResultProps {
    affordableAmount: number;
    monthlyPayment: number;
    ltv: number;
    onGetMatched: () => void;
    onRecalculate: () => void;
}

const MOCK_PROPERTIES: Property[] = [
    {
        id: "mock-3",
        type: "House",
        image: houseKaren,
        valuation: 45000000,
        location: "Karen, Nairobi",
        beds: 4,
        baths: 4,
        sqft: 3500,
        title: "Modern Family Home in Karen",
    },
    {
        id: "mock-2",
        type: "Apartment",
        image: aptKilimani,
        valuation: 25000000,
        location: "Kilimani, Nairobi",
        beds: 3,
        baths: 2,
        sqft: 1800,
        title: "Luxury Apartment with City View",
    },
    {
        id: "mock-1",
        type: "House",
        image: houseRunda,
        valuation: 55000000,
        location: "Runda, Nairobi",
        beds: 5,
        baths: 5,
        sqft: 4200,
        title: "Exquisite Villa in Runda",
    },
    {
        id: "mock-9",
        type: "Apartment",
        image: aptWestlands,
        valuation: 18000000,
        location: "Westlands, Nairobi",
        beds: 2,
        baths: 2,
        sqft: 1200,
        title: "Cozy Apartment near Mall",
    },
];

export function AffordabilityResult({
    affordableAmount,
    monthlyPayment,
    ltv,
    onGetMatched,
    onRecalculate,
}: AffordabilityResultProps) {
    const navigate = useNavigate();
    const [isInterestExpanded, setIsInterestExpanded] = useState(false);

    // LTV Logic
    const isGoodLTV = ltv <= 80;
    const isHighLTV = ltv > 90;
    const ltvColor = isGoodLTV ? "bg-emerald-500" : isHighLTV ? "bg-rose-500" : "bg-amber-500";
    const ltvTextColor = isGoodLTV ? "text-emerald-600" : isHighLTV ? "text-rose-600" : "text-amber-600";

    return (
        <div className="flex flex-col min-h-full bg-gradient-to-b from-background to-muted/20">
            <div className="flex-1 px-6 py-6 space-y-6">

                {/* 1. Hero Section */}
                <div className="text-center space-y-2 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
                    <h3 className="text-sm font-medium text-muted-foreground relative z-10">You can afford a property up to</h3>
                    <div className="relative z-10">
                        <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 tracking-tight animate-in zoom-in-50 duration-700">
                            KSh {(affordableAmount / 1000000).toFixed(1)}M
                        </div>
                        <p className="text-xs text-emerald-600/80 font-medium mt-1">Comfortable budget based on your income & deposit</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-200">Range of KSh {affordableAmount.toLocaleString()}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-200">Safe monthly payment</span>
                        </div>
                    </div>
                </div>

                {/* 2. Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">

                    {/* Monthly Payment Card */}
                    <div className="bg-card/50 border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-medium text-muted-foreground">Est. Monthly Payment</div>
                            <Collapsible open={isInterestExpanded} onOpenChange={setIsInterestExpanded}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-muted">
                                        <Info className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                </CollapsibleTrigger>
                            </Collapsible>
                        </div>
                        <div className="text-xl font-bold text-foreground">
                            KSh {monthlyPayment.toLocaleString()}
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                ≈ 30% of your income (Healthy)
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                ≈ Same as rent in Kilimani 2BR
                            </div>
                        </div>

                        <Collapsible open={isInterestExpanded}>
                            <CollapsibleContent className="mt-3 text-[10px] space-y-2 border-t pt-2 animate-in slide-in-from-top-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Interest Rate</span>
                                    <span className="font-medium">13.5% (Avg)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Loan Term</span>
                                    <span className="font-medium">20 Years</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium">Variable</span>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Deposit Strength Card */}
                    <div className="bg-card/50 border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-medium text-muted-foreground">Deposit Strength</div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs max-w-[200px]">Loan-to-Value (LTV) ratio. A lower % means a bigger deposit, which often unlocks lower interest rates.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <div className={`text-xl font-bold ${ltvTextColor}`}>{ltv}% LTV</div>
                            <span className="text-[10px] text-muted-foreground">Deposit covered</span>
                        </div>

                        <div className="mt-3 space-y-1.5">
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative">
                                <div
                                    className={`h-full ${ltvColor} transition-all duration-1000 ease-out`}
                                    style={{ width: `${ltv}%` }}
                                />
                                {/* Ticks for visual context */}
                                <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-white/50" />
                                <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-white/50" />
                            </div>
                            <div className="flex justify-between text-[9px] text-muted-foreground font-medium">
                                <span>Strong</span>
                                <span>Standard</span>
                                <span>Stretch</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                                {isGoodLTV ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                )}
                                {isGoodLTV ? "You're in the sweet spot for rates." : "Consider increasing deposit for better rates."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Property Carousel */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <PropertyCarousel
                        properties={MOCK_PROPERTIES}
                        onViewProperty={(id) => navigate(`/properties/${id}`)}
                        onSeeLenders={onGetMatched}
                    />
                </div>
            </div>

            {/* 4. Sticky Action Footer */}
            <div className="sticky bottom-0 mt-auto bg-background/80 backdrop-blur-xl border-t p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-20 animate-in slide-in-from-bottom-full duration-500 delay-700">
                <div className="max-w-[600px] mx-auto space-y-3">
                    <h4 className="text-xs font-semibold text-center text-muted-foreground uppercase tracking-wider">What's your smartest next move?</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="h-12 flex flex-col items-center justify-center gap-0.5 hover:bg-muted/50 border-muted active:scale-95 transition-all"
                            onClick={() => navigate('/properties')}
                        >
                            <Home className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium">View More Homes</span>
                        </Button>
                        <Button
                            className="h-12 flex flex-col items-center justify-center gap-0.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                            onClick={onGetMatched}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-xs font-medium">Talk to Advisor</span>
                        </Button>
                    </div>
                    <button
                        onClick={onRecalculate}
                        className="w-full flex items-center justify-center gap-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors py-1 group"
                    >
                        <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                        Not feeling right? Adjust your numbers
                    </button>
                </div>
            </div>
        </div>
    );
}
