import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TopHeaderBar } from "@/components/TopHeaderBar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function HeaderWrapper() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [isScrolled, setIsScrolled] = useState(false);

    // Sync local state with URL params
    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0.5);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term) {
            setSearchParams({ search: term });
            searchParams.delete("search");
            setSearchParams(searchParams);
        }
    };

    return (
        <div className="flex flex-col w-full z-[60] sticky top-0">
            <div
                className={cn(
                    "bg-background/95 backdrop-blur-xl border-b border-border/20 overflow-hidden transition-all duration-500 ease-in-out",
                    isScrolled ? "h-0 opacity-0" : "h-[40px] opacity-100"
                )}
            >
                <TopHeaderBar />
            </div>
            <div
                className={cn(
                    "w-full border-b border-border/40 transition-all duration-300",
                    isScrolled
                        ? "bg-background/70 backdrop-blur-xl shadow-md"
                        : "bg-background shadow-sm"
                )}
            >
                <DashboardHeader
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                />
            </div>
        </div>
    );
}
