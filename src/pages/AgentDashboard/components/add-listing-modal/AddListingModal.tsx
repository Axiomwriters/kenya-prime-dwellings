import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ListingTypePicker } from "./ListingTypePicker";
import { ListingMediaForm } from "./ListingMediaForm";
import { MapPicker } from "@/components/ui/map-picker";
import { ChevronLeft, Check, Loader2, Save, MapPin, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadPropertyImage } from "@/utils/upload";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AddListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type ListingCategory = 'house' | 'apartment' | 'villa' | 'bungalow' | 'townhouse' | 'cottage' | 
  'land' | 'residential_plot' | 'commercial_land' | 'agricultural' | 'industrial' | 'commercial';
export type ListingType = 'sale' | 'rent' | 'lease';

interface FormData {
  listing_type: ListingType;
  category: ListingCategory;
  title: string;
  price: string;
  location: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  description: string;
  size: string;
  furnishing: string;
  parking: string;
  pets_allowed: boolean;
  pinned: boolean;
  latitude: number | null;
  longitude: number | null;
  video_url: string;
  year_built: string;
  floor: string;
  unit_number: string;
  zoning: string;
}

const HOUSE_AMENITIES = [
  "Parking", "Garden", "Pool", "Gym", "Security", "CCTV", "Backup Generator", 
  "Borehole", "Water Tank", "Solar Panels", "Air Conditioning", "Fireplace",
  "Balcony", "Terrace", "Servant Quarters", "Guest House", "Electric Fence"
];

const LAND_AMENITIES = [
  "Water", "Electricity", "Perimeter Wall", "Fenced", "Gated Community", 
  "Surveyed", "Title Deed", "Paved Access", "Drilled Well"
];

const initialFormData: FormData = {
  listing_type: 'sale',
  category: 'house',
  title: '',
  price: '',
  location: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  amenities: [],
  description: '',
  size: '',
  furnishing: 'unfurnished',
  parking: 'none',
  pets_allowed: false,
  pinned: false,
  latitude: null,
  longitude: null,
  video_url: '',
  year_built: '',
  floor: '',
  unit_number: '',
  zoning: ''
};

function ListingDetailsFormSimple({ 
  formData, 
  handleChange, 
  listingType,
  onOpenMap
}: { 
  formData: FormData; 
  handleChange: (field: string, value: any) => void;
  listingType: string;
  onOpenMap: () => void;
}) {
  const amenities = listingType === 'land' ? LAND_AMENITIES : HOUSE_AMENITIES;
  const selectedAmenities = formData.amenities || [];

  return (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <Label>Property Title *</Label>
        <Input
          placeholder="e.g. Modern 3-Bedroom Apartment in Kilimani"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price (KSh) *</Label>
          <Input
            type="number"
            placeholder="e.g. 15000000"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Location *</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Kilimani, Nairobi"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon" 
              title="Pin Location" 
              type="button" 
              onClick={onOpenMap}
              className={formData.pinned ? "border-green-500 text-green-600" : ""}
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Area / Neighborhood</Label>
        <Input
          placeholder="e.g. near UN Headquarter"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Input type="number" placeholder="3" value={formData.bedrooms} onChange={(e) => handleChange('bedrooms', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Input type="number" placeholder="2" value={formData.bathrooms} onChange={(e) => handleChange('bathrooms', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Size (sqm)</Label>
          <Input placeholder="150" value={formData.size} onChange={(e) => handleChange('size', e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity: string) => (
            <Button
              key={amenity}
              variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => {
                if (selectedAmenities.includes(amenity)) {
                  handleChange('amenities', selectedAmenities.filter((a: string) => a !== amenity));
                } else {
                  handleChange('amenities', [...selectedAmenities, amenity]);
                }
              }}
            >
              {amenity}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe the property..."
          className="h-24"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
    </div>
  );
}

export function AddListingModal({ open, onOpenChange }: AddListingModalProps) {
  const [step, setStep] = useState(0);
  const [isMapStep, setIsMapStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [images, setImages] = useState<{file: File; preview: string; status: 'pending' | 'uploading' | 'uploaded' | 'error'; url?: string}[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const selectedTypeGroup = formData.category === 'land' ? 'land' : 'house';
  const minPhotos = selectedTypeGroup === 'land' ? 5 : 7;

  const handleDataChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleTypeSelect = (typeId: string) => {
    let category: ListingCategory = 'house';
    if (typeId === 'land') category = 'land';
    handleDataChange('category', category);
    setStep(1);
  };

  const handleImagesChange = (newFiles: File[]) => {
    const newImages = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const
    }));
    setImages(prev => [...prev, ...newImages]);
    setIsDirty(true);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!formData.title || !formData.price || !formData.location) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("agent_listings").insert({
        agent_id: user.id,
        title: formData.title,
        description: formData.description || '',
        category: formData.category,
        listing_type: formData.listing_type,
        price: Number(formData.price),
        location: formData.location,
        area: formData.area || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        land_size: formData.size || null,
        amenities: formData.amenities,
        images: [],
        status: 'approved'
      });

      if (error) throw error;

      toast({ title: "Success!", description: "Listing created" });
      setFormData(initialFormData);
      setImages([]);
      setStep(0);
      onOpenChange(false);
      navigate('/agent/listings');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = open || isMapStep;

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsMapStep(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleDialogChange}>
      <DialogContent className={isMapStep ? "max-w-2xl max-h-[95vh] overflow-hidden p-0" : "max-w-4xl max-h-[90vh] overflow-y-auto"}>
        {isMapStep ? (
          <>
            <DialogHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <DialogTitle>Pin Exact Location</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsMapStep(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogHeader>
            <div className="p-4 pt-0">
              <MapPicker 
                lat={formData.latitude || -1.2921} 
                lng={formData.longitude || 36.8219}
                autoLocate={true}
                onLocationChange={(lat, lng) => {
                  handleDataChange('latitude', lat);
                  handleDataChange('longitude', lng);
                  handleDataChange('pinned', true);
                }}
              />
              <p className="text-sm text-muted-foreground mt-3">
                {formData.latitude && formData.longitude 
                  ? `Selected: ${formData.latitude.toFixed(5)}, ${formData.longitude.toFixed(5)}`
                  : "Click on the map to pin the location"}
              </p>
            </div>
            <div className="p-4 pt-2 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsMapStep(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsMapStep(false)}>
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {step === 0 ? "What are you listing?" : step === 1 ? "Property Details" : "Media"}
              </DialogTitle>
            </DialogHeader>

            <div className="min-h-[300px]">
              {step === 0 && (
                <ListingTypePicker
                  selectedType={selectedTypeGroup}
                  onSelect={handleTypeSelect}
                />
              )}
          {step === 1 && (
            <ListingDetailsFormSimple
              formData={formData}
              handleChange={handleDataChange}
              listingType={selectedTypeGroup}
              onOpenMap={() => setIsMapStep(true)}
            />
          )}
              {step === 2 && (
                <ListingMediaForm
                  images={images}
                  previews={images.map(img => img.preview)}
                  onImagesChange={handleImagesChange}
                  onRemoveImage={handleRemoveImage}
                  listingType={selectedTypeGroup}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              )}
            </div>

            {step > 0 && (
              <DialogFooter>
                {step === 1 ? (
                  <Button onClick={() => setStep(2)}>Continue to Photos</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Publish
                    </Button>
                  </div>
                )}
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
