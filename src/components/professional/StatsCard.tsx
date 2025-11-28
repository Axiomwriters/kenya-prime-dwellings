import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, description }: StatsCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-baseline space-x-3">
                    <div className="text-2xl font-bold">{value}</div>
                    {trend && (
                        <div className={`text-xs font-medium ${trendUp ? "text-green-500" : "text-red-500"}`}>
                            {trendUp ? "+" : ""}{trend}
                        </div>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}
