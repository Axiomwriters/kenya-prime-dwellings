import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MediaProps {
    images: File[];
    previews: string[];
    onImagesChange: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
    listingType: string;
}

export function ListingMediaForm({ images, previews, onImagesChange, onRemoveImage, listingType }: MediaProps) {
    const isLand = listingType === 'land';
    const minPhotos = isLand ? 5 : 7;
    const hasEnoughPhotos = images.length >= minPhotos;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onImagesChange(Array.from(e.target.files));
        }
    };

    return (
        <div className="space-y-6 py-4">

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm">Quality Standards</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        {isLand
                            ? "Land listings perform best with at least 5 photos showing boundaries, access roads, and topography."
                            : "Premium homes require at least 7 photos. Include kitchen, bathrooms, and living areas."}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>Property Images</Label>
                    <span className={cn("text-xs font-medium", hasEnoughPhotos ? "text-green-600" : "text-amber-600")}>
                        {images.length} / {minPhotos} Required
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                            <img src={src} alt="Upload" className="w-full h-full object-cover" />
                            <button
                                onClick={() => onRemoveImage(i)}
                                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {/* Mock Quality Check Badge */}
                            {i === 0 && (
                                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-400" /> High Res
                                </div>
                            )}
                        </div>
                    ))}

                    <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-all bg-muted/30 hover:bg-primary/5">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground font-medium">Add Photos</span>
                        <span className="text-[10px] text-muted-foreground/70 mt-1">Max 10MB</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
            </div>

            <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Optional Boosts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start text-muted-foreground">
                        <Upload className="w-4 h-4 mr-2" /> Upload Video Tour
                    </Button>
                    <Button variant="outline" className="justify-start text-muted-foreground">
                        <Upload className="w-4 h-4 mr-2" /> Upload Floor Plan
                    </Button>
                </div>
            </div>
        </div>
    );
}
