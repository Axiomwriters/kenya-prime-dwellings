import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Building2, User } from "lucide-react";

export default function AgencyModeToggle() {
    const [isAgencyMode, setIsAgencyMode] = useState(false);

    return (
        <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-full border">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${!isAgencyMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Agent</span>
            </div>

            <Switch
                checked={isAgencyMode}
                onCheckedChange={setIsAgencyMode}
                className="data-[state=checked]:bg-primary"
            />

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${isAgencyMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Agency</span>
            </div>
        </div>
    );
}
