import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, CheckCircle, Star, MessageCircle, ArrowRight } from "lucide-react";

interface PropertyAgentCardProps {
    agent: {
        name: string;
        role: string;
        image: string;
        rating: number;
        deals: number;
        phone: string;
        email: string;
        verified?: boolean;
        isOnline?: boolean;
    };
}

export function PropertyAgentCard({ agent }: PropertyAgentCardProps) {
    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=Hi ${agent.name}, I'm interested in this property...`, "_blank");
    };

    const handleCall = () => {
        window.open(`tel:${agent.phone}`);
    };

    return (
        <Card className="border-border/50 shadow-xl overflow-hidden sticky top-24">
            <div className="bg-primary/5 h-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
            </div>

            <CardContent className="relative px-6 pb-6">
                {/* Avatar Section */}
                <div className="flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                            <AvatarImage src={agent.image} className="object-cover" />
                            <AvatarFallback>{agent.name[0]}</AvatarFallback>
                        </Avatar>
                        {agent.isOnline && (
                            <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-background rounded-full" title="Online now"></span>
                        )}
                    </div>
                    {agent.verified && (
                        <Badge variant="secondary" className="mb-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-1">
                            <CheckCircle className="w-3.5 h-3.5 mr-1 fill-emerald-500/20" /> Verified Agent
                        </Badge>
                    )}
                </div>

                {/* Identity */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {agent.name}
                    </h3>
                    <p className="text-muted-foreground font-medium">{agent.role}</p>

                    <div className="flex items-center gap-3 mt-2 text-sm">
                        <div className="flex items-center text-amber-500 font-bold">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            {agent.rating}
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{agent.deals}+ Deals Closed</span>
                    </div>
                </div>

                {/* Trust Line */}
                <div className="bg-muted/50 rounded-lg p-3 mb-6 text-sm text-center text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    Typically replies in under <span className="font-semibold text-foreground">1 hour</span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold h-12 text-base shadow-lg shadow-emerald-500/20">
                        <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Agent
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleCall} variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/50 h-11">
                            <Phone className="w-4 h-4 mr-2" /> Call
                        </Button>
                        <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/50 h-11">
                            <Mail className="w-4 h-4 mr-2" /> Email
                        </Button>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                    <Button variant="link" className="text-primary p-0 h-auto font-medium group">
                        View Profile & Other Listings
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}
