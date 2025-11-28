import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Clock, AlertTriangle, User, Camera, Wrench, Plus } from "lucide-react";

// Mock Data
const cleaningTasks = [
    {
        id: 1,
        property: "Modern Loft in Westlands",
        date: "2023-12-15",
        time: "11:00 AM",
        type: "Checkout Clean",
        status: "Pending",
        cleaner: "Mary W."
    },
    {
        id: 2,
        property: "Cozy Studio near CBD",
        date: "2023-12-16",
        time: "10:00 AM",
        type: "Deep Clean",
        status: "Assigned",
        cleaner: "John K."
    },
    {
        id: 3,
        property: "Luxury Villa in Karen",
        date: "2023-12-14",
        time: "02:00 PM",
        type: "Checkout Clean",
        status: "Completed",
        cleaner: "Sarah M."
    }
];

const maintenanceIssues = [
    {
        id: 1,
        property: "Modern Loft in Westlands",
        issue: "Leaky kitchen faucet",
        priority: "Medium",
        status: "Open",
        reportedBy: "Guest",
        date: "2023-12-12"
    },
    {
        id: 2,
        property: "Luxury Villa in Karen",
        issue: "WiFi not working in master bedroom",
        priority: "High",
        status: "In Progress",
        reportedBy: "Guest",
        date: "2023-12-13"
    }
];

export default function Operations() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
                    <p className="text-muted-foreground">Manage cleaning schedules and maintenance tasks.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Manage Team</Button>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> New Task
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="cleaning" className="w-full">
                <TabsList>
                    <TabsTrigger value="cleaning">Cleaning Schedule</TabsTrigger>
                    <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    <TabsTrigger value="cleaner-view">Cleaner App Preview</TabsTrigger>
                </TabsList>

                {/* CLEANING TAB */}
                <TabsContent value="cleaning" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {cleaningTasks.map((task) => (
                            <Card key={task.id} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant={
                                            task.status === "Completed" ? "default" :
                                                task.status === "Assigned" ? "secondary" : "outline"
                                        }>
                                            {task.status}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">{task.date}</span>
                                    </div>
                                    <CardTitle className="text-lg mt-2">{task.property}</CardTitle>
                                    <CardDescription>{task.type} • {task.time}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{task.cleaner || "Unassigned"}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button variant="ghost" size="sm" className="w-full">View Details</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* MAINTENANCE TAB */}
                <TabsContent value="maintenance" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {maintenanceIssues.map((issue) => (
                                    <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-full ${issue.priority === "High" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                                                }`}>
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{issue.issue}</h4>
                                                <p className="text-sm text-muted-foreground">{issue.property} • Reported by {issue.reportedBy}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-2">{issue.status}</Badge>
                                            <p className="text-xs text-muted-foreground">{issue.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Report New Issue</CardTitle>
                            <CardDescription>Log a maintenance request for a property.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Property</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="prop1">Modern Loft in Westlands</SelectItem>
                                            <SelectItem value="prop2">Luxury Villa in Karen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <Label>Description</Label>
                                    <Input placeholder="Describe the issue..." />
                                </div>
                            </div>
                            <Button className="mt-4">Submit Report</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CLEANER APP PREVIEW TAB */}
                <TabsContent value="cleaner-view" className="mt-6">
                    <div className="flex justify-center">
                        <div className="w-[375px] h-[667px] border-8 border-gray-900 rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 flex flex-col relative">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-10" />

                            {/* App Header */}
                            <div className="bg-primary text-primary-foreground p-6 pt-12">
                                <h3 className="font-bold text-lg">My Tasks</h3>
                                <p className="text-sm opacity-90">Today, Dec 15</p>
                            </div>

                            {/* App Content */}
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge>11:00 AM</Badge>
                                        <Badge variant="outline">Checkout</Badge>
                                    </div>
                                    <h4 className="font-bold">Modern Loft in Westlands</h4>
                                    <p className="text-xs text-muted-foreground mb-3">45 mins remaining</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="line-through text-muted-foreground">Change linens</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="line-through text-muted-foreground">Clean bathroom</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                                            <span>Restock coffee</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                                            <span>Vacuum living room</span>
                                        </div>
                                    </div>

                                    <Button className="w-full mt-4 gap-2" size="sm">
                                        <Camera className="w-4 h-4" /> Upload Proof
                                    </Button>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-sm border opacity-60">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary">02:00 PM</Badge>
                                        <Badge variant="outline">Deep Clean</Badge>
                                    </div>
                                    <h4 className="font-bold">Luxury Villa in Karen</h4>
                                    <p className="text-xs text-muted-foreground">Upcoming</p>
                                </div>
                            </div>

                            {/* App Nav */}
                            <div className="bg-white border-t p-4 flex justify-around">
                                <div className="flex flex-col items-center gap-1 text-primary">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">Tasks</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <Wrench className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">Report</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                    <User className="w-6 h-6" />
                                    <span className="text-[10px] font-medium">Profile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
