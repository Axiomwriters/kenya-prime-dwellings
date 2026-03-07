import { Lightbulb, TrendingUp, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketIntelligence() {
    const insights = [
        {
            id: 1,
            icon: TrendingUp,
            text: "Demand for minimalist bathroom renovations is up 25%.",
            action: "Showcase relevant projects",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            id: 2,
            icon: HardHat,
            text: "Cost of sustainable building materials has decreased by 10%.",
            action: "Source eco-friendly materials",
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            id: 3,
            icon: Lightbulb,
            text: "Clients are prioritizing smart home integrations.",
            action: "Highlight your smart home expertise",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ];

    return (
        <Card className="h-full border-l-4 border-l-purple-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-xl">🧠</span> Market Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.map((insight) => (
                    <div key={insight.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                        <div className={`mt-1 p-1.5 rounded-md ${insight.bg}`}>
                            <insight.icon className={`w-4 h-4 ${insight.color}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-normal">{insight.text}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {insight.action}
                                </span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button variant="outline" className="w-full text-xs" size="sm">
                    Explore Industry Trends
                </Button>
            </CardContent>
        </Card>
    );
}
