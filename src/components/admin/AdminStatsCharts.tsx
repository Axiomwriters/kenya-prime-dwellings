import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const activeUsersData = [
    { name: "Mon", users: 400 },
    { name: "Tue", users: 300 },
    { name: "Wed", users: 550 },
    { name: "Thu", users: 450 },
    { name: "Fri", users: 600 },
    { name: "Sat", users: 700 },
    { name: "Sun", users: 800 },
];

const newListingsData = [
    { name: "Mon", listings: 12 },
    { name: "Tue", listings: 18 },
    { name: "Wed", listings: 15 },
    { name: "Thu", listings: 25 },
    { name: "Fri", listings: 20 },
    { name: "Sat", listings: 30 },
    { name: "Sun", listings: 28 },
];

const revenueData = [
    { name: "Week 1", revenue: 5000 },
    { name: "Week 2", revenue: 7500 },
    { name: "Week 3", revenue: 6000 },
    { name: "Week 4", revenue: 9000 },
];

const userDistributionData = [
    { name: "Buyers", value: 400 },
    { name: "Agents", value: 300 },
    { name: "Hosts", value: 300 },
    { name: "Professionals", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function AdminStatsCharts() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Active Users (Weekly)</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={activeUsersData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>New Listings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={newListingsData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip
                                cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Bar dataKey="listings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={userDistributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4 text-xs">
                        {userDistributionData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
