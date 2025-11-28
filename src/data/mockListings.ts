import villaLavington from "@/assets/villa-lavington.jpg";
import apartmentWestlands from "@/assets/apartment-westlands.jpg";
import bungalowKaren from "@/assets/bungalow-karen.jpg";
import hotelCbd from "@/assets/hotel-cbd-nairobi.jpg";
import houseRunda from "@/assets/house-runda.jpg";
import houseSyokimau from "@/assets/house-syokimau.jpg";
import apartmentRiverside from "@/assets/apartment-riverside.jpg";
import houseThikaRoad from "@/assets/house-thika-road.jpg";
import apartmentKilimani from "@/assets/apartment-kilimani.jpg";
import houseKiambu from "@/assets/house-kiambu.jpg";
import hotelGigiri from "@/assets/hotel-gigiri.jpg";
import apartmentParklands from "@/assets/apartment-parklands.jpg";

export interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    image: string;
    bedrooms: number;
    bathrooms: number;
    land_size: string;
    listing_type: "sale" | "rent" | "short_stay";
    category: "Residential" | "Commercial" | "Land" | "Townhouse" | "Maisonette" | "Villa" | "Bungalow" | "Apartment" | "Office" | "Shop";
    description: string;
    agent_id?: string;
    created_at: string;
    status: "approved" | "pending" | "sold";
}

export const mockProperties: Property[] = [
    {
        id: "mock-1",
        title: "Luxury Villa in Lavington",
        price: 85000000,
        location: "Lavington, Nairobi",
        image: villaLavington,
        bedrooms: 5,
        bathrooms: 6,
        land_size: "0.5 acres",
        listing_type: "sale",
        category: "Residential",
        description: "Exquisite 5-bedroom villa with a private pool, lush gardens, and modern finishes. Located in the heart of Lavington.",
        created_at: "2023-10-15T10:00:00Z",
        status: "approved"
    },
    {
        id: "mock-2",
        title: "Modern Apartment in Westlands",
        price: 18000000,
        location: "Westlands, Nairobi",
        image: apartmentWestlands,
        bedrooms: 3,
        bathrooms: 3,
        land_size: "180 sqm",
        listing_type: "sale",
        category: "Residential",
        description: "Spacious 3-bedroom apartment with panoramic city views, gym access, and high-speed elevators.",
        created_at: "2023-11-02T14:30:00Z",
        status: "approved"
    },
    {
        id: "mock-3",
        title: "Cozy Bungalow in Karen",
        price: 65000000,
        location: "Karen, Nairobi",
        image: bungalowKaren,
        bedrooms: 4,
        bathrooms: 4,
        land_size: "1 acre",
        listing_type: "sale",
        category: "Residential",
        description: "Charming bungalow set on a 1-acre plot with mature trees. Features a fireplace, large patio, and staff quarters.",
        created_at: "2023-09-20T09:15:00Z",
        status: "approved"
    },
    {
        id: "mock-4",
        title: "Prime Commercial Space in CBD",
        price: 250000,
        location: "CBD, Nairobi",
        image: hotelCbd,
        bedrooms: 0,
        bathrooms: 2,
        land_size: "2000 sqft",
        listing_type: "rent",
        category: "Commercial",
        description: "Ideally located office space in the CBD. Open plan layout, ready for partitioning. High foot traffic area.",
        created_at: "2023-11-10T11:45:00Z",
        status: "approved"
    },
    {
        id: "mock-5",
        title: "Executive House in Runda",
        price: 120000000,
        location: "Runda, Nairobi",
        image: houseRunda,
        bedrooms: 6,
        bathrooms: 7,
        land_size: "0.75 acres",
        listing_type: "sale",
        category: "Residential",
        description: "Grand 6-bedroom ambassadorial house in the prestigious Runda estate. High security, swimming pool, and guest wing.",
        created_at: "2023-10-05T16:20:00Z",
        status: "approved"
    },
    {
        id: "mock-6",
        title: "Affordable House in Syokimau",
        price: 14500000,
        location: "Syokimau, Machakos",
        image: houseSyokimau,
        bedrooms: 4,
        bathrooms: 3,
        land_size: "1/8 acre",
        listing_type: "sale",
        category: "Residential",
        description: "Newly built 4-bedroom maisonette in a gated community. Close to the expressway and SGR station.",
        created_at: "2023-11-18T13:00:00Z",
        status: "approved"
    },
    {
        id: "mock-7",
        title: "Riverside Apartment",
        price: 22000000,
        location: "Riverside, Nairobi",
        image: apartmentRiverside,
        bedrooms: 2,
        bathrooms: 2,
        land_size: "120 sqm",
        listing_type: "sale",
        category: "Residential",
        description: "Stylish 2-bedroom apartment in the serene Riverside area. River views, rooftop terrace, and backup generator.",
        created_at: "2023-10-25T10:30:00Z",
        status: "approved"
    },
    {
        id: "mock-8",
        title: "Family Home on Thika Road",
        price: 16000000,
        location: "Thika Road, Nairobi",
        image: houseThikaRoad,
        bedrooms: 4,
        bathrooms: 4,
        land_size: "40x80",
        listing_type: "sale",
        category: "Residential",
        description: "Spacious family home with modern fittings. Located in a secure estate with easy access to Thika Superhighway.",
        created_at: "2023-11-05T15:10:00Z",
        status: "approved"
    },
    {
        id: "mock-9",
        title: "Luxury Apartment in Kilimani",
        price: 150000,
        location: "Kilimani, Nairobi",
        image: apartmentKilimani,
        bedrooms: 3,
        bathrooms: 3,
        land_size: "160 sqm",
        listing_type: "rent",
        category: "Residential",
        description: "Fully furnished 3-bedroom apartment. Walking distance to Yaya Centre. Includes housekeeping and internet.",
        created_at: "2023-11-12T09:00:00Z",
        status: "approved"
    },
    {
        id: "mock-10",
        title: "Country House in Kiambu",
        price: 45000000,
        location: "Kiambu Road, Kiambu",
        image: houseKiambu,
        bedrooms: 5,
        bathrooms: 5,
        land_size: "0.5 acres",
        listing_type: "sale",
        category: "Residential",
        description: "Beautiful country home surrounded by coffee plantations. serene environment, perfect for a family.",
        created_at: "2023-10-30T12:00:00Z",
        status: "approved"
    },
    {
        id: "mock-11",
        title: "Boutique Hotel in Gigiri",
        price: 350000000,
        location: "Gigiri, Nairobi",
        image: hotelGigiri,
        bedrooms: 12,
        bathrooms: 15,
        land_size: "1 acre",
        listing_type: "sale",
        category: "Commercial",
        description: "Operational boutique hotel near the UN headquarters. 12 ensuite rooms, restaurant, and conference facilities.",
        created_at: "2023-09-15T14:00:00Z",
        status: "approved"
    },
    {
        id: "mock-12",
        title: "Apartment in Parklands",
        price: 19000000,
        location: "Parklands, Nairobi",
        image: apartmentParklands,
        bedrooms: 3,
        bathrooms: 3,
        land_size: "170 sqm",
        listing_type: "sale",
        category: "Residential",
        description: "Contemporary 3-bedroom apartment with forest views. Close to Aga Khan Hospital and Diamond Plaza.",
        created_at: "2023-11-08T11:00:00Z",
        status: "approved"
    },
    {
        id: "mock-13",
        title: "Cozy Studio in Westlands",
        price: 4500,
        location: "Westlands, Nairobi",
        image: apartmentWestlands,
        bedrooms: 1,
        bathrooms: 1,
        land_size: "40 sqm",
        listing_type: "short_stay",
        category: "Apartment",
        description: "Modern studio apartment perfect for business travelers. High-speed wifi, gym access, and close to Sarit Centre.",
        created_at: "2023-11-20T08:00:00Z",
        status: "approved"
    },
    {
        id: "mock-14",
        title: "Beachfront Villa in Diani",
        price: 25000,
        location: "Diani, Kwale",
        image: villaLavington, // Reusing image for mock
        bedrooms: 4,
        bathrooms: 4,
        land_size: "0.5 acres",
        listing_type: "short_stay",
        category: "Villa",
        description: "Luxurious beachfront villa with private pool and chef. Perfect for family vacations.",
        created_at: "2023-11-22T10:00:00Z",
        status: "approved"
    },
    {
        id: "mock-15",
        title: "Safari Cottage in Naivasha",
        price: 15000,
        location: "Naivasha, Nakuru",
        image: bungalowKaren, // Reusing image for mock
        bedrooms: 2,
        bathrooms: 2,
        land_size: "5 acres",
        listing_type: "short_stay",
        category: "Bungalow",
        description: "Charming cottage with lake views. Great for weekend getaways and nature lovers.",
        created_at: "2023-11-25T09:00:00Z",
        status: "approved"
    }
];
