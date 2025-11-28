import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProfessionalSidebar } from "@/components/ProfessionalSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { StatsCard } from "@/components/professional/StatsCard";
import { CreatePost } from "@/components/professional/CreatePost";
import { ProfessionalFeed } from "@/components/professional/ProfessionalFeed";
import { Eye, Users, Briefcase, Award } from "lucide-react";
import ProfessionalProfile from "./ProfessionalDashboard/ProfessionalProfile";
import Notifications from "./AgentDashboard/Notifications"; // Reusing for now
import AgentSettings from "./AgentDashboard/AgentSettings"; // Reusing for now

function DashboardHome() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, Eng. Kamau</h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening in your professional network today.
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Action buttons could go here */}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Profile Views"
                    value="1,234"
                    icon={Eye}
                    trend="12%"
                    trendUp={true}
                    description="vs last month"
                />
                <StatsCard
                    title="Network Requests"
                    value="15"
                    icon={Users}
                    trend="5"
                    trendUp={true}
                    description="new pending"
                />
                <StatsCard
                    title="Job Invites"
                    value="3"
                    icon={Briefcase}
                    description="active opportunities"
                />
                <StatsCard
                    title="CPD Credits"
                    value="25/40"
                    icon={Award}
                    description="points earned this year"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Feed Column */}
                <div className="lg:col-span-2 space-y-6">
                    <CreatePost />
                    <ProfessionalFeed />
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-6">
                    {/* Upcoming Events / News / Suggestions */}
                    <div className="bg-muted/30 rounded-lg p-4 border">
                        <h3 className="font-semibold mb-3">Suggested Connections</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">Jane Doe</p>
                                        <p className="text-xs text-muted-foreground truncate">Architect • Nairobi</p>
                                    </div>
                                    <button className="text-xs text-primary font-medium hover:underline">Connect</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border">
                        <h3 className="font-semibold mb-3">Industry News</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium hover:text-primary cursor-pointer">New NCA Regulations 2024</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium hover:text-primary cursor-pointer">Green Building Summit</p>
                                <p className="text-xs text-muted-foreground">Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfessionalDashboard() {
    return (
        <SidebarProvider forceMobile={true}>
            <div className="min-h-screen flex w-full bg-background">
                <ProfessionalSidebar />

                <SidebarInset className="flex-1 w-full">
                    <HeaderWrapper />

                    <main className="p-4 md:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
                        <Routes>
                            <Route index element={<DashboardHome />} />
                            <Route path="profile" element={<ProfessionalProfile />} />
                            <Route path="services" element={<div className="p-4">Services Management (Coming Soon)</div>} />
                            <Route path="projects" element={<div className="p-4">Projects Portfolio (Coming Soon)</div>} />
                            <Route path="requests" element={<div className="p-4">Service Requests (Coming Soon)</div>} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="settings" element={<AgentSettings />} />
                        </Routes>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
