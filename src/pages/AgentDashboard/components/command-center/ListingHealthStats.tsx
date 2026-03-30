import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface StatProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon: any;
    color?: string;
}

function StatCard({ title, value, subtext, trend, trendValue, icon: Icon, color }: StatProps) {
    return (
        <Card className="hover:shadow-md transition-all border-border/50">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                            {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                        </div>
                    </div>
                    <div className={cn("p-2 rounded-xl", color || "bg-primary/10 text-primary")}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center gap-2 text-xs">
                        <span className={cn(
                            "flex items-center font-medium",
                            trend === 'up' ? "text-green-600" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
                        )}>
                            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {trendValue}
                        </span>
                        <span className="text-muted-foreground">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function ListingHealthStats() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ["listing-stats", user?.id],
        queryFn: async () => {
            if (!user) return null;
            
            // Get all listings for this agent
            const { data: listings, error } = await supabase
                .from("agent_listings")
                .select("id, status, view_count, saves_count, inquiries_count, images, description, price, location, amenities")
                .eq("agent_id", user.id);

            if (error || !listings) {
                console.error("Error fetching stats:", error);
                return null;
            }

            // Calculate stats
            const activeListings = listings.filter(l => l.status === 'approved');
            const draftListings = listings.filter(l => l.status === 'draft');
            const totalViews = listings.reduce((sum, l) => sum + (l.view_count || 0), 0);
            const totalSaves = listings.reduce((sum, l) => sum + (l.saves_count || 0), 0);
            const totalInquiries = listings.reduce((sum, l) => sum + (l.inquiries_count || 0), 0);

            // Calculate listings needing attention (low images, no description, etc.)
            const needsAttention = listings.filter(l => {
                const hasFewImages = !l.images || l.images.length < 3;
                const hasNoDescription = !l.description || l.description.length < 50;
                return hasFewImages || hasNoDescription;
            }).length;

            return {
                activeCount: activeListings.length,
                draftCount: draftListings.length,
                totalViews,
                totalSaves,
                totalInquiries,
                needsAttention,
                listingCount: listings.length
            };
        },
        enabled: !!user
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="hover:shadow-md transition-all border-border/50">
                        <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const avgViews = stats && stats.listingCount > 0 
        ? Math.round(stats.totalViews / stats.listingCount) 
        : 0;

    const inquiryRate = stats && stats.totalViews > 0 
        ? ((stats.totalInquiries / stats.totalViews) * 100).toFixed(1) 
        : "0.0";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Active Listings"
                value={stats?.activeCount || 0}
                subtext={`${stats?.draftCount || 0} drafts pending`}
                trend={stats && stats.activeCount > 0 ? "up" : undefined}
                trendValue={stats && stats.activeCount > 0 ? `+${stats.activeCount}` : undefined}
                icon={CheckCircle2}
                color="bg-green-100 text-green-700"
            />
            <StatCard
                title="Total Views (All Time)"
                value={stats?.totalViews || 0}
                subtext={`Avg ${avgViews} per listing`}
                icon={Eye}
                color="bg-blue-100 text-blue-700"
            />
            <StatCard
                title="Total Inquiries"
                value={stats?.totalInquiries || 0}
                subtext={`${stats?.totalSaves || 0} saves`}
                icon={MessageSquare}
                color="bg-purple-100 text-purple-700"
            />
            <StatCard
                title="Action Required"
                value={stats?.needsAttention || 0}
                subtext={stats?.needsAttention ? "Improve listings" : "All good!"}
                icon={AlertTriangle}
                color={stats?.needsAttention ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}
            />
        </div>
    );
}
