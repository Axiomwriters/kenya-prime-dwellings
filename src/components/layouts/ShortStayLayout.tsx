import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useState } from "react";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { Search, Globe, Menu } from "lucide-react";

export default function ShortStayLayout() {
    const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/short-stay" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <span>KenyaPrime Stays</span>
                    </Link>

                    {/* Search Bar (Compact) */}
                    <div className="hidden md:flex items-center border rounded-full shadow-sm hover:shadow-md transition-shadow px-4 py-2 gap-4 cursor-pointer">
                        <span className="text-sm font-medium">Anywhere</span>
                        <span className="border-l h-4"></span>
                        <span className="text-sm font-medium">Any week</span>
                        <span className="border-l h-4"></span>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            Add guests
                            <div className="bg-primary rounded-full p-1 text-white">
                                <Search className="w-3 h-3" />
                            </div>
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/host" className="text-sm font-medium hover:bg-muted px-4 py-2 rounded-full transition-colors">
                            Switch to hosting
                        </Link>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Globe className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-2 border rounded-full p-1 pl-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsProfileDrawerOpen(true)}>
                            <Menu className="w-4 h-4" />
                            <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center overflow-hidden">
                                {/* Placeholder Avatar */}
                                <img src="https://github.com/shadcn.png" alt="User" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer (Simple) */}
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2024 Kenya Prime Dwellings. All rights reserved.
                    </p>
                </div>
            </footer>

            <ProfileDrawer
                open={isProfileDrawerOpen}
                onOpenChange={setIsProfileDrawerOpen}
            />
        </div>
    );
}
