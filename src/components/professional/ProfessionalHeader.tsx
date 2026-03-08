
import React from 'react';
import { Button } from "@/components/ui/button";
import '@/styles/professional.css';

const ProfessionalHeader = () => {
  return (
    <header className="professional-header">
      <div className="professional-header-container">
        <img src="/Savanahdwell.png" alt="Savanah" style={{ height: '60px' }} />
        <nav className="professional-nav">
          <Button variant="outline" size="sm">Sign In</Button>
        </nav>
      </div>
    </header>
  );
};

export default ProfessionalHeader;
