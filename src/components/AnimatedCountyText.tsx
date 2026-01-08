import { useState, useEffect } from "react";
import { useLocations } from "@/hooks/useLocations";

const fallbackLocations = [
  "Nakuru City", "Naka Estate", "Section 58", "Milimani", "Free Area",
  "Kiamunyi", "Pipeline", "Shabab", "Bondeni", "Kaptembwa", "Mawanga",
  "Rhoda", "Biashara", "Barut", "London Estate", "Whitehouse", "Langa Langa",
  "Lanet", "Rongai", "Njoro", "Molo", "Bahati", "Mai Mahiu", "Subukia",
  "Salgaa", "Elementaita", "Industrial Area", "Racecourse", "Ngata"
];

export function AnimatedCountyText() {
  const { data: dynamicLocations } = useLocations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use dynamic data if available and has items, otherwise fallback
  const displayLocations = (dynamicLocations && dynamicLocations.length > 0)
    ? dynamicLocations
    : fallbackLocations;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % displayLocations.length);
        setIsAnimating(false);
      }, 300); // Half of transition duration for smooth effect

    }, 2000); // Each location displays for 2 seconds

    return () => clearInterval(interval);
  }, [displayLocations.length]);

  return (
    <span
      className={`inline-block transition-all duration-500 ease-in-out ${isAnimating
        ? 'opacity-0 transform -translate-y-2'
        : 'opacity-100 transform translate-y-0'
        }`}
      style={{ minWidth: '200px', textAlign: 'left' }}
    >
      {displayLocations[currentIndex]}
    </span>
  );
}