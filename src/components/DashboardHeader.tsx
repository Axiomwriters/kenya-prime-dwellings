
import React from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ searchTerm, onSearchChange }) => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
            Savanah Dwelling
          </h1>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Nakuru's Premier Property Platform
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
