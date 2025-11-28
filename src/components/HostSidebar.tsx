import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Home,
    Calendar,
    MessageSquare,
    ClipboardList,
    DollarSign,
    BarChart,
    Settings,
    ArrowLeft,
    LogOut,
    Globe,
    BookOpen,
    Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mainItems = [
    { title: "Dashboard", url: "/host", icon: LayoutDashboard },
    { title: "Properties", url: "/host/properties", icon: Home },
    { title: "Calendar", url: "/host/calendar", icon: Calendar },
    { title: "Reservations", url: "/host/reservations", icon: ClipboardList },
    { title: "Inbox", url: "/host/inbox", icon: MessageSquare, badge: 2 },
    { title: "Automation", url: "/host/automation", icon: MessageSquare },
    { title: "Operations", url: "/host/operations", icon: ClipboardList },
    { title: "Financials", url: "/host/financials", icon: DollarSign },
    { title: "Insights", url: "/host/insights", icon: BarChart },
    { title: "Integrations", url: "/host/integrations", icon: Globe },
    { title: "Guidebook", url: "/host/guidebook", icon: BookOpen },
    { title: "Team", url: "/host/team", icon: Users },
    { title: "Settings", url: "/host/settings", icon: Settings },
];

export function HostSidebar() {
    const { state } = useSidebar();
    const { user, signOut } = useAuth();
    const location = useLocation();
    const isCollapsed = state === "collapsed";

    // Mock counts for now
    const [unreadCount, setUnreadCount] = useState(2);

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully");
    };

    return (
        <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
            <SidebarTrigger className="m-2 self-end" />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
                        Host Dashboard
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => {
                                const isActive = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                className={cn(
                                                    "flex items-center gap-3 hover:bg-primary/10 transition-all",
                                                    isActive && "bg-primary/20 border-l-4 border-primary text-primary font-medium"
                                                )}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {!isCollapsed && (
                                                    <>
                                                        <span>{item.title}</span>
                                                        {item.title === "Inbox" && unreadCount > 0 && (
                                                            <Badge className="ml-auto bg-primary">{unreadCount}</Badge>
                                                        )}
                                                    </>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link
                                        to="/"
                                        className="flex items-center gap-3 hover:bg-muted transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        {!isCollapsed && <span>Back to Main Site</span>}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {!isCollapsed && <span>Logout</span>}
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
