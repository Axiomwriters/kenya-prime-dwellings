import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ExternalLink, Copy, Smartphone, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PublicProfilePreviewProps {
    slug: string;
    settings: any;
    onChange: (field: string, value: any) => void;
}

export function PublicProfilePreview({ slug, settings, onChange }: PublicProfilePreviewProps) {
    const fullUrl = `https://propertyhub.co.ke/agents/${slug || 'your-name'}`;

    const copyLink = () => {
        navigator.clipboard.writeText(fullUrl);
        toast.success("Profile link copied!");
    };

    return (
        <Card className="border-t-4 border-t-purple-500 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5 text-purple-600" /> Public Profile & Landing Page
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="space-y-2">
                    <Label>Your Public URL (SEO Friendly)</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm hidden md:inline">propertyhub.co.ke/agents/</span>
                            <Input
                                className="pl-3 md:pl-[180px]"
                                value={slug}
                                onChange={(e) => onChange('slug', e.target.value)}
                                placeholder="kamau-properties"
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={copyLink}>
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="icon" className="bg-purple-600 hover:bg-purple-700">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        This is your digital business card. Share this link on Instagram, WhatsApp, and Facebook.
                    </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold">Visibility Controls</h4>

                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-normal">
                            <Smartphone className="w-4 h-4 text-muted-foreground" /> Show Phone Number Publicly
                        </Label>
                        <Switch checked={settings.show_phone} onCheckedChange={(v) => onChange('show_phone', v)} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-normal">
                            <MessageCircle className="w-4 h-4 text-muted-foreground" /> Show WhatsApp Button
                        </Label>
                        <Switch checked={settings.show_whatsapp} onCheckedChange={(v) => onChange('show_whatsapp', v)} />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
