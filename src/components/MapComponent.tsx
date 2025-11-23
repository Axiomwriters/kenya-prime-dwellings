import { useEffect, useRef } from "react";

interface MapComponentProps {
  location: string;
  className?: string;
}

export function MapComponent({ location, className = "" }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Placeholder for Google Maps initialization
    // In a real implementation, we would load the Google Maps script here
    // and initialize the map with the given location.
    console.log("Map initialized for location:", location);
  }, [location]);

  return (
    <div 
      ref={mapRef} 
      className={`bg-muted flex items-center justify-center text-muted-foreground ${className}`}
      style={{ minHeight: "300px" }}
    >
      <div className="text-center p-4">
        <p className="font-semibold">Map View</p>
        <p className="text-sm">Location: {location}</p>
        <p className="text-xs mt-2">(Google Maps API Key required)</p>
      </div>
    </div>
  );
}
