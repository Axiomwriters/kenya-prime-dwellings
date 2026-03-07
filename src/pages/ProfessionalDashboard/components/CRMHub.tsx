import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Calendar, ArrowRight, Ghost, AlertCircle, FileText } from "lucide-react";

const clients = [
    {
        id: 1,
        name: "EcoBuild Corp",
        status: "active", // active, pending, stalled
        progress: 80, // Project completion percentage
        lastAction: "Sent invoice for milestone 2",
        timeInStage: "5 days",
        avatar: "EC",
        stage: "Execution", // Scoping -> Proposal -> Execution -> Finalizing -> Completed
        nextAction: "send_invoice",
    },
    {
        id: 2,
        name: "Jane Doe",
        status: "pending",
        progress: 25,
        lastAction: "Proposal sent, awaiting feedback",
        timeInStage: "3 days",
        avatar: "JD",
        stage: "Proposal",
        nextAction: "follow_up_proposal",
    },
    {
        id: 3,
        name: "Urban Living",
        status: "stalled",
        progress: 10,
        lastAction: "No reply to follow-up email",
        timeInStage: "10 days",
        avatar: "UL",
        stage: "Scoping",
        nextAction: "gentle_ping",
    },
];

const STAGES = ["Scoping", "Proposal", "Execution", "Finalizing", "Completed"];

export default function CRMHub() {
    const getStageProgress = (stage: string) => {
        const index = STAGES.indexOf(stage);
        return ((index + 1) / STAGES.length) * 100;
    };

    const getStatusBadge = (status: string) => {
        if (status === 'stalled') return { label: "Stalled", class: "bg-slate-200 text-slate-600 border-slate-300" };
        if (status === 'active') return { label: "Active", class: "bg-green-100 text-green-600 border-green-200" };
        if (status === 'pending') return { label: "Pending", class: "bg-yellow-100 text-yellow-600 border-yellow-200" };
        return { label: "New", class: "bg-blue-100 text-blue-600 border-blue-200" };
    };

    return (
        <Card className="col-span-full border-t-4 border-t-primary shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <span>💬</span> Client Project Hub
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">3 active projects</span> require attention today.
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                    View All Projects <ArrowRight className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {clients.map((client) => {
                        const badge = getStatusBadge(client.status);

                        return (
                            <div key={client.id} className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md">

                                {/* 1. Avatar & Info */}
                                <div className="flex items-start gap-4 md:w-[250px] shrink-0">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarFallback className={
                                            client.status === 'active' ? 'bg-green-100 text-green-600 font-bold' :
                                                client.status === 'pending' ? 'bg-yellow-100 text-yellow-600 font-bold' :
                                                    'bg-slate-100 text-slate-600'
                                        }>
                                            {client.avatar}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm">{client.name}</h4>
                                            <Badge variant="outline" className={`text-[10px] px-1.5 h-5 ${badge.class}`}>
                                                {badge.label}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className={`font-bold`}>{client.progress}% Complete</span>
                                            <span>•</span>
                                            <span>{client.timeInStage} in stage</span>
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

                                    <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${client.status === 'stalled' ? 'bg-slate-400' : 'bg-primary'}`}
                                            style={{ width: `${getStageProgress(client.stage)}%` }}
                                        />
                                    </div>

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
                                    {client.nextAction === 'send_invoice' && (
                                        <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200">
                                            <FileText className="w-3 h-3 mr-2" /> Send Invoice
                                        </Button>
                                    )}

                                    {client.nextAction === 'follow_up_proposal' && (
                                        <Button size="sm" variant="secondary" className="w-full text-xs text-green-700 bg-green-100 hover:bg-green-200 border border-green-200">
                                            <MessageCircle className="w-3 h-3 mr-2" /> Follow Up
                                        </Button>
                                    )}

                                    {client.nextAction === 'gentle_ping' && (
                                        <Button size="sm" variant="outline" className="w-full text-xs text-muted-foreground hover:text-foreground">
                                            <AlertCircle className="w-3 h-3 mr-2" /> Gentle Ping
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
