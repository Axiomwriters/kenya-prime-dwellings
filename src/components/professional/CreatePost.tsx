import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Briefcase, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export function CreatePost() {
    const [content, setContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = () => {
        if (!content.trim()) return;

        setIsPosting(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Post created successfully!");
            setContent("");
            setIsPosting(false);
        }, 1000);
    };

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <Textarea
                            placeholder="Share a project update, tip, or opportunity..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                        />
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-2 sm:px-3" title="Photos/Videos">
                                    <Image className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden lg:inline">Photos/Videos</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-2 sm:px-3" title="Projects">
                                    <Briefcase className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden lg:inline">Projects</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-2 sm:px-3" title="Pin Location">
                                    <MapPin className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden lg:inline">Pin</span>
                                </Button>
                            </div>
                            <Button onClick={handlePost} disabled={!content.trim() || isPosting} size="sm" className="gap-2">
                                <Send className="w-4 h-4" />
                                {isPosting ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
