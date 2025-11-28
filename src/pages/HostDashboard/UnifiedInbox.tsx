import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";

// Mock Data
const conversations = [
    {
        id: 1,
        guest: "Alice Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
        lastMessage: "Hi, is early check-in possible?",
        time: "10:30 AM",
        unread: 2,
        platform: "Airbnb",
        status: "Confirmed"
    },
    {
        id: 2,
        guest: "Mark Smith",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60",
        lastMessage: "Thanks for the details!",
        time: "Yesterday",
        unread: 0,
        platform: "Booking.com",
        status: "Inquiry"
    },
    {
        id: 3,
        guest: "Sarah Lee",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
        lastMessage: "We have checked out. The place was great!",
        time: "2 days ago",
        unread: 0,
        platform: "Direct",
        status: "Past Guest"
    }
];

const messages = [
    { id: 1, sender: "guest", text: "Hi, I have a question about the parking.", time: "10:00 AM" },
    { id: 2, sender: "host", text: "Hello Alice! Sure, what would you like to know?", time: "10:05 AM" },
    { id: 3, sender: "guest", text: "Is it secure and covered?", time: "10:15 AM" },
    { id: 4, sender: "host", text: "Yes, we have a dedicated underground parking spot for you.", time: "10:20 AM" },
    { id: 5, sender: "guest", text: "Great! Also, is early check-in possible?", time: "10:30 AM" }
];

export default function UnifiedInbox() {
    const [selectedChat, setSelectedChat] = useState(conversations[0]);
    const [replyText, setReplyText] = useState("");

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 animate-fade-in">

            {/* Sidebar: Conversation List */}
            <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col overflow-hidden">
                <div className="p-4 border-b space-y-4">
                    <h2 className="font-semibold text-lg">Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search messages..." className="pl-9" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">All</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">Unread</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">Airbnb</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">Booking</Badge>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {conversations.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${selectedChat.id === chat.id ? "bg-muted" : ""
                                    }`}
                            >
                                <Avatar>
                                    <AvatarImage src={chat.avatar} />
                                    <AvatarFallback>{chat.guest[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium truncate">{chat.guest}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                                    </div>
                                    <p className={`text-sm truncate ${chat.unread > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                                        {chat.lastMessage}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">{chat.platform}</Badge>
                                        {chat.status === "Confirmed" && <Badge className="text-[10px] h-5 px-1.5 bg-green-500 hover:bg-green-600">Confirmed</Badge>}
                                    </div>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={selectedChat.avatar} />
                            <AvatarFallback>{selectedChat.guest[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{selectedChat.guest}</h3>
                            <p className="text-xs text-muted-foreground">Modern Loft in Westlands • Dec 12-15</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Phone className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Video className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "host" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === "host"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none"
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.sender === "host" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-background">
                    <div className="flex gap-2 items-end">
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Type a message..."
                                className="pr-10"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground">
                                <Smile className="w-5 h-5" />
                            </Button>
                        </div>
                        <Button className="shrink-0">
                            <Send className="w-4 h-4 mr-2" /> Send
                        </Button>
                    </div>
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                        <Badge variant="secondary" className="cursor-pointer whitespace-nowrap">Check-in Info</Badge>
                        <Badge variant="secondary" className="cursor-pointer whitespace-nowrap">WiFi Password</Badge>
                        <Badge variant="secondary" className="cursor-pointer whitespace-nowrap">House Rules</Badge>
                        <Badge variant="secondary" className="cursor-pointer whitespace-nowrap">Thank You</Badge>
                    </div>
                </div>
            </Card>

            {/* Right Sidebar: Booking Details (Hidden on small screens) */}
            <Card className="hidden lg:block w-1/4 p-4 space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Trip Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-in</span>
                            <span>Dec 12, 2023</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-out</span>
                            <span>Dec 15, 2023</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Guests</span>
                            <span>2 Adults</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Nights</span>
                            <span>3</span>
                        </div>
                    </div>
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Payment</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold">KSh 24,000</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Paid</Badge>
                        </div>
                    </div>
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <Input placeholder="Add private note..." className="text-sm" />
                </div>
            </Card>
        </div>
    );
}
