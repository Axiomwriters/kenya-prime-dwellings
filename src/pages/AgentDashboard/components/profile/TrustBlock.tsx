import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Star, Languages, Briefcase } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrustBlockProps {
    profile: any;
    onChange: (field: string, value: any) => void;
}

export function TrustBlock({ profile, onChange }: TrustBlockProps) {
    const SPECIALIZATIONS = ["Rentals", "Student Housing", "Luxury", "Commercial", "Land", "Short Stays"];

    const toggleSpecialization = (tag: string) => {
        const current = profile.specializations || [];
        if (current.includes(tag)) {
            onChange('specializations', current.filter((t: string) => t !== tag));
        } else if (current.length < 5) {
            onChange('specializations', [...current, tag]);
        }
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    Public Trust & Credibility
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Stats Row (Auto-calculated) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-3 rounded-lg text-center">
                        <div className="flex justify-center mb-1"><Clock className="w-4 h-4 text-primary" /></div>
                        <div className="text-lg font-bold">~15m</div>
                        <div className="text-xs text-muted-foreground">Avg. Reply Time</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg text-center">
                        <div className="flex justify-center mb-1"><Star className="w-4 h-4 text-yellow-500" /></div>
                        <div className="text-lg font-bold">4.8</div>
                        <div className="text-xs text-muted-foreground">Rating (12 reviews)</div>
                    </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Years of Experience
                    </label>
                    <Select
                        value={profile.experience || "0-1"}
                        onValueChange={(val) => onChange('experience', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0-1">0 - 1 Years</SelectItem>
                            <SelectItem value="2-5">2 - 5 Years</SelectItem>
                            <SelectItem value="5-10">5 - 10 Years</SelectItem>
                            <SelectItem value="10+">10+ Years</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Languages */}
                <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Languages className="w-4 h-4" /> Languages Spoken
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['English', 'Kiswahili'].map(lang => (
                            <Badge key={lang} variant="outline" className="bg-primary/5 border-primary/20">
                                {lang}
                            </Badge>
                        ))}
                        {/* Mocking adding more for now, or just static common ones */}
                    </div>
                </div>

                {/* Specializations Tags */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Specialization (Max 5)</label>
                        <span className="text-xs text-muted-foreground">{(profile.specializations || []).length}/5</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SPECIALIZATIONS.map((tag) => {
                            const isActive = (profile.specializations || []).includes(tag);
                            return (
                                <Badge
                                    key={tag}
                                    variant={isActive ? "default" : "outline"}
                                    className={`cursor-pointer transition-all ${!isActive && 'hover:bg-secondary'}`}
                                    onClick={() => toggleSpecialization(tag)}
                                >
                                    {tag}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
