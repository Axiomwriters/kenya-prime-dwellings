import { Button } from "@/components/ui/button";
import { MessageSquare, Search, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export function AiChatHistory() {
    const [chats, setChats] = useState<{ id: number, title: string, date: string }[]>([]);

    useEffect(() => {
        const loadHistory = () => {
            try {
                const history = JSON.parse(localStorage.getItem('property_hub_search_history') || '[]');
                const formattedHistory = history.map((item: string, index: number) => ({
                    id: index,
                    title: item,
                    date: "Just now" // Simplified for now, as we only store strings
                }));
                setChats(formattedHistory);
            } catch (e) {
                console.error("Failed to load chat history", e);
            }
        };

        loadHistory();

        // Listen for storage events to update real-time
        window.addEventListener('storage', loadHistory);
        return () => window.removeEventListener('storage', loadHistory);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('property_hub_search_history');
        setChats([]);
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Saved AI Conversations
                </h3>
                {chats.length > 0 && (
                    <button onClick={clearHistory} className="text-xs text-muted-foreground hover:text-red-500 transition-colors">
                        Clear
                    </button>
                )}
            </div>

            {chats.length === 0 ? (
                <div className="text-center py-8 px-4 bg-muted/30 rounded-lg border border-border/50 border-dashed">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No recent AI searches found.</p>
                </div>
            ) : (
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
            )}
        </div>
    );
}
