import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";

const activities = [
    { id: 1, user: "Alice M.", action: "Logged in", time: "Just now", avatar: "AM" },
    { id: 2, user: "John D.", action: "Updated listing 'Sunset Villa'", time: "2 mins ago", avatar: "JD" },
    { id: 3, user: "Sarah K.", action: "Uploaded verification docs", time: "5 mins ago", avatar: "SK" },
    { id: 4, user: "Mike R.", action: "Reported a listing", time: "10 mins ago", avatar: "MR" },
    { id: 5, user: "Bot_X1", action: "Failed login attempt", time: "12 mins ago", avatar: "BX", type: "suspicious" },
    { id: 6, user: "Emily W.", action: "Viewed 15 listings", time: "15 mins ago", avatar: "EW" },
    { id: 7, user: "David L.", action: "Contacted Agent", time: "20 mins ago", avatar: "DL" },
];

export function LiveUserActivity() {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary animate-pulse" />
                    Live User Feed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className={activity.type === "suspicious" ? "bg-red-500 text-white" : ""}>
                                        {activity.avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {activity.user}
                                        {activity.type === "suspicious" && (
                                            <span className="ml-2 text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                Suspicious
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                                </div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                    {activity.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
