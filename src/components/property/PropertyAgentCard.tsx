import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
    Phone, 
    MessageCircle, 
    CheckCircle2, 
    Star, 
    ShieldCheck, 
    Clock, 
    Briefcase,
    Map,
    ArrowRightLeft,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTrip } from "@/contexts/TripContext";

interface PropertyAgentCardProps {
    agent: {
        name: string;
        role: string;
        image: string;
        rating: number;
        deals: number;
        phone: string;
        email: string;
        id?: string;
        verified?: boolean;
        isOnline?: boolean;
        agencyRegistered?: boolean;
        listingsVerified?: boolean;
        lastActive?: string;
        avgResponseTime?: string;
        reputationScore?: number;
        dealsLast90Days?: number;
        avgDaysToClose?: number;
    };
    property: {
        id: string;
        title: string;
        location: string;
        price: string;
        image: string;
    };
}

export function PropertyAgentCard({ agent, property }: PropertyAgentCardProps) {
    const navigate = useNavigate();
    const { addToTrip, removeFromTrip, isInTrip } = useTrip();

    const isAddedToTrip = isInTrip(property.id);

    // Mock Defaults 
    const lastActive = agent.lastActive || "6 mins ago";
    const avgResponseTime = agent.avgResponseTime || "under 30 mins";
    const reputationScore = agent.reputationScore || 98;
    const dealsLast90Days = agent.dealsLast90Days || 12;
    const avgDaysToClose = agent.avgDaysToClose || 24;

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=Hi ${agent.name}, I'm interested in ${property.title}. Is it available?`, "_blank");
    };

    const handleCall = () => {
        window.open(`tel:${agent.phone}`);
    };

    const handleAddToTrip = () => {
        if (isAddedToTrip) {
            removeFromTrip(property.id);
        } else {
            addToTrip({
                id: property.id,
                title: property.title,
                location: property.location,
                price: property.price,
                image: property.image,
                agent: agent.name
            });
        }
    };

    const handleViewProfile = () => {
        if (agent.id) {
            navigate(`/agents/profile/${agent.id}`);
        } else {
            toast.error("Agent profile not found");
        }
    };

    const handleCompare = () => {
        toast.info("Added to Comparison", {
            description: `You can now compare ${property.title} with other properties in your dashboard.`
        });
    };

    return (
        <Card className="border-0 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl ring-1 ring-white/20 dark:ring-white/10">
            {/* Header / Trust Stack Background */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-32 relative">
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                     <Badge variant="secondary" className="bg-background/80 backdrop-blur text-xs font-medium border-primary/20 shadow-sm">
                        <Clock className="w-3 h-3 mr-1 text-emerald-500" />
                        Active {lastActive}
                    </Badge>
                    <div className="text-[10px] text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">
                        Replies in {avgResponseTime}
                    </div>
                </div>
            </div>

            <CardContent className="relative px-6 pb-6 -mt-16">
                {/* Agent Identity & Verification Layer */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-3 group cursor-pointer" onClick={handleViewProfile}>
                         <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-primary rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                        <Avatar className="w-24 h-24 border-4 border-background shadow-xl relative">
                            <AvatarImage src={agent.image} className="object-cover" />
                            <AvatarFallback>{agent.name[0]}</AvatarFallback>
                        </Avatar>
                        {agent.isOnline && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-background rounded-full flex items-center justify-center animate-pulse">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Online Now</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    <h3 
                        className="text-xl font-bold text-foreground flex items-center gap-2 justify-center hover:text-primary cursor-pointer transition-colors"
                        onClick={handleViewProfile}
                    >
                        {agent.name}
                        {agent.verified && <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />}
                    </h3>
                    <p className="text-muted-foreground font-medium text-sm mb-3">{agent.role}</p>

                    {/* Trust Stack Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                            <ShieldCheck className="w-3 h-3 mr-1" /> ID Verified
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[10px]">
                            <Briefcase className="w-3 h-3 mr-1" /> Registered
                        </Badge>
                    </div>

                    {/* Reputation Score */}
                    <div className="flex items-center gap-1 text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="font-bold">{agent.rating}</span>
                         <span className="text-muted-foreground/60">•</span>
                         <span className="font-semibold">{reputationScore}% Reputation Score</span>
                    </div>
                </div>

                {/* Performance Snapshot (Mini) */}
                <div className="grid grid-cols-3 gap-2 mb-6 bg-muted/30 p-3 rounded-xl border border-border/50">
                    <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{dealsLast90Days}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Deals (90d)</div>
                    </div>
                    <div className="text-center border-l border-border/50">
                        <div className="text-lg font-bold text-foreground">{avgDaysToClose}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Days to Sell</div>
                    </div>
                    <div className="text-center border-l border-border/50">
                        <div className="text-lg font-bold text-foreground">{agent.deals}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Total Sold</div>
                    </div>
                </div>

                {/* Smart CTAs */}
                <div className="space-y-3">
                    <Button 
                        onClick={handleWhatsApp} 
                        className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold h-auto py-3 text-base shadow-lg shadow-emerald-500/20 flex flex-col items-start px-4"
                    >
                        <div className="flex items-center w-full justify-center">
                            <MessageCircle className="w-5 h-5 mr-2" /> 
                            <span>WhatsApp Agent</span>
                        </div>
                        <span className="text-[10px] font-normal opacity-90 mx-auto mt-0.5">Check availability • Negotiate • Book</span>
                    </Button>
                    
                    <div className="grid grid-cols-1 gap-3">
                        <Button 
                            onClick={handleAddToTrip} 
                            variant={isAddedToTrip ? "secondary" : "default"}
                            className={cn(
                                "w-full border shadow-sm transition-all relative overflow-hidden",
                                isAddedToTrip 
                                    ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800" 
                                    : "bg-purple-600 hover:bg-purple-700 text-white border-transparent"
                            )}
                        >
                            {isAddedToTrip ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Added to Trip
                                </>
                            ) : (
                                <>
                                    <Map className="w-4 h-4 mr-2" /> Add to Viewing Trip
                                </>
                            )}
                            {isAddedToTrip && <span className="absolute inset-0 bg-purple-500/10 animate-pulse" />}
                        </Button>

                         <div className="grid grid-cols-2 gap-3">
                            <Button onClick={handleCall} variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                                <Phone className="w-4 h-4 mr-2" /> Call
                            </Button>
                            <Button onClick={handleCompare} variant="outline" className="w-full border-blue-500/20 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/10">
                                <ArrowRightLeft className="w-4 h-4 mr-2" /> Compare
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-border/50 text-center">
                    <Button 
                        variant="link" 
                        onClick={handleViewProfile}
                        className="text-primary text-xs h-auto p-0 group"
                    >
                        View Agent Intelligence Profile
                        <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}
