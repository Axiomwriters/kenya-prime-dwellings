import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeaderWrapperProps {
  isScrolled?: boolean;
  onOpenTrip?: () => void;
  hideLogo?: boolean;
  hideSearchBar?: boolean;
  hideThemeSwitcher?: boolean;
  isAgentDashboard?: boolean;
  isMobileSidebarOpen?: boolean;
  onMobileToggle?: () => void;
}

export function HeaderWrapper({
  isScrolled = false,
  onOpenTrip,
  hideLogo = false,
  hideSearchBar = false,
  hideThemeSwitcher = false,
  isAgentDashboard = false,
  isMobileSidebarOpen = false,
  onMobileToggle,
}: HeaderWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term) {
      setSearchParams({ search: term });
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      setSearchParams(params);
    }
  };

  return (
    <div
      className={cn(
        "w-full border-b border-border/40 transition-all duration-150 ease-out",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-background shadow-sm"
      )}
    >
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/90">
        <div className="flex items-center gap-3">
          {!hideLogo && (
            <img src="/logo.svg" alt="Savanah Dwelling" className="h-8" />
          )}
          <h1 className="text-lg font-bold">Savanah Dwelling</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileToggle}
            className="md:hidden"
            aria-label={isMobileSidebarOpen ? "Close menu" : "Open menu"}
          >
            {isMobileSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Main dashboard header */}
      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        hideLogo={hideLogo}
        hideSearchBar={hideSearchBar}
        hideThemeSwitcher={hideThemeSwitcher}
        isAgentDashboard={isAgentDashboard}
      />
    </div>
  );
}
