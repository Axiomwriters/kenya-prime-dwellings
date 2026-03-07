import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProjectTypePicker } from "./ProjectTypePicker";
import { ProjectDetailsForm } from "./ProjectDetailsForm";
import { ProjectMediaForm } from "./ProjectMediaForm";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddProjectModal({ open, onOpenChange }: AddProjectModalProps) {
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Form Data
    const [formData, setFormData] = useState({
        project_type: 'renovation',
        category: 'kitchen',
        title: '',
        budget: '',
        location: '',
        scope: '',
        description: '',
        pinned: false
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Determine type for logic
    const selectedTypeGroup = formData.category === 'landscape' || formData.category.includes('garden') ? 'landscape' : 'construction';

    const handleDataChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTypeSelect = (typeId: string) => {
        // Map type picker ID to category defaults
        let category = 'construction';
        if (typeId === 'landscape') category = 'landscape';
        if (typeId === 'interior-design') category = 'interior-design';

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
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            toast({
                title: "Project Published! 🎉",
                description: "Your project is now live for clients to see.",
            });
            // Reset for next time
            setStep(0);
            setImages([]);
            setPreviews([]);
        }, 1500);
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
                            {step === 0 ? "What are you showcasing?" : step === 1 ? "Project Details" : "Media & Quality"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {step === 0 ? "Choose the project type to get started." : step === 1 ? "Tell us about the key features." : "Add high-quality photos to attract clients."}
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-[300px]">
                    {step === 0 && (
                        <ProjectTypePicker
                            selectedType={selectedTypeGroup}
                            onSelect={handleTypeSelect}
                        />
                    )}
                    {step === 1 && (
                        <ProjectDetailsForm
                            formData={formData}
                            handleChange={handleDataChange}
                            projectType={selectedTypeGroup}
                        />
                    )}
                    {step === 2 && (
                        <ProjectMediaForm
                            images={images}
                            previews={previews}
                            onImagesChange={handleImagesChange}
                            onRemoveImage={handleRemoveImage}
                            projectType={selectedTypeGroup}
                        />
                    )}
                </div>

                {step > 0 && (
                    <DialogFooter className="gap-2 sm:gap-0">
                        {step === 1 ? (
                            <Button onClick={() => setStep(2)}>
                                Continue to Photos
                            </Button>
                        ) : (
                            <div className="flex gap-2 w-full justify-end">
                                <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>Save Draft</Button>
                                <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Publish Project
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
