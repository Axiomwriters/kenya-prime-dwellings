import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";

export default function MainLayout() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0.5);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <SidebarProvider defaultOpen={false}>
            <div className="min-h-screen flex w-full bg-background relative">
                {/* Fixed Full-Width Header */}
                <div className="fixed top-0 left-0 right-0 z-[60]">
                    <HeaderWrapper />
                </div>

                {/* Sidebar - Pushed down by header */}
                <div
                    className={cn(
                        "fixed left-0 z-50 transition-all duration-75 hidden lg:block border-r border-border/50",
                        isScrolled ? "top-[64px] h-[calc(100vh-64px)]" : "top-[104px] h-[calc(100vh-104px)]"
                    )}
                >
                    <AppSidebar />
                </div>

                {/* Main Content Area */}
                <SidebarInset className="flex-1 w-full pl-0 lg:pl-[3rem]">
                    <div
                        className={cn(
                            "min-h-screen bg-background transition-all duration-75",
                            isScrolled ? "pt-[64px]" : "pt-[104px]"
                        )}
                    >
                        <Outlet />
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
