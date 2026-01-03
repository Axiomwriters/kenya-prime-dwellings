import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, BadgeCheck, Trophy, ArrowRight, MessageCircle } from "lucide-react";

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
  role?: string;
  persuasion?: string;
  deals?: number;
  clients?: number;
  verified?: boolean;
  topRated?: boolean;
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const isTopRated = agent.topRated || agent.rating >= 4.8;
  const isVerified = agent.verified || agent.reviews >= 50;

  const handleClick = () => {
    navigate(`/agents/profile/${agent.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="group relative h-[480px] w-full overflow-hidden rounded-2xl border-0 bg-transparent transition-all duration-500 hover:-translate-y-2 cursor-pointer pb-2"
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all duration-500 group-hover:border-primary/50 group-hover:bg-white/95 dark:group-hover:bg-[#0f172a]/95 rounded-2xl" />

      {/* Glow Effects */}
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${isVerified ? 'bg-[radial-gradient(circle_at_50%_0%,_rgba(34,197,94,0.15),transparent_70%)]' : ''}`} />
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${isTopRated ? 'bg-[radial-gradient(circle_at_50%_0%,_rgba(234,179,8,0.15),transparent_70%)]' : ''}`} />

      <CardContent className="relative h-full p-0 flex flex-col items-center pt-2">

        {/* Floating Badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {isVerified && (
            <div className={`p-2 rounded-full backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-110 ${isVerified ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : ''}`}>
              <BadgeCheck className="w-5 h-5" />
            </div>
          )}
          {isTopRated && (
            <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400 backdrop-blur-md border border-yellow-500/30 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Trophy className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="mt-8 mb-4 relative z-10 transition-transform duration-500 group-hover:scale-105">
          <div className={`relative p-1 rounded-full ${isVerified ? 'bg-gradient-to-b from-emerald-500/50 to-transparent' : isTopRated ? 'bg-gradient-to-b from-yellow-500/50 to-transparent' : ''}`}>
            <Avatar className="w-32 h-32 ring-4 ring-white dark:ring-[#0f172a] shadow-2xl">
              <AvatarImage src={agent.avatar} alt={agent.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                {getInitials(agent.name)}
              </AvatarFallback>
            </Avatar>

            {/* Rating Pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full shadow-xl z-20">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">{agent.rating}</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full px-6 flex flex-col items-center text-center z-10 flex-grow">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{agent.name}</h3>
          <p className="text-sm text-slate-600 dark:text-blue-200 font-medium mb-3">{agent.role || "Real Estate Agent"}</p>

          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/10 text-primary hover:border-primary/40 hover:bg-primary/20 transition-colors uppercase tracking-wider text-[10px] font-semibold py-1">
            {agent.specialization}
          </Badge>

          {/* Persuasion Line */}
          <p className="text-xs text-slate-600 dark:text-slate-300/90 italic mb-6 leading-relaxed max-w-[240px] h-8 line-clamp-2">
            "{agent.persuasion || `Specializing in ${agent.specialization} properties.`}"
          </p>

          {/* Dynamic Content Area: Stats vs CTA */}
          <div className="w-full relative h-28 mt-auto mb-2">

            {/* Stats (Fade Out on Hover) */}
            <div className="absolute inset-0 transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:translate-y-4">

              {/* Proof Stats */}
              <div className="grid grid-cols-2 gap-4 mb-3 border-t border-slate-200 dark:border-white/5 pt-3">
                <div className="text-center border-r border-slate-200 dark:border-white/5">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{agent.deals || 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{agent.clients || 0}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">Clients</div>
                </div>
              </div>

              {/* Price Range Visual */}
              <div className="w-full px-2">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                  <span>Low</span>
                  <span className="text-primary font-medium">Mid-Range</span>
                  <span>High</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
                  {/* Background track */}
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"></div>
                  {/* Range indicator (just a visual representation of range) */}
                  <div className="absolute left-[20%] right-[30%] h-full bg-gradient-to-r from-primary/50 to-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* CTA (Fade In on Hover) */}
            <div className="absolute inset-0 transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 flex flex-col justify-center gap-3 bg-[#0f172a]/0 z-20">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/agents/profile/${agent.id}`);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 font-semibold text-sm h-10"
              >
                View Listings <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  // Placeholder for chat functionality
                  console.log("Chat with agent", agent.name);
                }}
                className="w-full border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white h-9 text-xs bg-transparent"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-2" /> Chat Agent
              </Button>
            </div>

          </div>

        </div>
      </CardContent>
    </Card>
  );
}