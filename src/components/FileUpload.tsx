import { useState, useRef } from "react";
import { Upload, X, File, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number; // in MB
  onUpload: (file: File) => Promise<string | null>;
  preview?: string | null;
  disabled?: boolean;
}

export function FileUpload({
  label,
  accept,
  maxSize,
  onUpload,
  preview,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(preview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      if (url) {
        setCurrentPreview(url);
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setCurrentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPdf = currentPreview?.endsWith('.pdf');
  const isImage = currentPreview && !isPdf;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentPreview ? (
        <div className="relative glass-card rounded-xl p-4">
          {isImage && (
            <img
              src={currentPreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          )}
          {isPdf && (
            <div className="flex items-center justify-center h-48 bg-muted/50 rounded-lg">
              <File className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-6 right-6"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "glass-card rounded-xl border-2 border-dashed border-primary/20 p-8 text-center cursor-pointer transition-all",
            isDragging && "border-primary bg-primary/10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!disabled ? handleButtonClick : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
            disabled={disabled}
          />
          
          {isUploading ? (
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          ) : (
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
          )}
          
          <p className="text-sm text-foreground mb-1">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-muted-foreground">
            Max size: {maxSize}MB
          </p>
        </div>
      )}
    </div>
  );
}
