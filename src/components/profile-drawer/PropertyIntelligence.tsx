import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Star } from "lucide-react";

export function PropertyIntelligence() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Recommended for You
                </h3>
            </div>

            {/* Carousel (simplified as single card for now, would be carousel in full implementation) */}
            <Card className="p-3 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
                <div className="flex gap-3">
                    <div className="h-16 w-20 bg-muted rounded-md overflow-hidden relative shrink-0">
                        {/* Placeholder Image */}
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="absolute top-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded backdrop-blur">
                            98% Match
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">Modern Loft in Kileleshwa</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                            Based on your interest in "Westlands apartments" and budget.
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="secondary" className="h-6 text-[10px] bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 shadow-none border border-purple-500/20">
                                View Details
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                                <Star className="w-3 h-3 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
