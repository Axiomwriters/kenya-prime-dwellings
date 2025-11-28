import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CalendarCheck,
    DollarSign,
    Home,
    MessageSquare,
    TrendingUp,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

export default function HostDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your properties today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">View Calendar</Button>
                    <Button>Add New Property</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KSh 450,000</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">+4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">3 checking in today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Properties</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">All active</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Activity & Tasks */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Urgent Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                Action Required
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-orange-900">New Inquiry from Sarah</h4>
                                    <p className="text-sm text-orange-700 mt-1">Asking about early check-in for the Riverside Apartment.</p>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white hover:bg-orange-50">Reply</Button>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <CalendarCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-blue-900">Check-in Today: John Doe</h4>
                                    <p className="text-sm text-blue-700 mt-1">Westlands Loft • 2 Guests • 3 Nights</p>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-white hover:bg-blue-50">Details</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                JD
                                            </div>
                                            <div>
                                                <p className="font-medium">James Dean</p>
                                                <p className="text-sm text-muted-foreground">Dec 12 - Dec 15 • Kileleshwa Condo</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">KSh 24,000</p>
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Confirmed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Notifications & Tips */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Cleaner finished at Riverside</p>
                                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Payout of KSh 45,000 processed</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">New review: 5 stars!</p>
                                    <p className="text-xs text-muted-foreground">Yesterday</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <TrendingUp className="w-5 h-5" />
                                Pricing Tip
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Demand is rising for the upcoming holiday weekend. We suggest increasing your rates by 10%.
                            </p>
                            <Button size="sm" className="w-full">Apply Price Update</Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
