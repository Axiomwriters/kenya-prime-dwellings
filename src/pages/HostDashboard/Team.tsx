import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Mail, MoreHorizontal } from "lucide-react";

const teamMembers = [
    { id: 1, name: "You", email: "host@example.com", role: "Owner", avatar: "", status: "Active" },
    { id: 2, name: "Sarah M.", email: "sarah@example.com", role: "Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60", status: "Active" },
    { id: 3, name: "John K.", email: "john@example.com", role: "Cleaner", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60", status: "Active" },
    { id: 4, name: "Mike R.", email: "mike@example.com", role: "Co-Host", avatar: "", status: "Pending" },
];

export default function Team() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team & Roles</h1>
                    <p className="text-muted-foreground">Manage access for co-hosts, cleaners, and staff.</p>
                </div>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>People with access to your properties.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold">{member.name}</h4>
                                                    {member.status === "Pending" && <Badge variant="outline" className="text-xs">Pending</Badge>}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Select defaultValue={member.role.toLowerCase()}>
                                                <SelectTrigger className="w-[110px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="owner">Owner</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="co-host">Co-Host</SelectItem>
                                                    <SelectItem value="cleaner">Cleaner</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-base">Invite New Member</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-9" placeholder="colleague@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manager">Manager (Full Access)</SelectItem>
                                        <SelectItem value="co-host">Co-Host (Limited)</SelectItem>
                                        <SelectItem value="cleaner">Cleaner (Tasks Only)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full">Send Invitation</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Role Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                                <span>View Financials</span>
                                <span className="font-medium text-foreground">Owner, Manager</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Edit Properties</span>
                                <span className="font-medium text-foreground">Owner, Manager</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Manage Bookings</span>
                                <span className="font-medium text-foreground">All except Cleaner</span>
                            </div>
                            <div className="flex justify-between">
                                <span>View Calendar</span>
                                <span className="font-medium text-foreground">All Roles</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
