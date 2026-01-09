import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Calendar, ArrowRight, Ghost, AlertCircle } from "lucide-react";

const leads = [
    {
        id: 1,
        name: "John Kamau",
        status: "hot", // 70-100
        intentScore: 92,
        lastAction: "Viewed 'Riverside' 3 times today",
        timeStuck: "2 days", // Time in current stage
        avatar: "JK",
        stage: "Viewing", // Discovery -> Engaged -> Viewing -> Negotiation -> Closed
        nextAction: "follow_up_viewing",
        phone: "+254...",
    },
    {
        id: 2,
        name: "Sarah Wanjiku",
        status: "warm", // 40-69
        intentScore: 55,
        lastAction: "Saved 'Kilimani Penthouse'",
        timeStuck: "4 days",
        avatar: "SW",
        stage: "Engaged",
        nextAction: "nudge_whatsapp",
        phone: "+254...",
    },
    {
        id: 3,
        name: "David Ochieng",
        status: "ghost", // Special status for ghosted
        intentScore: 24,
        lastAction: "No reply to WhatsApp",
        timeStuck: "12 days",
        avatar: "DO",
        stage: "Discovery",
        nextAction: "auto_ping",
        phone: "+254...",
    },
];

const STAGES = ["Discovery", "Engaged", "Viewing", "Negotiation", "Closed"];

export default function CRMHub() {
    const getStageProgress = (stage: string) => {
        const index = STAGES.indexOf(stage);
        return ((index + 1) / STAGES.length) * 100;
    };

    const getIntentColor = (score: number) => {
        if (score >= 70) return "text-red-500";
        if (score >= 40) return "text-orange-500";
        return "text-slate-500";
    };

    const getIntentBadge = (score: number, status: string) => {
        if (status === 'ghost') return { label: "Ghosted", class: "bg-slate-200 text-slate-600 border-slate-300" };
        if (score >= 70) return { label: "🔥 Hot", class: "bg-red-100 text-red-600 border-red-200" };
        if (score >= 40) return { label: "😐 Warm", class: "bg-orange-100 text-orange-600 border-orange-200" };
        return { label: "❄️ Cold", class: "bg-blue-100 text-blue-600 border-blue-200" };
    };

    return (
        <Card className="col-span-full border-t-4 border-t-primary shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <span>💬</span> Deal Intelligence Hub
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">3 active deals</span> require attention today.
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    View All Leads <ArrowRight className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {leads.map((lead) => {
                        const badge = getIntentBadge(lead.intentScore, lead.status);

                        return (
                            <div key={lead.id} className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md">

                                {/* 1. Avatar & Score */}
                                <div className="flex items-start gap-4 md:w-[250px] shrink-0">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                            <AvatarFallback className={
                                                lead.status === 'hot' ? 'bg-red-100 text-red-600 font-bold' :
                                                    lead.status === 'warm' ? 'bg-orange-100 text-orange-600 font-bold' :
                                                        'bg-slate-100 text-slate-600'
                                            }>
                                                {lead.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        {lead.status === 'ghost' && (
                                            <div className="absolute -bottom-1 -right-1 bg-slate-100 rounded-full p-0.5 border border-slate-200">
                                                <Ghost className="w-3 h-3 text-slate-500" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm">{lead.name}</h4>
                                            <Badge variant="outline" className={`text-[10px] px-1.5 h-5 ${badge.class}`}>
                                                {badge.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className={`font-bold ${getIntentColor(lead.intentScore)}`}>{lead.intentScore}% Intent</span>
                                            <span>•</span>
                                            <span>{lead.timeStuck} in stage</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Timeline Visualization */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Current Stage: <span className="text-primary">{lead.stage}</span>
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            Last: {lead.lastAction}
                                        </span>
                                    </div>

                                    {/* Pipeline Progress Bar */}
                                    <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${lead.status === 'ghost' ? 'bg-slate-400' : 'bg-primary'
                                                }`}
                                            style={{ width: `${getStageProgress(lead.stage)}%` }}
                                        />
                                    </div>

                                    {/* Stages Labels */}
                                    <div className="flex justify-between text-[10px] text-muted-foreground/60 font-medium px-0.5">
                                        {STAGES.map((s) => (
                                            <span key={s} className={s === lead.stage ? "text-foreground font-bold" : ""}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Smart Actions (Vertical on mobile, Right aligned on Desktop) */}
                                <div className="md:w-[180px] shrink-0 flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0 dashed-border">
                                    {lead.nextAction === 'follow_up_viewing' && (
                                        <Button size="sm" className="w-full text-xs bg-green-600 hover:bg-green-700 shadow-sm shadow-green-200">
                                            <Calendar className="w-3 h-3 mr-2" /> Book Viewing
                                        </Button>
                                    )}

                                    {lead.nextAction === 'nudge_whatsapp' && (
                                        <Button size="sm" variant="secondary" className="w-full text-xs text-green-700 bg-green-100 hover:bg-green-200 border border-green-200">
                                            <MessageCircle className="w-3 h-3 mr-2" /> WhatsApp Nudge
                                        </Button>
                                    )}

                                    {lead.nextAction === 'auto_ping' && (
                                        <Button size="sm" variant="outline" className="w-full text-xs text-muted-foreground hover:text-foreground">
                                            <AlertCircle className="w-3 h-3 mr-2" /> Auto-Ping Lead
                                        </Button>
                                    )}

                                    <div className="flex gap-1 justify-center">
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-green-600">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-blue-600">
                                            <Phone className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
