import { Button } from "@/components/ui/button";
import { Plus, Check, Rocket, BarChart } from "lucide-react";

interface EmptyStateProps {
    onAddListing: () => void;
}

export function EmptyListingState({ onAddListing }: EmptyStateProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-12 text-center">

            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Rocket className="w-64 h-64 text-primary" />
            </div>

            <div className="relative z-10 max-w-lg mx-auto space-y-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Ready to Launch Your Empire? 🚀</h3>
                    <p className="text-muted-foreground">
                        Agents with 5+ active listings close <strong>3x more deals</strong>. Let's get your first property live and seen by thousands.
                    </p>
                </div>

                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 text-left space-y-4 shadow-sm">
                    <h4 className="font-semibold flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-primary" /> Success Roadmap
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                            <span className="text-sm line-through">Create Agent Profile</span>
                            <Check className="w-4 h-4 text-green-500 ml-auto" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold animate-pulse">2</div>
                            <span className="text-sm font-medium">Add First Listing</span>
                            <Button size="sm" variant="secondary" className="h-6 ml-auto text-xs" onClick={onAddListing}>Start Now</Button>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs">3</div>
                            <span className="text-sm">Get Verified (Boost Trust)</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs">4</div>
                            <span className="text-sm">Enable Viewings</span>
                        </div>
                    </div>
                </div>

                <Button size="lg" onClick={onAddListing} className="w-full sm:w-auto shadow-xl shadow-primary/20">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Listing
                </Button>
            </div>
        </div>
    );
}
