import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Users,
    Shield,
    List,
    Settings,
    ArrowLeft,
    LogOut,
    FileText,
    BarChart3,
    DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserProfileCard } from "@/components/UserProfileCard";
import { ProfileDrawer } from "@/components/ProfileDrawer";

const adminItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Verifications", url: "/admin/verifications", icon: Shield },
    { title: "Listings", url: "/admin/listings", icon: List },
    { title: "Insights", url: "/admin/insights", icon: BarChart3 },
    { title: "Reports", url: "/admin/reports", icon: FileText },
    { title: "System Tools", url: "/admin/tools", icon: Settings },
    { title: "Financial Hub", url: "/admin/financials", icon: DollarSign },
    { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const { state } = useSidebar();
    const { signOut } = useAuth();
    const location = useLocation();
    const isCollapsed = state === "collapsed";
    const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully");
    };

    return (
        <>
            <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
                <SidebarTrigger className="m-2 self-end" />

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
                            Admin Dashboard
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminItems.map((item) => {
                                    const isActive = location.pathname === item.url || (item.url !== "/admin" && location.pathname.startsWith(item.url));
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
                                                    {!isCollapsed && <span>{item.title}</span>}
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

                <SidebarFooter className="mt-auto border-t border-primary/10 bg-background/95 backdrop-blur-xl">
                    <UserProfileCard onOpenProfile={() => setIsProfileDrawerOpen(true)} />
                </SidebarFooter>
            </Sidebar>

            <ProfileDrawer
                open={isProfileDrawerOpen}
                onOpenChange={setIsProfileDrawerOpen}
            />
        </>
    );
}
