import React from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Searchbar from './Searchbar';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ searchTerm, onSearchChange }) => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 lg:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div>
          <img src="/logo.svg" alt="Savanah" className="h-6" />
        </div>
      </div>
      <div className="hidden md:flex flex-1 max-w-lg px-4">
        <Searchbar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>
      <div className="flex items-center gap-2">
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
