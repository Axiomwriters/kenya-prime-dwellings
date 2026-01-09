import { Lightbulb, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketIntelligence() {
    const insights = [
        {
            id: 1,
            icon: MapPin,
            text: "Westlands demand is rising this week (+12% search vol)",
            action: "Boost Westlands listings",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            id: 2,
            icon: Tag,
            text: "Listings priced above KSh 18M are slowing down",
            action: "Review premium pricing",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            id: 3,
            icon: Lightbulb,
            text: "Your 'Lavington' listing is overpriced by ~4%",
            action: "Adjust to KSh 16.5M",
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
                    View all market trends
                </Button>
            </CardContent>
        </Card>
    );
}
