export interface RawPropertyListing {
  "Property Title": string;
  "Property URL": string;
  "Property Image": string;
  "Price (KSh)": string;
  Location: string;
  "Agent Name": string;
  "Number of Bedrooms"?: string;
  "Number of Bathrooms"?: string;
  "Land Size"?: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  priceFormatted: string;
  location: string;
  images: string[];
  propertyUrl: string;
  agentName: string;
  category: "house" | "land";
  listingType: "sale" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  landSize?: string;
}
