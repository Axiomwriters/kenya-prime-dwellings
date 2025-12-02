import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, Calendar } from "lucide-react";

const deadlines = [
    { id: 1, title: "7 Licenses Expiring", time: "14 days", type: "warning" },
    { id: 2, title: "Verification Backlog", time: "24 hours", type: "critical" },
    { id: 3, title: "Host Payout Cycle", time: "3 days", type: "info" },
];

export function CountdownWidgets() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Critical Deadlines
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {deadlines.map((item) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-xl border flex items-center justify-between ${item.type === "critical" ? "bg-red-500/10 border-red-500/20" :
                                item.type === "warning" ? "bg-orange-500/10 border-orange-500/20" :
                                    "bg-blue-500/10 border-blue-500/20"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {item.type === "critical" ? <AlertCircle className="w-5 h-5 text-red-500" /> :
                                item.type === "warning" ? <AlertCircle className="w-5 h-5 text-orange-500" /> :
                                    <Calendar className="w-5 h-5 text-blue-500" />}
                            <span className="font-medium text-sm">{item.title}</span>
                        </div>
                        <div className="text-right">
                            <span className={`text-lg font-bold ${item.type === "critical" ? "text-red-500" :
                                    item.type === "warning" ? "text-orange-500" :
                                        "text-blue-500"
                                }`}>
                                {item.time}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
