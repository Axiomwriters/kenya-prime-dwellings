import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./button";
import { Input } from "./input";
import { 
  Locate, Navigation, Search, Map, Satellite, 
  RotateCcw, RotateCw, Save, Trash2, Check, 
  MapPin, X, Loader2, Crosshair
} from "lucide-react";

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  autoLocate?: boolean;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timestamp: number;
}

interface LocationHistory {
  lat: number;
  lng: number;
  address?: string;
  timestamp: number;
}

const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];
const STORAGE_KEY = "saved_locations";

export function MapPicker({ lat, lng, onLocationChange, autoLocate = false }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [history, setHistory] = useState<LocationHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveLocation = (name: string) => {
    if (!markerRef.current) return;
    const position = markerRef.current.getLatLng();
    const newLocation: SavedLocation = {
      id: Date.now().toString(),
      name: name || `Location ${savedLocations.length + 1}`,
      lat: position.lat,
      lng: position.lng,
      timestamp: Date.now()
    };
    const updated = [...savedLocations, newLocation];
    setSavedLocations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteSavedLocation = (id: string) => {
    const updated = savedLocations.filter(l => l.id !== id);
    setSavedLocations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        const shortAddress = data.address?.road 
          ? `${data.address.road}${data.address.house_number ? ', ' + data.address.house_number : ''}, ${data.address.suburb || data.address.neighbourhood || ''}`
          : data.display_name.split(',').slice(0, 3).join(', ');
        setCurrentAddress(shortAddress || data.display_name);
      }
    } catch (error) {
      console.log("Reverse geocoding error:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ke`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) searchAddresses(searchQuery);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const addToHistory = useCallback((latitude: number, longitude: number) => {
    const newEntry: LocationHistory = {
      lat: latitude,
      lng: longitude,
      timestamp: Date.now()
    };
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), newEntry];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setMarkerPosition(prev.lat, prev.lng);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setMarkerPosition(next.lat, next.lng);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const setMarkerPosition = (latitude: number, longitude: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      const marker = L.marker([latitude, longitude], { 
        draggable: true,
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onLocationChange(pos.lat, pos.lng);
        addToHistory(pos.lat, pos.lng);
        reverseGeocode(pos.lat, pos.lng);
      });
      markerRef.current = marker;
    }

    map.setView([latitude, longitude], 16);
    onLocationChange(latitude, longitude);
    addToHistory(latitude, longitude);
    reverseGeocode(latitude, longitude);
  };

  const requestUserLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    // Check permission status first
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      if (permissionStatus.state === 'denied') {
        setLocationStatus('error');
        return;
      }
    } catch (e) {
      // Permission API not supported, proceed anyway
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setAccuracy(accuracy);
        
        const map = mapInstanceRef.current;
        if (map) {
          map.setView([latitude, longitude], 16);
          
          if (accuracyCircleRef.current) {
            accuracyCircleRef.current.setLatLng([latitude, longitude]);
            accuracyCircleRef.current.setRadius(accuracy);
          } else {
            const circle = L.circle([latitude, longitude], {
              radius: accuracy,
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.1,
              weight: 1
            }).addTo(map);
            accuracyCircleRef.current = circle;
          }
          
          setMarkerPosition(latitude, longitude);
        }
        setLocationStatus('success');
      },
      (error) => {
        console.log("Geolocation error:", error.code, error.message);
        setLocationStatus('error');
        setAccuracy(null);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: lat && lng ? [lat, lng] : NAIROBI_CENTER,
      zoom: lat && lng ? 15 : 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const standardLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    });

    const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: '&copy; Esri',
      maxZoom: 19,
    });

    standardLayer.addTo(map);
    (map as any).standardLayer = standardLayer;
    (map as any).satelliteLayer = satelliteLayer;

    if (lat && lng) {
      setMarkerPosition(lat, lng);
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat: newLat, lng: newLng } = e.latlng;
      
      if (accuracyCircleRef.current) {
        map.removeLayer(accuracyCircleRef.current);
        accuracyCircleRef.current = null;
      }
      setAccuracy(null);
      
      setMarkerPosition(newLat, newLng);
    });

    mapInstanceRef.current = map;

    if (autoLocate) {
      requestUserLocation();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!map) return;
      const currentZoom = map.getZoom();
      const moveAmount = 0.001;
      
      switch(e.key) {
        case 'ArrowUp': map.panBy([0, -30]); break;
        case 'ArrowDown': map.panBy([0, 30]); break;
        case 'ArrowLeft': map.panBy([-30, 0]); break;
        case 'ArrowRight': map.panBy([30, 0]); break;
        case '+': case '=': map.setZoom(currentZoom + 1); break;
        case '-': map.setZoom(currentZoom - 1); break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (mapStyle === 'satellite') {
      (map as any).standardLayer?.remove();
      (map as any).satelliteLayer?.addTo(map);
    } else {
      (map as any).satelliteLayer?.remove();
      (map as any).standardLayer?.addTo(map);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (navigator.geolocation) {
      const timer = setTimeout(() => {
        setShowLocationPrompt(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-hide prompt when location is determined
  useEffect(() => {
    if (locationStatus === 'success' || locationStatus === 'error') {
      setShowLocationPrompt(false);
    }
  }, [locationStatus]);

  return (
    <div className="relative">
      <div ref={mapRef} className="h-72 w-full rounded-md z-0" style={{ minHeight: "288px" }} />
      
      {/* Location Permission Prompt */}
      {showLocationPrompt && locationStatus !== 'success' && (
        <div className="absolute top-3 left-3 right-3 z-[1001]">
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-full">
                <Locate className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Enable location for accurate pinning</p>
                <p className="text-xs text-white/80">Browser will ask for permission - click "Allow"</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => {
                  setShowLocationPrompt(false);
                }}
              >
                Skip
              </Button>
              <Button 
                size="sm" 
                className="bg-white text-primary hover:bg-white/90"
                disabled={locationStatus === 'loading'}
                onClick={() => {
                  setShowLocationPrompt(false);
                  requestUserLocation();
                }}
              >
                {locationStatus === 'loading' ? 'Getting location...' : 'Enable Location'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className={`absolute top-3 left-3 right-3 z-[1000] flex gap-2 ${showLocationPrompt && locationStatus !== 'success' ? 'mt-20' : ''}`}>
        <div className="flex-1 relative">
          <Button 
            size="sm" 
            variant="secondary"
            className="w-full justify-start gap-2 shadow-md bg-white"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="w-4 h-4" />
            {currentAddress ? (
              <span className="truncate text-xs">{currentAddress}</span>
            ) : (
              <span className="text-xs text-muted-foreground">Search location...</span>
            )}
          </Button>
          
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border z-[1001] max-h-64 overflow-auto">
              <div className="p-2">
                <Input
                  placeholder="Search address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
              </div>
              {isSearching && (
                <div className="p-4 flex justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="border-t">
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      className="w-full p-3 text-left hover:bg-muted text-sm border-b last:border-0"
                      onClick={() => {
                        setMarkerPosition(parseFloat(result.lat), parseFloat(result.lon));
                        setCurrentAddress(result.display_name.split(',').slice(0, 3).join(', '));
                        setShowSearch(false);
                        setSearchResults([]);
                        setSearchQuery("");
                      }}
                    >
                      <div className="font-medium truncate">{result.display_name.split(',').slice(0, 2).join(', ')}</div>
                      <div className="text-xs text-muted-foreground truncate">{result.display_name.split(',').slice(2).join(', ')}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="secondary"
            className="shadow-md"
            onClick={() => setMapStyle(mapStyle === 'standard' ? 'satellite' : 'standard')}
            title={mapStyle === 'standard' ? 'Satellite view' : 'Map view'}
          >
            {mapStyle === 'standard' ? <Satellite className="w-4 h-4" /> : <Map className="w-4 h-4" />}
          </Button>
          
          <Button 
            size="sm" 
            variant="secondary"
            className="shadow-md"
            onClick={() => setShowSaved(!showSaved)}
            title="Saved locations"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showSaved && (
        <div className="absolute top-20 left-3 right-3 md:left-auto md:w-64 bg-white rounded-md shadow-lg border z-[1001] max-h-48 overflow-auto">
          <div className="p-2 border-b flex justify-between items-center">
            <span className="text-sm font-medium">Saved Locations</span>
            <button onClick={() => setShowSaved(false)}><X className="w-4 h-4" /></button>
          </div>
          {savedLocations.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">No saved locations yet</p>
          ) : (
            <div className="max-h-32 overflow-auto">
              {savedLocations.map((loc) => (
                <div key={loc.id} className="p-2 hover:bg-muted flex justify-between items-center text-sm border-b last:border-0">
                  <button 
                    className="flex-1 text-left truncate"
                    onClick={() => {
                      setMarkerPosition(loc.lat, loc.lng);
                      setShowSaved(false);
                    }}
                  >
                    <div className="font-medium truncate">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
                  </button>
                  <button 
                    className="p-1 hover:bg-red-100 rounded"
                    onClick={() => deleteSavedLocation(loc.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="absolute top-3 right-12 md:right-28 z-[1000] flex gap-1">
        <Button 
          size="sm" 
          variant="secondary"
          className="shadow-md"
          onClick={undo}
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="secondary"
          className="shadow-md"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-3 z-[1000] flex gap-1">
        <Button 
          type="button"
          size="sm" 
          variant={locationStatus === 'success' ? "default" : "secondary"}
          className="shadow-md gap-1"
          onClick={requestUserLocation}
          disabled={locationStatus === 'loading'}
        >
          {locationStatus === 'loading' ? (
            <Navigation className="w-4 h-4 animate-spin" />
          ) : locationStatus === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <Locate className="w-4 h-4" />
          )}
          {locationStatus === 'success' ? 'Located' : 'My Location'}
        </Button>
        
        {accuracy !== null && (
          <div className="bg-white/90 px-2 py-1 rounded-md shadow text-xs flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-green-500" />
            ±{Math.round(accuracy)}m
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-3 z-[1000] flex gap-1">
        {markerRef.current && (
          <Button 
            size="sm" 
            variant="secondary"
            className="shadow-md gap-1"
            onClick={() => {
              const name = prompt("Name this location:");
              if (name !== null) saveLocation(name);
            }}
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
        )}
      </div>

      {locationStatus === 'error' && (
        <div className="absolute bottom-16 left-3 right-3 md:left-auto md:w-64 bg-red-50 border border-red-200 rounded-md p-2 z-[1000]">
          <p className="text-xs text-red-600">Location access denied. Click on map to pin manually.</p>
        </div>
      )}
    </div>
  );
}
