import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { PropertyCarousel } from "./PropertyCarousel";
import { Property } from "./PropertyCard";
import { useNavigate } from "react-router-dom";

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
        id: "mock-3", // Matches "Cozy Bungalow in Karen"
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
        id: "mock-2", // Matches "Modern Apartment in Westlands"
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
        id: "mock-1", // Matches "Luxury Villa in Lavington"
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
        id: "mock-9", // Matches "Luxury Apartment in Kilimani"
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
    const isGoodLTV = ltv <= 80;
    const isHighLTV = ltv > 90;

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">You can afford a property up to</h3>
                <div className="text-2xl font-bold text-primary">
                    KSh {affordableAmount.toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/50 p-2 rounded-md space-y-0.5">
                    <div className="text-[10px] text-muted-foreground">Est. Monthly Payment</div>
                    <div className="text-base font-semibold">
                        KSh {monthlyPayment.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                        @ 13.5% avg rate
                    </div>
                </div>

                <div className="bg-muted/50 p-2 rounded-md space-y-0.5">
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                        <span>LTV</span>
                        <span className={isGoodLTV ? "text-green-500" : isHighLTV ? "text-orange-500" : "text-blue-500"}>
                            {ltv}%
                        </span>
                    </div>
                    <Progress value={ltv} className="h-1" />
                    <div className="text-[9px] flex items-center gap-1 mt-0.5">
                        {isGoodLTV ? (
                            <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                        ) : (
                            <AlertCircle className="w-2.5 h-2.5 text-orange-500" />
                        )}
                        <span className="text-muted-foreground leading-none truncate">
                            {isGoodLTV ? "Healthy deposit" : "Increase deposit for better rates"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Property Listings Carousel */}
            <div className="pt-1 -mx-6 px-6 overflow-hidden">
                <PropertyCarousel
                    properties={MOCK_PROPERTIES}
                    onViewProperty={(id) => navigate(`/properties/${id}`)}
                    onSeeLenders={onGetMatched}
                />
            </div>

            <div className="pt-1">
                <Button variant="ghost" size="sm" onClick={onRecalculate} className="w-full h-7 text-xs">
                    Adjust Numbers
                </Button>
            </div>
        </div>
    );
}
