import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, MessageSquare, AlertTriangle, CheckCircle2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon: any;
    color?: string;
}

function StatCard({ title, value, subtext, trend, trendValue, icon: Icon, color }: StatProps) {
    return (
        <Card className="hover:shadow-md transition-all border-border/50">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                            {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                        </div>
                    </div>
                    <div className={cn("p-2 rounded-xl", color || "bg-primary/10 text-primary")}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center gap-2 text-xs">
                        <span className={cn(
                            "flex items-center font-medium",
                            trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
                        )}>
                            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {trendValue}
                        </span>
                        <span className="text-muted-foreground">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function ListingHealthStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Active Listings"
                value="12"
                subtext="3 drafts pending"
                trend="up"
                trendValue="+2"
                icon={CheckCircle2}
                color="bg-green-100 text-green-700"
            />
            <StatCard
                title="Total Views (30d)"
                value="2.4k"
                subtext="Avg 200 per listing"
                trend="up"
                trendValue="+12.5%"
                icon={Eye}
                color="bg-blue-100 text-blue-700"
            />
            <StatCard
                title="Inquiry Rate"
                value="3.8%"
                subtext="4 Active Deals"
                trend="down"
                trendValue="-0.5%"
                icon={MessageSquare}
                color="bg-purple-100 text-purple-700"
            />
            <StatCard
                title="Action Required"
                value="3"
                subtext="Optimize to boost reach"
                icon={AlertTriangle}
                color="bg-amber-100 text-amber-700"
            />
        </div>
    );
}
