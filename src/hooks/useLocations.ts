import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLocations() {
    return useQuery({
        queryKey: ["listing-locations"],
        queryFn: async () => {
            // Fetch all approved listings to extract unique locations
            // We select 'location' and 'category' to ensure we cover everything, 
            // though we really just need unique locations regardless of type.
            const { data, error } = await supabase
                .from("agent_listings")
                .select("location")
                .eq("status", "approved");

            if (error) {
                console.error("Error fetching locations:", error);
                return [];
            }

            // Extract unique locations and sort valid ones
            const uniqueLocations = Array.from(new Set(data.map(item => item.location)))
                .filter(Boolean)
                .sort();

            return uniqueLocations;
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
}
