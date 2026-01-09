import { User, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IdentitySelectorProps {
    selected: 'individual' | 'agency';
    onSelect: (identity: 'individual' | 'agency') => void;
    verified?: boolean;
}

export function IdentitySelector({ selected, onSelect, verified }: IdentitySelectorProps) {
    return (
        <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Account Identity
                </h3>
                {verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Identity Locked
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => !verified && onSelect('individual')}
                    disabled={verified}
                    className={cn(
                        "relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left h-full",
                        selected === 'individual'
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-transparent bg-card hover:bg-accent hover:border-border",
                        verified && selected !== 'individual' && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-full shrink-0 mt-1",
                        selected === 'individual' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={cn("font-bold truncate pr-6", selected === 'individual' ? "text-primary" : "text-foreground")}>
                            Individual Agent
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            I work alone or manage my own properties.
                        </p>
                    </div>
                    {selected === 'individual' && (
                        <div className="absolute top-4 right-4 text-primary">
                            <Check className="w-5 h-5" />
                        </div>
                    )}
                </button>

                <button
                    onClick={() => !verified && onSelect('agency')}
                    disabled={verified}
                    className={cn(
                        "relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left h-full",
                        selected === 'agency'
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-transparent bg-card hover:bg-accent hover:border-border",
                        verified && selected !== 'agency' && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className={cn(
                        "p-3 rounded-full shrink-0 mt-1",
                        selected === 'agency' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={cn("font-bold truncate pr-6", selected === 'agency' ? "text-primary" : "text-foreground")}>
                            Registered Agency
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            I have a registered business and a team.
                        </p>
                    </div>
                    {selected === 'agency' && (
                        <div className="absolute top-4 right-4 text-primary">
                            <Check className="w-5 h-5" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
