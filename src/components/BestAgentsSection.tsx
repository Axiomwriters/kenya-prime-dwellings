import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgentCard } from "./AgentCard";
import { AgentRegistrationDialog } from "./AgentRegistrationDialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AgentData {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  totalListings: number;
  priceRange: string;
  specialization: string;
  avatar?: string;
}

export function BestAgentsSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopAgents();
  }, []);

  const fetchTopAgents = async () => {
    try {
      setLoading(true);

      // Fetch agents with their listing counts
      // First, get approved agent user IDs
      const { data: verifiedAgents, error: verError } = await supabase
        .from('agent_verifications')
        .select('user_id')
        .eq('status', 'approved');

      if (verError) throw verError;

      if (!verifiedAgents || verifiedAgents.length === 0) {
        setAgents([]);
        setLoading(false);
        return;
      }

      const agentIds = verifiedAgents.map(v => v.user_id);

      // Then fetch their profiles
      const { data: agentsData, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          avatar_url,
          county,
          city
        `)
        .in('id', agentIds)
        .limit(10);

      if (error) throw error;

      if (!agentsData || agentsData.length === 0) {
        setAgents([]);
        setLoading(false);
        return;
      }

      // For each agent, get their approved listings count
      const agentsWithListings = await Promise.all(
        agentsData.map(async (agent) => {
          const { count } = await supabase
            .from("agent_listings")
            .select("*", { count: "exact", head: true })
            .eq("agent_id", agent.id)
            .eq("status", "approved");

          // Calculate rating based on verification and listings
          const listingCount = count || 0;
          const baseRating = 4.5;
          const rating = Math.min(5, baseRating + (listingCount > 5 ? 0.4 : listingCount * 0.08));
          
          // Calculate reviews (mock based on listings)
          const reviews = Math.floor(listingCount * 8 + Math.random() * 50);

          // Determine specialization
          const specializations = ["Luxury Homes", "Family Homes", "Apartments", "Executive Villas", "Commercial", "Land Sales"];
          const specialization = specializations[Math.floor(Math.random() * specializations.length)];

          return {
            id: agent.id,
            name: agent.full_name || "Agent",
            location: agent.city && agent.county ? `${agent.city}, ${agent.county}` : agent.county || agent.city || "Kenya",
            rating: parseFloat(rating.toFixed(1)),
            reviews,
            totalListings: listingCount,
            priceRange: `KSh ${(Math.random() * 8 + 1).toFixed(1)}M`,
            specialization,
            avatar: agent.avatar_url || undefined,
          };
        })
      );

      // Filter agents with at least 1 listing and sort by listing count
      const filteredAgents = agentsWithListings
        .filter(agent => agent.totalListings > 0)
        .sort((a, b) => b.totalListings - a.totalListings);

      setAgents(filteredAgents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in first to become an agent");
      navigate("/auth");
      return;
    }
    setShowRegistration(true);
  };

  const AgentCardWrapper = ({ agent, index }: { agent: AgentData; index: number }) => (
    <div 
      className="animate-scale-in w-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <AgentCard agent={agent} />
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Top Listing Agents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet our highly rated property experts who have helped thousands of clients 
            find their perfect homes across Nairobi and beyond.
          </p>
        </div>

        {/* Agents Carousel */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-lg" />
              ))}
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">
                No agents available yet. Be the first to join our platform!
              </p>
              <Button onClick={handleJoinClick} className="bg-primary hover:bg-primary/90">
                Become an Agent
              </Button>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: agents.length > 4,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {agents.map((agent, index) => (
                  <CarouselItem key={agent.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                    <AgentCardWrapper agent={agent} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
              <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
            </Carousel>
          )}
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-16 text-center relative overflow-hidden rounded-3xl">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,197,94,0.3),transparent_50%)]"></div>
          
          <div className="relative backdrop-blur-sm bg-card/30 p-10 md:p-16 border border-border/30 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Find Your Dream Home?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of happy homeowners who found their perfect property 
              through KenyaHomes trusted agents. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleJoinClick}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Join as Agent
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 font-semibold hover:scale-105 transition-all"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AgentRegistrationDialog 
        open={showRegistration}
        onOpenChange={setShowRegistration}
      />
    </section>
  );
}