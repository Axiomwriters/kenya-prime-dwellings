import React from 'react';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="hidden lg:block">
      <h1 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
        Savanah Dwellings
      </h1>
      <p className="text-xs text-muted-foreground whitespace-nowrap">
        Nakuru's Premier Property Platform
      </p>
    </div>
  );
};

export default DashboardHeader;
