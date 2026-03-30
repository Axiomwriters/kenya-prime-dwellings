import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AgencyModeContextType {
  isAgencyMode: boolean;
  setIsAgencyMode: (value: boolean) => void;
  toggleMode: () => void;
}

const AgencyModeContext = createContext<AgencyModeContextType | undefined>(undefined);

export function AgencyModeProvider({ children }: { children: ReactNode }) {
  const [isAgencyMode, setIsAgencyMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("agency_mode");
    if (saved) {
      setIsAgencyMode(saved === "true");
    }
  }, []);

  // Save to localStorage when changed
  const handleSetMode = (value: boolean) => {
    setIsAgencyMode(value);
    localStorage.setItem("agency_mode", String(value));
  };

  const toggleMode = () => {
    handleSetMode(!isAgencyMode);
  };

  return (
    <AgencyModeContext.Provider value={{ isAgencyMode, setIsAgencyMode: handleSetMode, toggleMode }}>
      {children}
    </AgencyModeContext.Provider>
  );
}

export function useAgencyMode() {
  const context = useContext(AgencyModeContext);
  if (!context) {
    throw new Error("useAgencyMode must be used within AgencyModeProvider");
  }
  return context;
}
