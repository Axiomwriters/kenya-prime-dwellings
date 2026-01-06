
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MarketInsightProps {
    price: number;
    location: string;
    size: string;
}

export const MarketInsight = ({ price, location, size }: MarketInsightProps) => {
    // Mock AI Logic
    const estimatedMin = price * 0.95;
    const estimatedMax = price * 1.05;
    const confidenceScore = 85;
    const marketTrend = "up"; // 'up' or 'down'

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val);
    };

    const suggestedProfessionals = [
        { id: 1, name: "David Kimani", role: "Certified Valuer", company: "Prime Valuations Ltd" },
        { id: 2, name: "Alice Wanjiku", role: "Market Analyst", company: "Nairobi Estates" },
    ];

    return (
        <Card className="bg-gradient-to-br from-background to-muted/30 border-primary/20 overflow-hidden">
            <div className="bg-primary/5 p-4 border-b border-primary/10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <TrendingUp className="w-5 h-5" />
                    <span>AI Market Insights</span>
                </div>
                <Badge variant="outline" className="bg-background text-xs">Beta</Badge>
            </div>

            <CardContent className="p-6 space-y-6">
                {/* Valuation Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">Estimated Market Value</h4>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">AI-generated estimate based on location ({location}), size ({size}), and recent sales data.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{formatCurrency(estimatedMin)}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-2xl font-bold">{formatCurrency(estimatedMax)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        {marketTrend === 'up' ? (
                            <span className="text-green-600 flex items-center gap-1 font-medium">
                                <TrendingUp className="w-3 h-3" /> Market is Trending Up
                            </span>
                        ) : (
                            <span className="text-red-500 flex items-center gap-1 font-medium">
                                <TrendingDown className="w-3 h-3" /> Market Cooling Down
                            </span>
                        )}
                        <span className="text-muted-foreground">• {confidenceScore}% Confidence</span>
                    </div>
                </div>

                {/* Disclaimer Alert */}
                <div className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-xs leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                        These figures are automated estimates and should not be used as a formal appraisal. Actual values may vary based on condition and other factors.
                    </p>
                </div>

                {/* Professional Recommendation */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Consult a Certified Professional
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        For an accurate valuation, we recommend contacting verified professionals:
                    </p>

                    <div className="grid gap-2">
                        {suggestedProfessionals.map((pro) => (
                            <div key={pro.id} className="flex items-center justify-between p-2 rounded-md bg-background border hover:border-primary/50 transition-colors">
                                <div>
                                    <div className="font-medium text-sm">{pro.name}</div>
                                    <div className="text-xs text-muted-foreground">{pro.role} • {pro.company}</div>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">Request Info</Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
