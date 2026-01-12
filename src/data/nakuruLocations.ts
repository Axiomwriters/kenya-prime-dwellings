export interface NakuruZone {
  name: string;
  type: "City" | "Town" | "Suburb" | "Estate" | "Ward" | "Area";
  parentRegion?: string; // e.g. "Nakuru City" is parent of "Milimani"
  description?: string;
  propertyTypes?: string[]; // Common property types found here
}

export const NAKURU_LOCATIONS: NakuruZone[] = [
  // 🏙️ Central Nakuru City & Suburbs
  { name: "Nakuru City", type: "City", description: "The primary urban hub." },
  { name: "Nakuru CBD", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Office", "Shop", "Apartment"] },
  { name: "Freehold Area", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Apartment", "House", "Office"] },
  { name: "Section 58", type: "Estate", parentRegion: "Nakuru City", propertyTypes: ["House", "Apartment"] },
  { name: "Barnabas", type: "Estate", parentRegion: "Nakuru City", propertyTypes: ["House", "Apartment"] },
  { name: "Milimani Estate", type: "Estate", parentRegion: "Nakuru City", propertyTypes: ["Luxury House", "Apartment"] },
  { name: "Kiamunyi", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["House", "Land", "Villa"] },
  { name: "Pipeline", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Apartment", "House"] },
  { name: "Whitehouse / Kiti", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Apartment", "House"] },
  { name: "London", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Apartment", "Student Housing"] },
  { name: "Kaptembwo", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Affordable Housing", "Apartment"] },
  { name: "Shabab", type: "Suburb", parentRegion: "Nakuru City" },
  { name: "Rhoda", type: "Suburb", parentRegion: "Nakuru City" },
  { name: "Kapkures", type: "Suburb", parentRegion: "Nakuru City" },
  { name: "Barut", type: "Suburb", parentRegion: "Nakuru City" },
  { name: "Mwariki", type: "Suburb", parentRegion: "Nakuru City" },
  { name: "Cool Rivers / Kiondo", type: "Suburb", parentRegion: "Nakuru City" },
  { name: "Uchumi 44 / Bahamas", type: "Area", parentRegion: "Nakuru City" },

  // 🏘️ Other Nakuru Town Sub-Regions
  { name: "Lanet", type: "Suburb", parentRegion: "Nakuru City", propertyTypes: ["Land", "House"] },
  { name: "Free Area extension", type: "Area", parentRegion: "Nakuru City" },
  { name: "Umoja / Lanet-Umoja", type: "Area", parentRegion: "Nakuru City" },
  { name: "Eldoret Road Corridor", type: "Area", parentRegion: "Nakuru City", propertyTypes: ["Commercial", "Land"] },
  { name: "Kenlands / Sita", type: "Area", parentRegion: "Nakuru City" },
  { name: "Racecourse / Teacher Estate", type: "Estate", parentRegion: "Nakuru City", description: "Common for residential, rentals, and some commercial plots." },

  // 🌆 Other Major Towns & Growth Areas
  // Naivasha
  { name: "Naivasha", type: "Town", description: "Major town with lots of land & residential plots." },
  { name: "Naivasha Town", type: "Area", parentRegion: "Naivasha" },
  { name: "Longonot View Estates", type: "Estate", parentRegion: "Naivasha" },
  { name: "Naivasha East", type: "Area", parentRegion: "Naivasha" },
  { name: "Viwandani", type: "Ward", parentRegion: "Naivasha" },
  { name: "Biashara", type: "Ward", parentRegion: "Naivasha" },

  // Njoro
  { name: "Njoro", type: "Town", description: "Good for large plots, student rental markets near Egerton." },
  { name: "Njoro Town", type: "Area", parentRegion: "Njoro" },
  { name: "Mau Narok", type: "Area", parentRegion: "Njoro" },
  { name: "Egerton University Area", type: "Area", parentRegion: "Njoro", propertyTypes: ["Student Housing", "Land"] },

  // Rongai & Salgaa
  { name: "Rongai", type: "Town" },
  { name: "Rongai Town", type: "Area", parentRegion: "Rongai" },
  { name: "Salgaa Area", type: "Area", parentRegion: "Rongai", propertyTypes: ["Land", "Mixed-Use"] },

  // Molo
  { name: "Molo", type: "Town", description: "Large town with houses, land and rentals near Mau Forest region." },
  { name: "Molo Town", type: "Area", parentRegion: "Molo" },

  // Gilgil
  { name: "Gilgil", type: "Town", description: "Residential & land opportunities with decent connectivity." },
  { name: "Gilgil Town", type: "Area", parentRegion: "Gilgil" },

  // Subukia & Solai
  { name: "Subukia", type: "Town", description: "Land and rural titles — good for farms and subdivisions." },
  { name: "Subukia Ward", type: "Ward", parentRegion: "Subukia" },
  { name: "Solai", type: "Town" },
  { name: "Solai Town", type: "Area", parentRegion: "Solai" }
];

export const PROPERTY_TYPES_BY_REGION = {
  "Nakuru CBD": ["Office", "Shop", "Apartment"],
  "Milimani Estate": ["Luxury House", "Apartment"],
  "Kiamunyi": ["Land", "House", "Villa"],
  // Add more mappings if needed for specific logic
};
