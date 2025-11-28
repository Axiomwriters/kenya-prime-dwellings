import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Move, Eye, Share2, MapPin, Coffee, Wifi } from "lucide-react";

export default function Guidebook() {
    const [sections, setSections] = useState([
        { id: 1, title: "Welcome", content: "Welcome to our home! We're so happy to have you." },
        { id: 2, title: "WiFi & Tech", content: "Network: Guest_WiFi\nPassword: securepassword123" },
        { id: 3, title: "House Rules", content: "No smoking inside. Quiet hours after 10 PM." },
    ]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Digital Guidebook</h1>
                    <p className="text-muted-foreground">Create a beautiful guide for your guests.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button>
                        <Share2 className="w-4 h-4 mr-2" /> Share Link
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sections</CardTitle>
                            <CardDescription>Drag to reorder</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {sections.map((section) => (
                                <div key={section.id} className="flex items-center gap-2 p-3 bg-muted rounded-md cursor-move group">
                                    <Move className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium flex-1">{section.title}</span>
                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full mt-4 border-dashed">
                                <Plus className="w-4 h-4 mr-2" /> Add Section
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cover Image</label>
                                <div className="h-32 bg-muted rounded-md flex items-center justify-center border-2 border-dashed">
                                    <span className="text-muted-foreground text-sm">Upload Image</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Editor Main Area */}
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Edit Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Section Title</label>
                                <Input defaultValue="Welcome" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <Textarea className="min-h-[300px]" defaultValue="Welcome to our home! We're so happy to have you." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Recommendations</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 border rounded-md flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                            <Coffee className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">Java House</h4>
                                            <p className="text-xs text-muted-foreground">Best coffee nearby</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border rounded-md flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">Nairobi National Park</h4>
                                            <p className="text-xs text-muted-foreground">Must visit!</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-auto py-3 border-dashed">
                                        <Plus className="w-4 h-4 mr-2" /> Add Place
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
