import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { name: "Mon", calls: 4, views: 24 },
    { name: "Tue", calls: 3, views: 13 },
    { name: "Wed", calls: 2, views: 38 },
    { name: "Thu", calls: 2, views: 30 },
    { name: "Fri", calls: 10, views: 48 },
    { name: "Sat", calls: 7, views: 39 },
    { name: "Sun", calls: 5, views: 20 },
];

export default function PerformanceRadar() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                    <span>📊 Performance Radar</span>
                    <span className="text-xs font-normal text-muted-foreground">Last 7 Days</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Total Views</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">212</span>
                            <span className="flex items-center text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +18%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">vs. last week</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Enquiries</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">33</span>
                            <span className="flex items-center text-xs text-red-500 font-medium bg-red-500/10 px-1.5 py-0.5 rounded">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                -6%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-80">Pricing issue detected</p>
                    </div>
                </div>

                <div className="h-[200px] w-full mt-4">
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
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
