import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Bell, Building, Calculator, Heart, Landmark, TrendingDown, Users } from "lucide-react";

export function FinancingGateway() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-green-600" />
                    Financing & Lenders
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors cursor-pointer group">
                    <Calculator className="w-5 h-5 text-green-600 mb-2" />
                    <h4 className="text-xs font-bold mb-1">Affordability</h4>
                    <p className="text-[10px] text-muted-foreground">Check what you can borrow</p>
                    <ArrowRight className="w-3 h-3 text-green-600 ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
                <Card className="p-3 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer group">
                    <Building className="w-5 h-5 text-blue-600 mb-2" />
                    <h4 className="text-xs font-bold mb-1">Find Lenders</h4>
                    <p className="text-[10px] text-muted-foreground">Get pre-approved today</p>
                    <ArrowRight className="w-3 h-3 text-blue-600 ml-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
            </div>
        </div>
    );
}

export function SavedAssets() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Saved & Watched
                </h3>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/80 transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                            <Heart className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">Saved Properties</p>
                            <p className="text-[10px] text-muted-foreground">12 Homes • <span className="text-green-500">2 Price drops</span></p>
                        </div>
                    </div>
                    <Badge variant="outline" className="h-5 text-[10px] border-red-200 text-red-700 bg-red-50" >View</Badge>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background/80 transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-medium">Watched Agents</p>
                            <p className="text-[10px] text-muted-foreground">3 Agents</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="h-5 text-[10px]">View</Badge>
                </div>
            </div>
        </div>
    );
}

export function SmartNotifications() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500" />
                    Smart Updates
                </h3>
            </div>

            <Card className="p-3 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent">
                <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0 animate-pulse" />
                    <div>
                        <p className="text-xs font-medium text-foreground">Price Drop Alert</p>
                        <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                            A property you saved in Kilimani dropped by KSh 2.5M.
                        </p>
                        <Button variant="link" className="h-auto p-0 text-[10px] text-orange-600 mt-1">Check Property</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
