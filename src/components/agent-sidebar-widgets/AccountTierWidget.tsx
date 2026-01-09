import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Info, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AccountTierWidget() {
    const [isPro, setIsPro] = useState(false);

    return (
        <div className="mx-2 mb-4">
            <div className="rounded-xl border bg-card p-4 transition-all hover:bg-accent/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Plan</p>
                        <h4 className="font-bold text-sm">{isPro ? "Pro Agent 🚀" : "Free Plan"}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs ${!isPro ? 'font-bold' : 'text-muted-foreground'}`}>Free</span>
                        <Switch checked={isPro} onCheckedChange={setIsPro} className="scale-75 data-[state=checked]:bg-primary" />
                        <span className={`text-xs ${isPro ? 'font-bold text-primary' : 'text-muted-foreground'}`}>Pro</span>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    {/* Feature List */}
                    <div className="space-y-2">
                        <FeatureRow label="Smart Pricing Engine" active={isPro} tooltip="AI-driven price recommendations" />
                        <FeatureRow label="Lead Intent Scoring" active={isPro} tooltip="Know who is ready to buy" />
                        <FeatureRow label="Viewing Trips" active={isPro} tooltip="Organize and track viewings" />
                        <FeatureRow label="Verified Badge" active={isPro} tooltip="Build trust with clients" />
                    </div>
                </div>

                {isPro ? (
                    <div className="space-y-2">
                        <p className="text-[10px] text-center text-primary font-medium">
                            Agents on Pro close 2.4x more deals
                        </p>
                        <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                            Manage Subscription
                        </Button>
                    </div>
                ) : (
                    <Button size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/90 shadow-sm">
                        Upgrade to Pro
                    </Button>
                )}
            </div>
        </div>
    );
}

function FeatureRow({ label, active, tooltip }: { label: string, active: boolean, tooltip: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
                {active ? (
                    <Check className="w-3 h-3 text-primary" />
                ) : (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                )}
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground/50 hover:text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
