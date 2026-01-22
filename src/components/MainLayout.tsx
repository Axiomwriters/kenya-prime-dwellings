import { useState, useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LocationAgentWidget } from "@/components/LocationAgentWidget";

export default function MainLayout() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 0;
            setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Show back button on all pages except home
    const showBackButton = location.pathname !== "/";

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="min-h-screen flex w-full bg-background relative">
                {/* Fixed Full-Width Header */}
                <div className="fixed top-0 left-0 right-0 z-[60]">
                    <HeaderWrapper
                        isScrolled={isScrolled}
                        onOpenTrip={() => setIsProfileOpen(true)}
                    />
                </div>

                {/* Sidebar - Pushed down by header */}
                <div
                    className={cn(
                        "fixed left-0 z-50 transition-all duration-150 ease-out hidden lg:block border-r border-border/50",
                        isScrolled ? "top-[64px] h-[calc(100vh-64px)]" : "top-[104px] h-[calc(100vh-104px)]"
                    )}
                >
                    <AppSidebar
                        isScrolled={isScrolled}
                        onOpenProfile={() => setIsProfileOpen(true)}
                    />
                </div>

                {/* Main Content Area */}
                <SidebarInset className="flex-1 w-full pl-0 lg:pl-[3rem]">
                    <div
                        className={cn(
                            "min-h-screen bg-background transition-all duration-150 ease-out",
                            isScrolled ? "pt-[64px]" : "pt-[104px]"
                        )}
                    >
                        {/* {showBackButton && (
                            <div className="w-full px-4 md:px-8 pt-4 pb-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(-1)}
                                    className="group gap-2 text-muted-foreground hover:text-foreground pl-2 pr-4"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back
                                </Button>
                            </div>
                        )} */}
                        <Outlet />
                    </div>
                </SidebarInset>

                {/* Global Components */}
                <ProfileDrawer
                    open={isProfileOpen}
                    onOpenChange={setIsProfileOpen}
                />
                <LocationAgentWidget />
            </div>
        </SidebarProvider>
    );
}
