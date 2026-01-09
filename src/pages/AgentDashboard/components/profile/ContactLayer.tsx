import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessageCircle, Phone, Calendar } from "lucide-react";

interface ContactLayerProps {
    settings: any;
    onChange: (field: string, value: boolean) => void;
}

export function ContactLayer({ settings, onChange }: ContactLayerProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Smart Contact & Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp Auto-Replies
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Allow clients to get instant info via WhatsApp.
                        </p>
                    </div>
                    <Switch
                        checked={settings.allow_whatsapp_replies}
                        onCheckedChange={(val) => onChange('allow_whatsapp_replies', val)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" /> Instant Call Requests
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Receive "Call Me Now" push notifications.
                        </p>
                    </div>
                    <Switch
                        checked={settings.allow_calls}
                        onCheckedChange={(val) => onChange('allow_calls', val)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" /> Trip Booking
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Allow clients to book viewing slots directly.
                        </p>
                    </div>
                    <Switch
                        checked={settings.allow_bookings}
                        onCheckedChange={(val) => onChange('allow_bookings', val)}
                    />
                </div>

                {/* Availability Schedule Mock */}
                <div className="pt-4 border-t">
                    <Label className="mb-3 block">Weekly Availability</Label>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="bg-primary/5 p-2 rounded cursor-pointer hover:bg-primary/20 transition-colors">
                                {day}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        Click to manage hours (Syncs with Google Calendar)
                    </p>
                </div>

            </CardContent>
        </Card>
    );
}
