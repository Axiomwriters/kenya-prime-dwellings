import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";

export default function AutoReply() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messaging Automation</h1>
                    <p className="text-muted-foreground">Set up auto-replies and scheduled messages.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="cursor-pointer border-primary bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Booking Inquiry
                            </CardTitle>
                            <CardDescription>Auto-reply to new questions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Enabled</span>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Booking Confirmation
                            </CardTitle>
                            <CardDescription>Sent immediately after booking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Enabled</span>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Check-in Instructions
                            </CardTitle>
                            <CardDescription>Sent 24h before arrival</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Enabled</span>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Edit Message Template</CardTitle>
                            <CardDescription>Customize what your guests will receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Trigger</Label>
                                <div className="p-3 bg-muted rounded-md text-sm">
                                    When a guest sends a new inquiry message...
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Message Content</Label>
                                <Textarea
                                    className="min-h-[200px] font-mono text-sm"
                                    defaultValue="Hi {guest_name},

Thanks for your interest in {property_name}! 

Yes, the dates you requested are currently available. 

Feel free to book directly, or let me know if you have any other questions.

Best regards,
{host_name}"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Available variables: {"{guest_name}"}, {"{property_name}"}, {"{check_in_date}"}, {"{host_name}"}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline">Send Test Message</Button>
                                <Button>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
