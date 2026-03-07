import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles } from "lucide-react";

interface formProps {
    formData: any;
    handleChange: (field: string, value: any) => void;
    projectType: string;
}

export function ProjectDetailsForm({ formData, handleChange, projectType }: formProps) {
    const isLandscape = projectType === 'landscape';

    return (
        <div className="space-y-6 py-2">

            {/* Title & AI */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Project Title</Label>
                    <Button variant="ghost" size="xs" className="text-purple-600 h-6 gap-1">
                        <Sparkles className="w-3 h-3" /> AI Generate
                    </Button>
                </div>
                <Input
                    placeholder="e.g. Modern Kitchen Renovation in Parklands"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>

            {/* Budget & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Budget (KES)</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 500000"
                        value={formData.budget}
                        onChange={(e) => handleChange('budget', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Parklands, Nairobi"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                        <Button variant="outline" size="icon" title="Pin Location">
                            <MapPin className="w-4 h-4 text-green-600" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Project Type</Label>
                    <Select value={formData.project_type} onValueChange={(val) => handleChange('project_type', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="renovation">Renovation</SelectItem>
                            <SelectItem value="new-construction">New Construction</SelectItem>
                            <SelectItem value="interior-design">Interior Design</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                            <SelectItem value="bathroom">Bathroom</SelectItem>
                            <SelectItem value="full-home">Full Home</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="landscape">Landscape</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Scope / Description */}
            <div className="space-y-2">
                <Label>Scope of Work (comma separated)</Label>
                <Input
                    placeholder={isLandscape ? "e.g. Garden Design, Paving, Water Feature" : "e.g. Cabinetry, Tiling, Plumbing, Electrical"}
                    value={formData.scope}
                    onChange={(e) => handleChange('scope', e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Description</Label>
                    <Button variant="ghost" size="xs" className="text-purple-600 h-6 gap-1">
                        <Sparkles className="w-3 h-3" /> AI Enhance
                    </Button>
                </div>
                <Textarea
                    placeholder="Describe the project..."
                    className="h-24"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
        </div>
    );
}
