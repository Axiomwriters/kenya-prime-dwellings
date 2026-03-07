import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Calendar, ArrowRight, Star } from "lucide-react";

const clients = [
    {
        id: 1,
        name: "Jane Doe",
        status: "active",
        engagementScore: 85,
        lastAction: "Viewed 'Kitchen Remodel' project",
        timeStuck: "3 days",
        avatar: "JD",
        stage: "Proposal",
        nextAction: "send_proposal",
        phone: "+254...",
    },
    {
        id: 2,
        name: "Peter Jones",
        status: "new",
        engagementScore: 60,
        lastAction: "Sent an inquiry about landscape design",
        timeStuck: "1 day",
        avatar: "PJ",
        stage: "Discovery",
        nextAction: "schedule_consultation",
        phone: "+254...",
    },
    {
        id: 3,
        name: "Maryanne Communications",
        status: "review",
        engagementScore: 95,
        lastAction: "Project 'Office Fit-out' completed",
        timeStuck: "5 days",
        avatar: "MC",
        stage: "Completed",
        nextAction: "request_review",
        phone: "+254...",
    },
];

const STAGES = ["Discovery", "Proposal", "In-Progress", "Review", "Completed"];

export default function Clients() {
    const getStageProgress = (stage: string) => {
        const index = STAGES.indexOf(stage);
        return ((index + 1) / STAGES.length) * 100;
    };

    const getEngagementColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-slate-500";
    };

    const getEngagementBadge = (score: number, status: string) => {
        if (status === 'review') return { label: "Needs Review", class: "bg-blue-100 text-blue-600 border-blue-200" };
        if (score >= 80) return { label: "🔥 High", class: "bg-green-100 text-green-600 border-green-200" };
        if (score >= 50) return { label: "🤔 Medium", class: "bg-yellow-100 text-yellow-600 border-yellow-200" };
        return { label: "🧊 Low", class: "bg-slate-100 text-slate-600 border-slate-200" };
    };

    return (
        <Card className="col-span-full border-t-4 border-t-primary shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <span>💬</span> Client Relationship Hub
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">3 active clients</span> require attention today.
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    View All Clients <ArrowRight className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {clients.map((client) => {
                        const badge = getEngagementBadge(client.engagementScore, client.status);

                        return (
                            <div key={client.id} className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md">

                                {/* 1. Avatar & Score */}
                                <div className="flex items-start gap-4 md:w-[250px] shrink-0">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                            <AvatarFallback className={
                                                client.engagementScore >= 80 ? 'bg-green-100 text-green-600 font-bold' :
                                                client.engagementScore >= 50 ? 'bg-yellow-100 text-yellow-600 font-bold' :
                                                        'bg-slate-100 text-slate-600'
                                            }>
                                                {client.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm">{client.name}</h4>
                                            <Badge variant="outline" className={`text-[10px] px-1.5 h-5 ${badge.class}`}>
                                                {badge.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className={`font-bold ${getEngagementColor(client.engagementScore)}`}>{client.engagementScore}% Engagement</span>
                                            <span>•</span>
                                            <span>{client.timeStuck} in stage</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Timeline Visualization */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Current Stage: <span className="text-primary">{client.stage}</span>
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            Last: {client.lastAction}
                                        </span>
                                    </div>

                                    {/* Pipeline Progress Bar */}
                                    <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 bg-primary`}
                                            style={{ width: `${getStageProgress(client.stage)}%` }}
                                        />
                                    </div>

                                    {/* Stages Labels */}
                                    <div className="flex justify-between text-[10px] text-muted-foreground/60 font-medium px-0.5">
                                        {STAGES.map((s) => (
                                            <span key={s} className={s === client.stage ? "text-foreground font-bold" : ""}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Smart Actions */}
                                <div className="md:w-[180px] shrink-0 flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0 dashed-border">
                                    {client.nextAction === 'schedule_consultation' && (
                                        <Button size="sm" className="w-full text-xs bg-green-600 hover:bg-green-700 shadow-sm shadow-green-200">
                                            <Calendar className="w-3 h-3 mr-2" /> Schedule Consultation
                                        </Button>
                                    )}

                                    {client.nextAction === 'send_proposal' && (
                                        <Button size="sm" variant="secondary" className="w-full text-xs text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200">
                                            <MessageCircle className="w-3 h-3 mr-2" /> Send Proposal
                                        </Button>
                                    )}

                                    {client.nextAction === 'request_review' && (
                                        <Button size="sm" variant="outline" className="w-full text-xs text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200">
                                            <Star className="w-3 h-3 mr-2" /> Request Review
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
