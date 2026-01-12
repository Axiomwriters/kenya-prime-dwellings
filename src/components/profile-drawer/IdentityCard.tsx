import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, MapPin, TrendingUp, User } from "lucide-react";

interface IdentityCardProps {
    user: any;
    profile: any;
}

export function IdentityCard({ user, profile }: IdentityCardProps) {
    const userName = profile?.full_name || user?.user_metadata?.full_name || "User";
    const userEmail = user?.email || "";
    const userInitials = userName.substring(0, 2).toUpperCase();
    const avatarUrl = profile?.avatar_url;

    // Mock data for new features
    const buyerType = profile?.buyer_type || "First-time Buyer";
    const journeyStage = profile?.journey_stage || "Viewing"; // Browsing, Shortlisting, Viewing, Negotiating, Closed
    const journeyProgress = 60; // 60% based on "Viewing"

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-primary/5 p-5 shadow-sm group hover:shadow-md transition-all duration-300 mt-2">
            <div className="flex items-start justify-between gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
                        <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    {profile?.verification_status === 'approved' && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-background shadow-sm" title="Verified User">
                            <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold truncate text-foreground">{userName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">{userEmail}</p>

                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs font-medium px-2 py-0.5 h-6">
                            {buyerType}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span>Journey Stage</span>
                    </div>
                    <span className="text-foreground">{journeyStage}</span>
                </div>

                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out"
                        style={{ width: `${journeyProgress}%` }}
                    />
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground/60 px-0.5">
                    <span>Browsing</span>
                    <span>Viewing</span>
                    <span>Closed</span>
                </div>
            </div>
        </div>
    );
}
