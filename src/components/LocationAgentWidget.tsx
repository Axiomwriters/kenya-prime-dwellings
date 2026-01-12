import { useEffect, useState } from 'react';
import { useLocationAgent } from '@/contexts/LocationAgentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Info, ArrowRight, Building, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function LocationAgentWidget() {
    const { currentLocationFocus, getZonesByParent } = useLocationAgent();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (currentLocationFocus) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [currentLocationFocus]);

    if (!isVisible || !currentLocationFocus) return null;

    const subRegions = getZonesByParent(currentLocationFocus.name);
    const isParent = subRegions.length > 0;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up bg-transparent pointer-events-none">
            <Card className="w-80 p-4 pointer-events-auto backdrop-blur-xl bg-background/80 border-primary/20 shadow-2xl rounded-2xl relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                <div className="flex items-start gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <MapPin className="w-5 h-5 animate-bounce" />
                    </div>

                    <div className="space-y-2 flex-1">
                        <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                                Location Detected: <span className="text-primary">{currentLocationFocus.name}</span>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                {currentLocationFocus.description || `Explore properties in ${currentLocationFocus.name}.`}
                            </p>
                        </div>

                        {/* Smart Insights */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {currentLocationFocus.propertyTypes?.map((type, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] bg-background/50">
                                    {type}
                                </Badge>
                            ))}
                        </div>

                        {/* Sub-regions Suggestions */}
                        {isParent && (
                            <div className="pt-2 border-t border-border/50 mt-2">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Top Neighborhoods</p>
                                <div className="flex flex-wrap gap-1">
                                    {subRegions.slice(0, 4).map(sub => (
                                        <Button key={sub.name} variant="ghost" size="sm" className="h-6 text-[10px] px-2 bg-secondary/50 hover:bg-secondary">
                                            {sub.name}
                                        </Button>
                                    ))}
                                    {subRegions.length > 4 && (
                                        <span className="text-[10px] text-muted-foreground self-center pl-1">+{subRegions.length - 4} more</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <Button
                            size="sm"
                            className="w-full mt-3 h-8 text-xs gap-2"
                            onClick={() => navigate(`/properties?search=${currentLocationFocus.name}`)}
                        >
                            View All Listings in {currentLocationFocus.name} <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
