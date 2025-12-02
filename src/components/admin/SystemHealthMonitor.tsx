import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Database, Server, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const systemStatus = [
    { name: "API Uptime", status: "Operational", icon: Server, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Database", status: "Operational", icon: Database, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Cache (Redis)", status: "Degraded", icon: Activity, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "Storage", status: "Operational", icon: Server, color: "text-green-500", bg: "bg-green-500/10" },
];

const errorLogs = [
    { id: 1, message: "Payment Gateway Timeout", time: "2 mins ago", severity: "high" },
    { id: 2, message: "Image Upload Failed", time: "15 mins ago", severity: "medium" },
    { id: 3, message: "API Rate Limit Exceeded", time: "1 hour ago", severity: "low" },
];

export function SystemHealthMonitor() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    System Health Monitor
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {systemStatus.map((item) => (
                        <div key={item.name} className={`p-4 rounded-xl border ${item.bg} flex flex-col gap-2`}>
                            <div className="flex items-center justify-between">
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                {item.status === "Operational" ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{item.name}</p>
                                <p className={`font-semibold ${item.color}`}>{item.status}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-3">Recent Error Logs</h4>
                    <div className="space-y-3">
                        {errorLogs.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="flex items-center gap-3">
                                    <XCircle className={`w-4 h-4 ${log.severity === "high" ? "text-red-500" :
                                            log.severity === "medium" ? "text-orange-500" : "text-yellow-500"
                                        }`} />
                                    <span className="text-sm font-medium">{log.message}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
