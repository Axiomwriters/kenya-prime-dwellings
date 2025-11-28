import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, RefreshCw, Plus, Lock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarSync() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedProperty, setSelectedProperty] = useState("all");

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendar & Availability</h1>
                    <p className="text-muted-foreground">Manage bookings and sync with other platforms.</p>
                </div>
                <div className="flex gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Sync Settings
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Calendar Sync Settings</DialogTitle>
                                <DialogDescription>
                                    Import and export calendars to sync with Airbnb, Booking.com, etc.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Import Calendar (iCal URL)</Label>
                                    <Input placeholder="https://www.airbnb.com/calendar/ical/..." />
                                    <p className="text-xs text-muted-foreground">Paste the iCal link from Airbnb, Booking.com, or VRBO.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Export Calendar</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value="https://kenyaprime.com/ical/prop_123" />
                                        <Button variant="secondary">Copy</Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button>Save Sync Settings</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button>
                        <Lock className="w-4 h-4 mr-2" />
                        Block Dates
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Controls */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Property</Label>
                            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select property" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Properties</SelectItem>
                                    <SelectItem value="prop1">Modern Loft in Westlands</SelectItem>
                                    <SelectItem value="prop2">Cozy Studio near CBD</SelectItem>
                                    <SelectItem value="prop3">Luxury Villa in Karen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Legend</Label>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span>Confirmed Booking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                                    <span>Blocked / Maintenance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span>Pending Request</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Calendar View */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            {date?.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* 
              Using the shadcn/ui Calendar component for now. 
              In a real app, we'd use 'react-big-calendar' or a custom grid 
              to show multiple properties and bookings spanning days.
            */}
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow p-4 w-full max-w-md"
                            />
                        </div>

                        <div className="mt-8">
                            <h3 className="font-semibold mb-4">Upcoming Bookings</h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                                                JD
                                            </div>
                                            <div>
                                                <p className="font-medium">John Doe</p>
                                                <p className="text-sm text-muted-foreground">Dec 12 - Dec 15 • Westlands Loft</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Airbnb
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
