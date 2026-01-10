import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Info, Activity, Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MarketInsightProps {
    price: number;
    location: string;
    size: string;
}

export const MarketInsight = ({ price, location, size }: MarketInsightProps) => {
    // Mock AI Logic (In production this comes from backend)
    const estimatedMin = price * 0.95;
    const estimatedMax = price * 1.05;
    const confidenceScore = 85;

    // Derived metrics for UI
    const pricePosition = 65; // 0-100 scale (Underpriced -> Overpriced)
    const negotiationLeverage = "High"; // High, Medium, Low
    const buyerDemand = "Very High";

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val);
    };

    const suggestedProfessionals = [
        { id: 1, name: "David Kimani", role: "Certified Valuer", company: "Prime Valuations Ltd", verified: true },
        { id: 2, name: "Alice Wanjiku", role: "Market Analyst", company: "Nairobi Estates", verified: true },
    ];

    return (
        <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-border/50 overflow-hidden shadow-2xl text-white relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-white font-semibold">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span>AI Market Insights</span>
                </div>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2">Beta</Badge>
            </div>

            <CardContent className="p-5 space-y-6">

                {/* 1. Price Positioning Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wide">
                        <span>Underpriced</span>
                        <span>Fair Value</span>
                        <span>Overpriced</span>
                    </div>
                    <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner ring-1 ring-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 opacity-80" />
                        {/* Marker */}
                        <div
                            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                            style={{ left: `${pricePosition}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-1">
                        This property is priced <span className="text-yellow-400 font-bold">slightly above market average</span> for {location}.
                    </p>
                </div>

                {/* 2. Negotiation & Demand Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Negotiation Leverage */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center">
                        <div className="text-[10px] text-slate-400 uppercase tracking-tight mb-1">Negotiation Leverage</div>
                        <div className="text-emerald-400 font-bold text-lg flex items-center gap-1">
                            {negotiationLeverage}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Seller likely flexible</div>
                    </div>

                    {/* Buyer Demand */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center">
                        <div className="text-[10px] text-slate-400 uppercase tracking-tight mb-1">Buyer Demand</div>
                        <div className="text-orange-400 font-bold text-lg flex items-center gap-1">
                            <Flame className="w-4 h-4 fill-current" />
                            {buyerDemand}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Hot in {location}</div>
                    </div>
                </div>

                {/* 3. Demand Insight Text */}
                <div className="flex items-start gap-3 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <Users className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-200 leading-relaxed">
                        <strong className="text-blue-300">Fast Mover Warning:</strong> Buyers viewing similar listings are also booking viewings within 3 days.
                    </p>
                </div>

                {/* 4. Estimated Market Value (Compact) */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-medium text-slate-400">Estimated Market Value</h4>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-3 h-3 text-slate-500 hover:text-white transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200">
                                    <p className="max-w-xs text-xs">AI-generated estimate based on location ({location}), size ({size}), and recent sales data.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-white tracking-tight">{formatCurrency(estimatedMin)}</span>
                            <span className="text-slate-500 text-xs">-</span>
                            <span className="text-lg font-bold text-white tracking-tight">{formatCurrency(estimatedMax)}</span>
                        </div>
                        <div className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-medium">
                            {confidenceScore}% Conf.
                        </div>
                    </div>
                </div>

                {/* 5. Professional CTA */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                    <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Consult a Certified Professional
                    </h4>

                    <div className="space-y-2">
                        {suggestedProfessionals.map((pro) => (
                            <div key={pro.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                                        {pro.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-slate-200 group-hover:text-white">{pro.name}</div>
                                        <div className="text-[10px] text-slate-500">{pro.role}</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 text-[10px] hover:bg-white/10 text-slate-400 hover:text-white">Request Info</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
