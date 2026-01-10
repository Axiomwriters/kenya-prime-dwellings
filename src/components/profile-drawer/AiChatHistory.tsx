import { Button } from "@/components/ui/button";
import { MessageSquare, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AiChatHistory() {
    const chats = [
        { id: 1, title: "Westlands apartments under 25M", date: "2 days ago" },
        { id: 2, title: "Best areas to invest in Nairobi 2026", date: "1 week ago" },
        { id: 3, title: "Mortgage vs cash analysis", date: "Jan 05" },
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Saved AI Conversations
                </h3>
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="space-y-1">
                {chats.map(chat => (
                    <Button
                        key={chat.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2.5 px-3 font-normal text-left hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-lg group"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0 group-hover:bg-primary/20 transition-colors">
                            <span className="text-xs text-primary font-bold">AI</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{chat.title}</div>
                            <div className="text-[10px] text-muted-foreground">{chat.date} • Resume chat</div>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
