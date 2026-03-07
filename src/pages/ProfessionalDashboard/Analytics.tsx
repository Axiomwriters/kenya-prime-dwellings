import { TrendingUp, TrendingDown, Lightbulb, MapPin, Tag } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const data = [
    { name: "Jan", inquiries: 10, views: 150 },
    { name: "Feb", inquiries: 15, views: 200 },
    { name: "Mar", inquiries: 12, views: 180 },
    { name: "Apr", inquiries: 20, views: 250 },
    { name: "May", inquiries: 18, views: 220 },
    { name: "Jun", inquiries: 25, views: 300 },
];

const insights = [
    {
        id: 1,
        icon: MapPin,
        text: "Demand for kitchen renovations is up by 15% in your area.",
        action: "Create a new kitchen renovation project",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        id: 2,
        icon: Tag,
        text: "Projects with a budget over KES 2M are getting more views.",
        action: "Consider increasing budget for new projects",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    {
        id: 3,
        icon: Lightbulb,
        text: "Your 'Bathroom Remodel' project is priced 10% below market rate.",
        action: "Adjust budget to KES 880,000",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

export default function Analytics() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span>📊 Project Performance</span>
                                <span className="text-xs font-normal text-muted-foreground">Last 6 Months</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Total Views</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">1.3k</span>
                                        <span className="flex items-center text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            +25%
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">vs. previous 6 months</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Inquiries</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">100</span>
                                        <span className="flex items-center text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            +10%
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">vs. previous 6 months</p>
                                </div>
                            </div>

                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#8884d8"
                                            fillOpacity={1}
                                            fill="url(#colorViews)"
                                            strokeWidth={2}
                                            name="Views"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="inquiries"
                                            stroke="#82ca9d"
                                            fillOpacity={0}
                                            strokeWidth={2}
                                            name="Inquiries"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
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
                </div>
            </div>
        </div>
    );
}
