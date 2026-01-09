import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bot, Sparkles, BrainCircuit, BellRing } from "lucide-react";

interface SmartAssistantSettingsProps {
    settings: any;
    onChange: (field: string, value: boolean) => void;
}

export function SmartAssistantSettings({ settings, onChange }: SmartAssistantSettingsProps) {
    return (
        <Card className="bg-gradient-to-br from-background to-blue-500/5 border-blue-100">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-blue-600" /> Smart Assistant (AI)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="flex items-start gap-3">
                    <Switch
                        className="mt-1"
                        checked={settings.ai_replies}
                        onCheckedChange={(val) => onChange('ai_replies', val)}
                    />
                    <div>
                        <Label className="flex items-center gap-2 font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Enable AI Replies
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                            Assistant drafts responses to common inquiries (Price, Location, Features) for your review.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Switch
                        className="mt-1"
                        checked={settings.price_optimization}
                        onCheckedChange={(val) => onChange('price_optimization', val)}
                    />
                    <div>
                        <Label className="flex items-center gap-2 font-semibold">
                            <BrainCircuit className="w-3.5 h-3.5 text-purple-500" /> Price Optimization
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                            Get notified when your listings are overpriced compared to market trends in your area.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Switch
                        className="mt-1"
                        checked={settings.follow_up_reminders}
                        onCheckedChange={(val) => onChange('follow_up_reminders', val)}
                    />
                    <div>
                        <Label className="flex items-center gap-2 font-semibold">
                            <BellRing className="w-3.5 h-3.5 text-orange-500" /> Smart Follow-ups
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                            Remind me to follow up with "Warm" and "Hot" leads after 48 hours of inactivity.
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
