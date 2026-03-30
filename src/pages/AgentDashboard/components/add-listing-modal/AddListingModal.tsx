import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ListingTypePicker } from "./ListingTypePicker";
import { ListingDetailsForm } from "./ListingDetailsForm";
import { ListingMediaForm } from "./ListingMediaForm";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadPropertyImage } from "@/utils/upload";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AddListingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddListingModal({ open, onOpenChange }: AddListingModalProps) {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Form Data
    const [formData, setFormData] = useState({
        listing_type: 'sale',
        category: 'house',
        title: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        amenities: '',
        description: '',
        size: '',
        pinned: false
    });

    // Validation
    const isDetailsValid = formData.title && formData.price && formData.location;

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Determine type for logic
    const selectedTypeGroup = formData.category === 'land' || formData.category.includes('plot') ? 'land' : 'house';
    const minPhotos = selectedTypeGroup === 'land' ? 5 : 7;
    const isMediaValid = images.length >= minPhotos;

    const handleDataChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTypeSelect = (typeId: string) => {
        // Map type picker ID to category defaults
        let category = 'house';
        if (typeId === 'land') category = 'land';
        if (typeId === 'commercial') category = 'commercial';

        setFormData(prev => ({ ...prev, category }));
        setStep(1);
    };

    const handleImagesChange = (newFiles: File[]) => {
        const updatedFiles = [...images, ...newFiles];
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImages(updatedFiles);
        setPreviews([...previews, ...newPreviews]);
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to create a listing",
                variant: "destructive"
            });
            return;
        }

        if (!isDetailsValid) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        if (!isMediaValid) {
            toast({
                title: "Error",
                description: `Please upload at least ${minPhotos} photos`,
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            // Upload images first
            const imageUrls = await Promise.all(
                images.map(file => uploadPropertyImage(file))
            );

            // Parse amenities into array
            const amenitiesArray = formData.amenities 
                ? formData.amenities.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [];

            // Create listing
            const { error } = await supabase.from("agent_listings").insert({
                agent_id: user.id,
                title: formData.title,
                description: formData.description || '',
                price: Number(formData.price),
                location: formData.location,
                listing_type: formData.listing_type,
                category: formData.category,
                images: imageUrls,
                bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
                bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
                land_size: formData.size || null,
                amenities: amenitiesArray,
                status: 'approved'
            });

            if (error) throw error;

            toast({
                title: "Listing Published! 🎉",
                description: "Your property is now live.",
            });

            onOpenChange(false);
            // Reset for next time
            setStep(0);
            setImages([]);
            setPreviews([]);
            setFormData({
                listing_type: 'sale',
                category: 'house',
                title: '',
                price: '',
                location: '',
                bedrooms: '',
                bathrooms: '',
                amenities: '',
                description: '',
                size: '',
                pinned: false
            });
            
            // Navigate to listings page to see the new listing
            navigate('/agent/listings');
        } catch (error: any) {
            console.error("Error creating listing:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create listing",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:h-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {step > 0 && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={() => setStep(step - 1)}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <DialogTitle>
                            {step === 0 ? "What are you listing?" : step === 1 ? "Property Details" : "Media & Quality"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {step === 0 ? "Choose the property type to get started." : step === 1 ? "tell us about the key features." : "Add high-quality photos to boost ranking."}
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[300px]">
                    {step === 0 && (
                        <ListingTypePicker
                            selectedType={selectedTypeGroup}
                            onSelect={handleTypeSelect}
                        />
                    )}
                    {step === 1 && (
                        <ListingDetailsForm
                            formData={formData}
                            handleChange={handleDataChange}
                            listingType={selectedTypeGroup}
                        />
                    )}
                    {step === 2 && (
                        <ListingMediaForm
                            images={images}
                            previews={previews}
                            onImagesChange={handleImagesChange}
                            onRemoveImage={handleRemoveImage}
                            listingType={selectedTypeGroup}
                        />
                    )}
                </div>

                {step > 0 && (
                    <DialogFooter className="gap-2 sm:gap-0">
                        {step === 1 ? (
                            <Button onClick={() => setStep(2)} disabled={!isDetailsValid}>
                                Continue to Photos
                            </Button>
                        ) : (
                            <div className="flex gap-2 w-full justify-end">
                                <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>Save Draft</Button>
                                <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Publish Listing
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
