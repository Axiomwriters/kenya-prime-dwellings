import { useState, useRef } from "react";
import { Upload, X, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageFile {
  file: File;
  preview: string;
  url?: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  onUpload?: (file: File) => Promise<string | null>;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  onUpload,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (images.length < maxImages) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/')
    );
    
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const remaining = maxImages - images.length;
    const filesToAdd = files.slice(0, remaining);
    
    if (files.length > remaining) {
      toast.error(`You can only upload ${remaining} more image(s)`);
    }

    const newImages: ImageFile[] = [];
    
    for (const file of filesToAdd) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({ file, preview });
    }

    onImagesChange([...images, ...newImages]);

    // Upload if onUpload is provided
    if (onUpload) {
      for (let i = 0; i < newImages.length; i++) {
        const index = images.length + i;
        setUploadingIndex(index);
        
        try {
          const url = await onUpload(newImages[i].file);
          if (url) {
            newImages[i].url = url;
          }
        } catch (error) {
          toast.error(`Failed to upload ${newImages[i].file.name}`);
        }
      }
      
      setUploadingIndex(null);
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={cn(
            "glass-card rounded-xl border-2 border-dashed border-primary/20 p-8 text-center cursor-pointer transition-all",
            isDragging && "border-primary bg-primary/10"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              handleFiles(files);
            }}
            className="hidden"
          />
          
          <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
          <p className="text-sm text-foreground mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            {images.length}/{maxImages} images • Max 10MB per image
          </p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group glass-card rounded-xl overflow-hidden">
              <img
                src={image.preview}
                alt={`Property ${index + 1}`}
                className="w-full aspect-video object-cover"
              />
              
              {index === 0 && (
                <Badge className="absolute top-2 left-2 bg-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Cover
                </Badge>
              )}
              
              {uploadingIndex === index && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMove(index, 'left')}
                  disabled={index === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMove(index, 'right')}
                  disabled={index === images.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
