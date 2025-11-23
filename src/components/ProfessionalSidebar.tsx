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
    User,
    Briefcase,
    FolderOpen,
    Bell,
    Settings,
    ArrowLeft,
    LogOut,
    FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mainItems = [
    { title: "Dashboard", url: "/professional", icon: LayoutDashboard },
    { title: "My Profile", url: "/professional/profile", icon: User },
    { title: "My Services", url: "/professional/services", icon: Briefcase },
    { title: "Projects", url: "/professional/projects", icon: FolderOpen },
    { title: "Requests", url: "/professional/requests", icon: FileText, badge: 2 },
    { title: "Notifications", url: "/professional/notifications", icon: Bell, badge: 3 },
    { title: "Settings", url: "/professional/settings", icon: Settings },
];

export function ProfessionalSidebar() {
    const { state } = useSidebar();
    const { user, signOut } = useAuth();
    const location = useLocation();
    const isCollapsed = state === "collapsed";
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) fetchCounts();
    }, [user]);

    const fetchCounts = async () => {
        try {
            const { count: unread } = await supabase
                .from("notifications")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user!.id)
                .eq("read", false);

            setUnreadCount(unread || 0);
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

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
                        Professional Dashboard
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => {
                                const isActive = location.pathname === item.url;
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
                                                        {item.title === "Notifications" && unreadCount > 0 && (
                                                            <Badge className="ml-auto bg-primary">{unreadCount}</Badge>
                                                        )}
                                                        {item.title === "Requests" && (
                                                            <Badge className="ml-auto bg-yellow-500">2</Badge>
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
