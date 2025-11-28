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
                <div
                    className={cn(
                        "absolute left-0 z-50 transition-all duration-300 hidden lg:block",
                        isScrolled ? "top-[56px] h-[calc(100%-56px)]" : "top-[96px] h-[calc(100%-96px)]"
                    )}
                >
                    <AppSidebar />
                </div>
                <SidebarInset className="flex-1 w-full pl-0 lg:pl-[3rem]">
                    <div className="min-h-screen bg-background">
                        <HeaderWrapper />
                        <Outlet />
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
