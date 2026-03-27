import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SponsoredSpotlightProps {
  isSponsored?: boolean;
}

export function SponsoredSpotlight({ isSponsored = false }: SponsoredSpotlightProps) {
  return (
    <div className="mx-1">
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl border p-3 md:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer group",
          isSponsored 
            ? "bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20 hover:shadow-primary/20" 
            : "bg-card hover:border-primary/50"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <Sparkles className={cn("w-3.5 h-3.5 md:w-4 md:h-4", isSponsored ? "text-primary fill-primary" : "text-yellow-500")} />
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {isSponsored ? "Sponsored • Live" : "Spotlight Opportunity"}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div className="relative">
            <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-background shadow-sm">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-[10px] md:text-sm">AG</AvatarFallback>
            </Avatar>
            {isSponsored && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background">
                <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold md:font-bold text-xs md:text-sm truncate">Leading Agent</p>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate">Westlands • Nairobi</p>
          </div>
        </div>

        <div className="space-y-2">
           {isSponsored ? (
             <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-medium text-primary bg-primary/10 p-1.5 md:p-2 rounded-lg">
               <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
               Top 3 Agent in Westlands
             </div>
           ) : (
             <div className="text-[10px] md:text-xs text-muted-foreground bg-muted/50 p-1.5 md:p-2 rounded-lg">
               Featured agents get <span className="font-bold text-foreground">3x more leads</span>.
             </div>
           )}

           <Button 
             size="sm" 
             className={cn(
               "w-full text-[10px] md:text-xs font-semibold h-7 md:h-8",
               isSponsored ? "variant-outline" : "bg-gradient-to-r from-primary to-green-600 hover:opacity-90 text-white shadow-md border-0"
             )}
             variant={isSponsored ? "outline" : "default"}
           >
             {isSponsored ? "View Performance" : "Get Featured"}
           </Button>
        </div>
      </div>
    </div>
  );
}
