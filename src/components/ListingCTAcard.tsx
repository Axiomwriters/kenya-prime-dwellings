import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListingCTAcardProps {
    onViewMore: () => void;
    context?: string; // e.g., "land", "affordable", "commercial"
}

export function ListingCTAcard({ onViewMore, context = "properties" }: ListingCTAcardProps) {
    return (
        <Card className="relative overflow-hidden group h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/5 via-background to-accent/10 border-dashed border-2 hover:border-primary/50 transition-all duration-500">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* "Character" / Icon Animation */}
            <div className="relative mb-6 transform group-hover:scale-110 transition-transform duration-500">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative">
                    <Sparkles className="w-10 h-10 text-primary animate-bounce-slow" />

                    {/* Orbiting Elements */}
                    <div className="absolute w-full h-full animate-spin-slow">
                        <div className="absolute -top-2 left-1/2 w-3 h-3 bg-accent rounded-full" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-4 max-w-[260px]">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    Still {context === "land" ? "looking for land" : "exploring"}?
                </h3>

                <p className="text-muted-foreground text-sm">
                    We have hundreds more {context} listings that match your criteria.
                </p>

                <div className="pt-2 space-y-3 w-full">
                    <Button
                        onClick={onViewMore}
                        className="w-full gap-2 group-hover:gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        size="lg"
                    >
                        view more {context}
                        <ArrowRight className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Refine Search
                    </Button>
                </div>
            </div>
        </Card>
    );
}
