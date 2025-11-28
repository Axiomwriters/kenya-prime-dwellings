import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Globe, MapPin } from "lucide-react";

// Mock Data
const bookingSources = [
    { name: "Airbnb", value: 45, color: "#FF5A5F" },
    { name: "Booking.com", value: 30, color: "#003580" },
    { name: "Direct", value: 15, color: "#00A699" },
    { name: "Expedia", value: 10, color: "#FFC107" },
];

const guestDemographics = [
    { name: "Families", value: 40 },
    { name: "Couples", value: 35 },
    { name: "Business", value: 15 },
    { name: "Solo", value: 10 },
];

const revenueForecast = [
    { month: "Jan", actual: 120000, forecast: 125000 },
    { month: "Feb", actual: 145000, forecast: 140000 },
    { month: "Mar", actual: 135000, forecast: 150000 },
    { month: "Apr", actual: 160000, forecast: 165000 },
    { month: "May", actual: 190000, forecast: 195000 },
    { month: "Jun", actual: 210000, forecast: 220000 },
    { month: "Jul", actual: null, forecast: 240000 },
    { month: "Aug", actual: null, forecast: 230000 },
    { month: "Sep", actual: null, forecast: 200000 },
];

export default function Insights() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
                    <p className="text-muted-foreground">Deep dive into your property performance and guest trends.</p>
                </div>
                <Select defaultValue="6m">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1m">Last 30 Days</SelectItem>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="performance" className="w-full">
                <TabsList>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="guests">Guests</TabsTrigger>
                    <TabsTrigger value="market">Market Trends</TabsTrigger>
                </TabsList>

                {/* PERFORMANCE TAB */}
                <TabsContent value="performance" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Forecast</CardTitle>
                                <CardDescription>Actual vs. Predicted Revenue</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueForecast}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(val) => `KSh${val / 1000}k`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                                        <Area type="monotone" dataKey="actual" stroke="#8884d8" fillOpacity={1} fill="url(#colorActual)" name="Actual" />
                                        <Area type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" name="Forecast" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Sources</CardTitle>
                                <CardDescription>Where your guests are coming from</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={bookingSources}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {bookingSources.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                                    {bookingSources.map((source) => (
                                        <div key={source.name} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                                            <span className="text-sm text-muted-foreground">{source.name} ({source.value}%)</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* GUESTS TAB */}
                <TabsContent value="guests" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" /> Demographics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {guestDemographics.map((item) => (
                                        <div key={item.name} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{item.name}</span>
                                                <span className="font-medium">{item.value}%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${item.value}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-primary" /> Top Countries
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🇰🇪</span>
                                            <span>Kenya</span>
                                        </div>
                                        <span className="font-medium">45%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🇺🇸</span>
                                            <span>USA</span>
                                        </div>
                                        <span className="font-medium">20%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🇬🇧</span>
                                            <span>UK</span>
                                        </div>
                                        <span className="font-medium">15%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🇩🇪</span>
                                            <span>Germany</span>
                                        </div>
                                        <span className="font-medium">10%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" /> Origin Cities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm border-b pb-2">
                                        <span>Nairobi</span>
                                        <span className="text-muted-foreground">30%</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-2">
                                        <span>London</span>
                                        <span className="text-muted-foreground">12%</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-2">
                                        <span>New York</span>
                                        <span className="text-muted-foreground">8%</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-2">
                                        <span>Berlin</span>
                                        <span className="text-muted-foreground">5%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* MARKET TAB */}
                <TabsContent value="market" className="mt-6">
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <TrendingUp className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">Market Data Integration</h3>
                            <p className="text-muted-foreground max-w-md mt-2">
                                Connect with AirDNA or PriceLabs to see real-time market occupancy, ADR trends, and competitor analysis for your area.
                            </p>
                            <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                                Connect Market Data
                            </button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
