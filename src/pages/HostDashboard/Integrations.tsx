import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, CreditCard, Wifi, FileText, Check, AlertCircle, RefreshCw } from "lucide-react";

export default function Integrations() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                    <p className="text-muted-foreground">Connect your favorite tools and platforms.</p>
                </div>
            </div>

            <Tabs defaultValue="channels" className="w-full">
                <TabsList>
                    <TabsTrigger value="channels">Channels (OTA)</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="smarthome">Smart Home</TabsTrigger>
                    <TabsTrigger value="accounting">Accounting</TabsTrigger>
                </TabsList>

                {/* CHANNELS TAB */}
                <TabsContent value="channels" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        Ab
                                    </div>
                                    <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
                                </div>
                                <CardTitle className="mt-4">Airbnb</CardTitle>
                                <CardDescription>Sync bookings, messages, and prices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <div className="flex justify-between">
                                        <span>Last Sync</span>
                                        <span>2 mins ago</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Listings</span>
                                        <span>3 Active</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Manage Settings</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        B.
                                    </div>
                                    <Badge variant="outline">Not Connected</Badge>
                                </div>
                                <CardTitle className="mt-4">Booking.com</CardTitle>
                                <CardDescription>Reach millions of travelers worldwide.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>Connect your account to synchronize calendars and avoid double bookings.</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Connect</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-bold text-xl">
                                        Ex
                                    </div>
                                    <Badge variant="outline">Not Connected</Badge>
                                </div>
                                <CardTitle className="mt-4">Expedia</CardTitle>
                                <CardDescription>Expand your reach to Expedia Group.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>List your property on Expedia, Hotels.com, and Vrbo.</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full">Connect</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                {/* PAYMENTS TAB */}
                <TabsContent value="payments" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Gateways</CardTitle>
                            <CardDescription>Manage how you receive payouts and charge guests.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">M-Pesa</h4>
                                        <p className="text-sm text-muted-foreground">Primary payout method</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className="bg-green-500">Active</Badge>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Stripe</h4>
                                        <p className="text-sm text-muted-foreground">For credit card processing</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline">Connected</Badge>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">PayPal</h4>
                                        <p className="text-sm text-muted-foreground">Alternative payout method</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Connect</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SMART HOME TAB */}
                <TabsContent value="smarthome" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wifi className="w-5 h-5" /> Smart Locks
                                </CardTitle>
                                <CardDescription>Automate check-in codes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">August Home</span>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Yale Access</span>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Schlage Encode</span>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5" /> Automation Rules
                                </CardTitle>
                                <CardDescription>Trigger actions based on reservations.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm">Generate code 24h before check-in</span>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm">Expire code 1h after check-out</span>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ACCOUNTING TAB */}
                <TabsContent value="accounting" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Accounting Software</CardTitle>
                            <CardDescription>Sync your financials for easier tax reporting.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white font-bold">QB</div>
                                    <span className="font-medium">QuickBooks Online</span>
                                </div>
                                <Button variant="outline">Connect</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold">X</div>
                                    <span className="font-medium">Xero</span>
                                </div>
                                <Button variant="outline">Connect</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
