import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ListingHealthStats } from "./components/command-center/ListingHealthStats";
import { ListingFilters } from "./components/command-center/ListingFilters";
import { ListingCommandItem } from "./components/command-center/ListingCommandItem";
import { EmptyListingState } from "./components/command-center/EmptyListingState";
import { AddListingModal } from "./components/add-listing-modal/AddListingModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function MyListings() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All Listings");
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);

  const { data: listings, isLoading } = useQuery({
    queryKey: ["agent-listings", user?.id],
    queryFn: async () => {
      // Return null on error to trigger fallback to mock data
      try {
        const { data, error } = await supabase
          .from("agent_listings")
          .select("*")
          .eq("agent_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          return null;
        }
        return data;
      } catch (err) {
        console.error("Fetch error:", err);
        return null;
      }
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Use real listings from database
  const displayListings = listings || [];
  
  // Filter logic
  const filteredListings = activeFilter === "All Listings" 
    ? displayListings 
    : activeFilter === "Active" 
      ? displayListings.filter((l: any) => l.status === 'approved')
      : activeFilter === "Draft" 
        ? displayListings.filter((l: any) => l.status === 'draft')
        : displayListings;

  return (
    <div className="space-y-8">
      <AddListingModal open={isAddListingOpen} onOpenChange={setIsAddListingOpen} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listing Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage, optimize, and track your property portfolio performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI Insights
          </Button>
          <Button onClick={() => setIsAddListingOpen(true)} className="bg-primary shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </div>
      </div>

      {/* Top Stats Section */}
      <ListingHealthStats />

      {/* Main Content Area */}
      <div className="space-y-6">
        <ListingFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {!filteredListings || filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-accent/20">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Your Portfolio is Empty</h3>
            <p className="text-muted-foreground max-w-sm mt-1 mb-6">
              Add properties to see them listed here with performance metrics and AI insights.
            </p>
            <Button onClick={() => setIsAddListingOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Add Property
            </Button>
          </div>
        ) : (
          <div className="px-4 lg:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {filteredListings.map((listing) => (
                  <CarouselItem key={listing.id} className="basis-[90%] md:basis-1/2 lg:basis-1/3 pl-4">
                    <ListingCommandItem listing={listing} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden lg:block">
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
}
