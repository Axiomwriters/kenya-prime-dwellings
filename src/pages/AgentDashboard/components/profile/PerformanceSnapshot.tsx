import { Card, CardContent } from "@/components/ui/card";
import { Lock, Ghost, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PerformanceSnapshot() {
    return (
        <Card className="bg-slate-950 text-slate-50 border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <TrendingUp className="w-24 h-24" />
            </div>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-lg">CRM Intelligence Snapshot</h3>
                    <Button variant="outline" size="xs" className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300">
                        View Full Report
                    </Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400">Response Speed</p>
                        <p className="text-2xl font-bold text-green-400">12m</p>
                        <p className="text-[10px] text-slate-400">Top 5% of agents</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400">Conversion Rate</p>
                        <p className="text-2xl font-bold text-blue-400">3.8%</p>
                        <p className="text-[10px] text-slate-400">+1.2% this month</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Ghost className="w-3 h-3" /> Ghosted Leads
                        </p>
                        <p className="text-2xl font-bold text-orange-400">4</p>
                        <p className="text-[10px] text-slate-400">Needs follow-up</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Active Deals
                        </p>
                        <p className="text-2xl font-bold">18</p>
                        <p className="text-[10px] text-slate-400">Worth KES ~450m</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
