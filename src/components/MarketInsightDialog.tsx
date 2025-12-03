import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    TrendingDown,
    MapPin,
    DollarSign,
    Building2,
    LineChart,
    Calendar,
    AlertCircle,
    Home,
    Percent,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MarketInsightDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    property: {
        title: string;
        location: string;
        price: string;
        propertyType: string;
    };
}

export function MarketInsightDialog({
    open,
    onOpenChange,
    property,
}: MarketInsightDialogProps) {
    // Mock data - in production, this would come from an API
    const insights = {
        currentValue: property.price,
        valuation: {
            status: "Fair Value",
            confidence: 85,
            range: {
                low: "KSh 16,500,000",
                high: "KSh 19,500,000",
            },
        },
        locationProspectus: {
            growthRate: "+12.5%",
            trend: "increasing",
            categoryRank: "Top 15%",
            amenitiesScore: 92,
            infrastructureScore: 88,
        },
        valueAddition: [
            { name: "Modern Finishing", impact: "+8%", value: "KSh 1,440,000" },
            { name: "Prime Location", impact: "+15%", value: "KSh 2,700,000" },
            { name: "Gated Community", impact: "+5%", value: "KSh 900,000" },
        ],
        projections: {
            oneYear: { value: "KSh 20,250,000", change: "+12.5%" },
            threeYears: { value: "KSh 25,340,000", change: "+40.8%" },
            fiveYears: { value: "KSh 31,500,000", change: "+75%" },
        },
        marketTrends: {
            demand: "High",
            supply: "Moderate",
            competitiveness: 78,
        },
        airbnbROI: {
            monthlyRevenue: {
                low: "KSh 120,000",
                average: "KSh 180,000",
                high: "KSh 250,000",
            },
            occupancyRate: 75,
            annualReturn: {
                gross: "KSh 2,160,000",
                net: "KSh 1,620,000",
                roi: "9.2%",
            },
            shortStayRevenue: {
                daily: "KSh 6,000 - KSh 8,500",
                weekly: "KSh 35,000 - KSh 50,000",
                monthly: "KSh 140,000 - KSh 200,000",
            },
            breakdown: {
                operatingCosts: "25%",
                managementFees: "15%",
                netProfit: "60%",
            },
        },
    };

    // Check if property is an apartment
    const isApartment = property.propertyType?.toLowerCase().includes('apartment') ||
        property.title?.toLowerCase().includes('apartment');


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <LineChart className="w-6 h-6 text-primary" />
                        Market Insights
                    </DialogTitle>
                    <DialogDescription className="space-y-1">
                        <div className="font-semibold text-foreground text-base">
                            {property.title}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Current Valuation */}
                    <Card className="border-primary/20">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    Current Valuation
                                </h3>
                                <Badge variant="outline" className="text-success">
                                    {insights.valuation.status}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-primary">
                                    {insights.currentValue}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Valuation Range:</span>
                                    <span className="font-medium">
                                        {insights.valuation.range.low} - {insights.valuation.range.high}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Confidence Level</span>
                                        <span className="font-semibold">{insights.valuation.confidence}%</span>
                                    </div>
                                    <Progress value={insights.valuation.confidence} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Prospectus */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Location Prospectus
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                                    <div className="text-2xl font-bold text-success flex items-center gap-1">
                                        <TrendingUp className="w-5 h-5" />
                                        {insights.locationProspectus.growthRate}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Category Rank</div>
                                    <div className="text-2xl font-bold text-primary">
                                        {insights.locationProspectus.categoryRank}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Amenities Score</div>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={insights.locationProspectus.amenitiesScore}
                                            className="h-2 flex-1"
                                        />
                                        <span className="font-semibold text-sm">
                                            {insights.locationProspectus.amenitiesScore}/100
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm text-muted-foreground">Infrastructure</div>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={insights.locationProspectus.infrastructureScore}
                                            className="h-2 flex-1"
                                        />
                                        <span className="font-semibold text-sm">
                                            {insights.locationProspectus.infrastructureScore}/100
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Value Addition */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                Value Addition Factors
                            </h3>
                            <div className="space-y-2">
                                {insights.valueAddition.map((factor, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">{factor.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {factor.value}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-success">
                                            {factor.impact}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Projected Valuations */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Projected Valuations
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(insights.projections).map(([period, data]) => (
                                    <div
                                        key={period}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                                    >
                                        <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground capitalize">
                                                {period.replace(/([A-Z])/g, " $1").trim()}
                                            </div>
                                            <div className="text-xl font-bold">{data.value}</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-success font-semibold">
                                            <TrendingUp className="w-5 h-5" />
                                            {data.change}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Airbnb & Short Stay ROI - Only for Apartments */}
                    {isApartment && (
                        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Home className="w-5 h-5 text-blue-500" />
                                        Airbnb & Short Stay ROI
                                    </h3>
                                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                                        Rental Income Potential
                                    </Badge>
                                </div>

                                {/* Monthly Revenue Range */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <div className="text-xs text-muted-foreground mb-1">Low Range</div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {insights.airbnbROI.monthlyRevenue.low}
                                        </div>
                                        <div className="text-xs text-muted-foreground">per month</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                        <div className="text-xs text-muted-foreground mb-1">Average</div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {insights.airbnbROI.monthlyRevenue.average}
                                        </div>
                                        <div className="text-xs text-muted-foreground">per month</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <div className="text-xs text-muted-foreground mb-1">High Range</div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {insights.airbnbROI.monthlyRevenue.high}
                                        </div>
                                        <div className="text-xs text-muted-foreground">per month</div>
                                    </div>
                                </div>

                                {/* Occupancy Rate */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Average Occupancy Rate</span>
                                        <span className="font-bold text-blue-600">{insights.airbnbROI.occupancyRate}%</span>
                                    </div>
                                    <Progress value={insights.airbnbROI.occupancyRate} className="h-2" />
                                </div>

                                {/* Annual Returns */}
                                <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50">
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Gross Annual</div>
                                        <div className="font-bold">{insights.airbnbROI.annualReturn.gross}</div>
                                    </div>
                                    <div className="text-center border-x border-border">
                                        <div className="text-xs text-muted-foreground mb-1">Net Annual</div>
                                        <div className="font-bold text-success">{insights.airbnbROI.annualReturn.net}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground mb-1">ROI</div>
                                        <div className="font-bold text-primary flex items-center justify-center gap-1">
                                            <Percent className="w-4 h-4" />
                                            {insights.airbnbROI.annualReturn.roi}
                                        </div>
                                    </div>
                                </div>

                                {/* Short Stay Revenue Breakdown */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Short Stay Revenue Breakdown</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Daily Rate</span>
                                            <span className="font-semibold text-sm">{insights.airbnbROI.shortStayRevenue.daily}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Weekly Rate</span>
                                            <span className="font-semibold text-sm">{insights.airbnbROI.shortStayRevenue.weekly}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Monthly Rate</span>
                                            <span className="font-semibold text-sm">{insights.airbnbROI.shortStayRevenue.monthly}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Breakdown */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Cost Breakdown</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="text-center p-2 rounded-lg bg-red-500/10">
                                            <div className="text-xs text-muted-foreground mb-1">Operating</div>
                                            <div className="font-bold text-red-600">{insights.airbnbROI.breakdown.operatingCosts}</div>
                                        </div>
                                        <div className="text-center p-2 rounded-lg bg-orange-500/10">
                                            <div className="text-xs text-muted-foreground mb-1">Management</div>
                                            <div className="font-bold text-orange-600">{insights.airbnbROI.breakdown.managementFees}</div>
                                        </div>
                                        <div className="text-center p-2 rounded-lg bg-green-500/10">
                                            <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                                            <div className="font-bold text-green-600">{insights.airbnbROI.breakdown.netProfit}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Insight */}
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="text-foreground">Investment Insight:</strong> Based on current market trends,
                                        this apartment shows strong potential for short-term rental income. With an average {insights.airbnbROI.occupancyRate}%
                                        occupancy rate, you could generate approximately {insights.airbnbROI.monthlyRevenue.average} monthly,
                                        offering a competitive {insights.airbnbROI.annualReturn.roi} ROI on your investment.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Market Trends */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Market Trends
                            </h3>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">Demand</div>
                                    <div className="font-bold text-sm sm:text-base text-success">
                                        {insights.marketTrends.demand}
                                    </div>
                                </div>
                                <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1">Supply</div>
                                    <div className="font-bold text-sm sm:text-base text-primary">
                                        {insights.marketTrends.supply}
                                    </div>
                                </div>
                                <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 break-words">
                                        Competitiveness
                                    </div>
                                    <div className="font-bold text-sm sm:text-base">{insights.marketTrends.competitiveness}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <strong>Disclaimer:</strong> These insights are AI-generated estimates
                            based on market analysis and should not be considered as professional
                            financial advice. Actual property values may vary based on various
                            factors. Consult with a licensed real estate professional for accurate
                            valuations.
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
