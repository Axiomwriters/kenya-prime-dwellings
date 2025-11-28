import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, MapPin } from "lucide-react";

interface Post {
    id: string;
    author: {
        name: string;
        role: string;
        avatar: string;
        verified?: boolean;
    };
    content: string;
    image?: string;
    timestamp: string;
    likes: number;
    comments: number;
    type: "update" | "project" | "job";
    location?: string;
}

const MOCK_POSTS: Post[] = [
    {
        id: "1",
        author: {
            name: "Eng. David Kamau",
            role: "Structural Engineer",
            avatar: "",
            verified: true,
        },
        content: "Just completed the structural integrity assessment for the new commercial complex in Westlands. The use of high-grade steel reinforcement really makes a difference in these soil conditions. #Engineering #Construction #Nairobi",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60",
        timestamp: "2 hours ago",
        likes: 45,
        comments: 12,
        type: "project",
        location: "Westlands, Nairobi",
    },
    {
        id: "2",
        author: {
            name: "Sarah Wanjiku",
            role: "Architect",
            avatar: "",
            verified: true,
        },
        content: "Looking for a reliable Quantity Surveyor for a residential project in Karen. Must have experience with eco-friendly materials. DM me if interested!",
        timestamp: "4 hours ago",
        likes: 18,
        comments: 5,
        type: "job",
        location: "Karen, Nairobi",
    },
    {
        id: "3",
        author: {
            name: "BuildRight Contractors",
            role: "General Contractor",
            avatar: "",
            verified: true,
        },
        content: "Tip of the day: Always double-check your waterproofing layers before tiling. We've seen too many callbacks due to rushed prep work. Do it right the first time!",
        timestamp: "6 hours ago",
        likes: 89,
        comments: 24,
        type: "update",
    },
];

export function ProfessionalFeed() {
    return (
        <div className="space-y-6">
            {MOCK_POSTS.map((post) => (
                <Card key={post.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="flex gap-3">
                            <Avatar>
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-semibold text-sm">{post.author.name}</h3>
                                    {post.author.verified && (
                                        <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-100">
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{post.author.role}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{post.timestamp}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{post.content}</p>
                        {post.image && (
                            <div className="rounded-md overflow-hidden mb-3">
                                <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
                            </div>
                        )}
                        {post.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3" />
                                {post.location}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t pt-3 pb-3">
                        <div className="flex w-full justify-between">
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                                <ThumbsUp className="w-4 h-4" />
                                {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                                <MessageSquare className="w-4 h-4" />
                                {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
