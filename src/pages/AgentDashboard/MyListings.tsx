import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ListingCard } from "@/components/ListingCard";

export default function MyListings() {
  const { user } = useAuth();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["agent-listings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_listings")
        .select("*")
        .eq("agent_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Link to="/agent/listings/new">
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No listings yet. Create your first listing to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              property={{
                id: listing.id,
                title: listing.title,
                price: listing.price,
                priceFormatted: `KSh ${listing.price.toLocaleString()}`,
                location: listing.location,
                images: listing.images || [],
                propertyUrl: `/properties/${listing.id}`,
                agentName: "Me", // We can fetch agent profile if needed, but 'Me' is fine for own listings
                category: listing.category,
                listingType: listing.listing_type,
                bedrooms: listing.bedrooms || 0,
                bathrooms: listing.bathrooms || 0,
                landSize: listing.land_size || undefined,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
