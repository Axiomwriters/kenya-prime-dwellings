import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Home, DollarSign } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  totalListings: number;
  priceRange: string;
  avatar?: string;
  specialization: string;
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Determine badges based on rating and reviews
  const isTopRated = agent.rating >= 4.8;
  const isVerified = agent.reviews >= 50;

  const handleClick = () => {
    navigate(`/agents/profile/${agent.id}`);
  };

  return (
    <Card 
      onClick={handleClick}
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 bg-card/50 backdrop-blur-sm hover:scale-[1.02] cursor-pointer"
    >
      <CardContent className="p-6 relative">
        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1 max-w-[60%] z-10">
          {isTopRated && (
            <Badge className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 shadow-sm">
              Top Rated
            </Badge>
          )}
          {isVerified && (
            <Badge className="bg-success text-success-foreground text-[10px] px-2 py-0.5 shadow-sm">
              Verified
            </Badge>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-4 pt-2">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg text-foreground">{agent.rating}</span>
          </div>
          <Badge variant="secondary" className="text-xs font-medium shrink-0">
            {agent.reviews} Reviews
          </Badge>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <Avatar className="w-20 h-20 ring-2 ring-primary/20">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {getInitials(agent.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Agent Info with improved hierarchy */}
        <div className="text-center space-y-2.5 mb-4">
          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{agent.name}</h3>
          <Badge variant="outline" className="text-xs font-medium px-3 py-1">
            {agent.specialization}
          </Badge>
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{agent.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Home className="w-3 h-3" />
              <span className="text-xs">Total Listings</span>
            </div>
            <div className="font-bold text-foreground">{agent.totalListings}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">Starts From</span>
            </div>
            <div className="font-bold text-primary">{agent.priceRange}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}