import { useState, useEffect } from "react";
import { Home, Building2, Briefcase, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

export function Preloader() {
    const [activeIconIndex, setActiveIconIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const icons = [
        { icon: Home, label: "House", color: "text-green-500" },
        { icon: Building2, label: "Apartment", color: "text-blue-500" },
        { icon: Briefcase, label: "Office", color: "text-purple-500" },
        { icon: HardHat, label: "Construction", color: "text-orange-500" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIconIndex((prev) => (prev + 1) % icons.length);
        }, 500); // Change icon every 500ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="relative flex flex-col items-center">
                {/* Animated Icons */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                    {icons.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = index === activeIconIndex;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center transition-all duration-500 transform",
                                    isActive
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-50 translate-y-4"
                                )}
                            >
                                <Icon className={cn("w-20 h-20", item.color)} strokeWidth={1.5} />
                            </div>
                        );
                    })}
                </div>

                {/* Brand Name */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-pulse">
                        Kenya Prime Dwellings
                    </h1>
                    <div className="h-6 overflow-hidden relative">
                        {icons.map((item, index) => (
                            <p
                                key={index}
                                className={cn(
                                    "absolute w-full text-center text-muted-foreground text-sm transition-all duration-500 transform",
                                    index === activeIconIndex
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-full"
                                )}
                            >
                                Finding your perfect {item.label.toLowerCase()}...
                            </p>
                        ))}
                    </div>
                </div>

                {/* Loading Bar */}
                <div className="mt-8 w-48 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-indeterminate origin-left" />
                </div>
            </div>
        </div>
    );
}
