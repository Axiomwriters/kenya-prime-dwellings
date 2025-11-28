import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, CreditCard, BarChart3, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Mock Data
const revenueData = [
    { name: "Jan", revenue: 120000, occupancy: 65 },
    { name: "Feb", revenue: 145000, occupancy: 72 },
    { name: "Mar", revenue: 135000, occupancy: 68 },
    { name: "Apr", revenue: 160000, occupancy: 75 },
    { name: "May", revenue: 190000, occupancy: 82 },
    { name: "Jun", revenue: 210000, occupancy: 88 },
];

const payouts = [
    { id: 1, date: "2023-12-01", amount: 45000, status: "Paid", method: "Bank Transfer" },
    { id: 2, date: "2023-11-15", amount: 32000, status: "Paid", method: "M-Pesa" },
    { id: 3, date: "2023-11-01", amount: 58000, status: "Paid", method: "Bank Transfer" },
    { id: 4, date: "2023-12-15", amount: 28000, status: "Processing", method: "M-Pesa" },
];

export default function Financials() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
                    <p className="text-muted-foreground">Track revenue, manage payouts, and optimize pricing.</p>
                </div>
                <div className="flex gap-3">
                    <Select defaultValue="this-year">
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings & Payouts</TabsTrigger>
                    <TabsTrigger value="pricing">Smart Pricing</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">KSh 960,000</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">78%</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                                    +4% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Daily Rate (ADR)</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">KSh 8,500</div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                                    -2% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis tickFormatter={(value) => `KSh${value / 1000}k`} />
                                        <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                                        <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Occupancy Trend</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="occupancy" stroke="#82ca9d" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* EARNINGS TAB */}
                <TabsContent value="earnings" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payout History</CardTitle>
                            <CardDescription>View your recent payouts and their status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {payouts.map((payout) => (
                                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-muted rounded-full">
                                                <CreditCard className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Payout via {payout.method}</p>
                                                <p className="text-sm text-muted-foreground">{payout.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">KSh {payout.amount.toLocaleString()}</p>
                                            <Badge variant={payout.status === "Paid" ? "outline" : "secondary"} className={payout.status === "Paid" ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                                {payout.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PRICING TAB */}
                <TabsContent value="pricing" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <CardTitle>Smart Pricing is Active</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Your prices are automatically adjusted based on demand, seasonality, and local events.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Optimization Score</span>
                                        <span className="text-sm font-bold text-primary">94/100</span>
                                    </div>
                                    <Progress value={94} className="h-2" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Price Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Dynamic Pricing</label>
                                            <p className="text-sm text-muted-foreground">Automatically adjust nightly rates</p>
                                        </div>
                                        <Switch checked={true} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Weekend Surge</label>
                                            <p className="text-sm text-muted-foreground">Increase prices on Fri & Sat</p>
                                        </div>
                                        <Switch checked={true} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Minimum Nightly Rate</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">KSh</span>
                                            <input type="number" className="flex-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="5000" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Market Insights</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm font-medium mb-1">Upcoming High Demand</p>
                                        <p className="text-xs text-muted-foreground">Christmas Week (Dec 20 - 27) is seeing 40% higher bookings in your area.</p>
                                    </div>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm font-medium mb-1">Competitor Rates</p>
                                        <p className="text-xs text-muted-foreground">Similar listings are averaging KSh 9,500/night for next weekend.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
