import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { MapPicker } from "@/components/ui/map-picker";

interface formProps {
    formData: any;
    handleChange: (field: string, value: any) => void;
    listingType: string;
}

const HOUSE_AMENITIES = [
    "Parking", "Garden", "Pool", "Gym", "Security", "CCTV", "Backup Generator", 
    "Borehole", "Water Tank", "Solar Panels", "Air Conditioning", "Fireplace",
    "Balcony", "Terrace", "Servant Quarters", "Guest House", "Electric Fence",
    "Intercom", "Lift", "Roof Terrace", "Dishwasher", "Microwave", "Fridge"
];

const LAND_AMENITIES = [
    "Water", "Electricity", "Perimeter Wall", "Fenced", "Gated Community", 
    "Surveyed", "Title Deed", "Paved Access", "Drilled Well", "River Frontage",
    "Mountain View", "Commercial Zoning", "Residential Zoning"
];

export function ListingDetailsForm({ formData, handleChange, listingType }: formProps) {
    const [mapOpen, setMapOpen] = useState(false);
    const isLand = listingType === 'land';
    const amenities = isLand ? LAND_AMENITIES : HOUSE_AMENITIES;
    const selectedAmenities = formData.amenities || [];

    const toggleAmenity = (amenity: string) => {
        const current = selectedAmenities;
        if (current.includes(amenity)) {
            handleChange('amenities', current.filter((a: string) => a !== amenity));
        } else {
            handleChange('amenities', [...current, amenity]);
        }
    };

    return (
        <>
        <div className="space-y-6 py-2">

            {/* Title */}
            <div className="space-y-2">
                <Label>Property Title *</Label>
                <Input
                    placeholder="e.g. Modern 3-Bedroom Apartment in Kilimani"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>

            {/* Price & Location */}
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
                        />
                        <Button 
                            variant="outline" 
                            size="icon" 
                            title="Pin Location" 
                            type="button" 
                            onClick={() => setMapOpen(true)}
                            className={formData.pinned ? "border-green-500 text-green-600" : ""}
                        >
                            <MapPin className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Area / Neighborhood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Area / Neighborhood</Label>
                    <Input
                        placeholder="e.g. near UN Headquarter"
                        value={formData.area}
                        onChange={(e) => handleChange('area', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Year Built</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 2020"
                        value={formData.year_built}
                        onChange={(e) => handleChange('year_built', e.target.value)}
                    />
                </div>
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Listing Type *</Label>
                    <Select value={formData.listing_type} onValueChange={(val) => handleChange('listing_type', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                            {isLand && <SelectItem value="lease">Lease</SelectItem>}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {!isLand ? (
                                <>
                                    <SelectItem value="house">House</SelectItem>
                                    <SelectItem value="apartment">Apartment</SelectItem>
                                    <SelectItem value="villa">Villa</SelectItem>
                                    <SelectItem value="bungalow">Bungalow</SelectItem>
                                    <SelectItem value="townhouse">Townhouse</SelectItem>
                                    <SelectItem value="cottage">Cottage</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value="residential_plot">Residential Plot</SelectItem>
                                    <SelectItem value="commercial_land">Commercial Land</SelectItem>
                                    <SelectItem value="agricultural">Agricultural</SelectItem>
                                    <SelectItem value="industrial">Industrial</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Dynamic Specs */}
            {!isLand ? (
                <>
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

                    {/* Additional fields for buildings */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Floor</Label>
                            <Input placeholder="e.g. 3" value={formData.floor} onChange={(e) => handleChange('floor', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Unit Number</Label>
                            <Input placeholder="e.g. A12" value={formData.unit_number} onChange={(e) => handleChange('unit_number', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Furnishing</Label>
                            <Select value={formData.furnishing} onValueChange={(val) => handleChange('furnishing', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                                    <SelectItem value="furnished">Furnished</SelectItem>
                                    <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Parking</Label>
                            <Select value={formData.parking} onValueChange={(val) => handleChange('parking', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="1">1 Car</SelectItem>
                                    <SelectItem value="2">2 Cars</SelectItem>
                                    <SelectItem value="3">3+ Cars</SelectItem>
                                    <SelectItem value="covered">Covered</SelectItem>
                                    <SelectItem value="garage">Garage</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Pets */}
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            id="pets" 
                            checked={formData.pets_allowed}
                            onCheckedChange={(checked) => handleChange('pets_allowed', checked)}
                        />
                        <Label htmlFor="pets" className="text-sm cursor-pointer">Pets Allowed</Label>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Plot Size (Acres)</Label>
                        <Input placeholder="0.5" value={formData.size} onChange={(e) => handleChange('size', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zoning</Label>
                        <Select value={formData.zoning} onValueChange={(val) => handleChange('zoning', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="agricultural">Agricultural</SelectItem>
                                <SelectItem value="mixed">Mixed Use</SelectItem>
                                <SelectItem value="industrial">Industrial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Amenities - Multi-select chips */}
            <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity: string) => (
                        <Button
                            key={amenity}
                            variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                            size="sm"
                            className="h-8"
                            onClick={() => toggleAmenity(amenity)}
                        >
                            {selectedAmenities.includes(amenity) && <Check className="w-3 h-3 mr-1" />}
                            {amenity}
                        </Button>
                    ))}
                </div>
                {selectedAmenities.length > 0 && (
                    <p className="text-xs text-muted-foreground">{selectedAmenities.length} amenities selected</p>
                )}
            </div>

            {/* Video URL */}
            <div className="space-y-2">
                <Label>Video Tour / Virtual Tour URL</Label>
                <Input
                    placeholder="e.g. https://youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) => handleChange('video_url', e.target.value)}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Description</Label>
                    <Button variant="ghost" size="sm" className="text-purple-600 h-6 gap-1 text-xs">
                        <Sparkles className="w-3 h-3" /> AI Enhance
                    </Button>
                </div>
                <Textarea
                    placeholder="Describe the property, neighborhood, nearby facilities..."
                    className="h-24"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
        </div>

        <Dialog open={mapOpen} onOpenChange={setMapOpen}>
            <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle>Pin Exact Location</DialogTitle>
                </DialogHeader>
                <div className="p-4 pt-0">
                    <MapPicker 
                        lat={formData.latitude || -1.2921} 
                        lng={formData.longitude || 36.8219}
                        autoLocate={true}
                        onLocationChange={(lat, lng) => {
                            handleChange('latitude', lat);
                            handleChange('longitude', lng);
                            handleChange('pinned', true);
                        }}
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                        {formData.latitude && formData.longitude 
                            ? `Selected: ${formData.latitude.toFixed(5)}, ${formData.longitude.toFixed(5)}`
                            : "Click on the map to pin the location"}
                    </p>
                </div>
                <div className="p-4 pt-2 flex justify-end">
                    <Button onClick={() => setMapOpen(false)}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
