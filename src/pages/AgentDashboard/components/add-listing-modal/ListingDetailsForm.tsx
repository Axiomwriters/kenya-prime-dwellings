import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Sparkles, Map } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface formProps {
    formData: any;
    handleChange: (field: string, value: any) => void;
    listingType: string;
}

export function ListingDetailsForm({ formData, handleChange, listingType }: formProps) {
    const isLand = listingType === 'land';

    return (
        <div className="space-y-6 py-2">

            {/* Title & AI */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Property Title</Label>
                    <Button variant="ghost" size="xs" className="text-purple-600 h-6 gap-1">
                        <Sparkles className="w-3 h-3" /> AI Generate
                    </Button>
                </div>
                <Input
                    placeholder="e.g. Modern 3-Bedroom Apartment"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
            </div>

            {/* Price & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Price (KSh)</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 15000000"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g. Kilimani, Nairobi"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" title="Pin Location">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                                <div className="h-48 bg-muted relative flex items-center justify-center border-b rounded-t-lg overflow-hidden group">
                                    {/* Mock Map Background */}
                                    {/* In a real app, this would be a Google Map/Leaflet */}
                                    <div className="absolute inset-0 bg-stone-100 opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                    <Map className="w-12 h-12 text-muted-foreground/30" />
                                    <div className="absolute inset-0 flex items-center justify-center cursor-crosshair group-hover:bg-black/5 transition-colors">
                                        <span className="text-xs font-semibold bg-white/80 px-2 py-1 rounded shadow-sm">Click to Pin</span>
                                    </div>
                                </div>
                                <div className="p-4 space-y-2">
                                    <h4 className="font-semibold text-sm">Pin Exact Location</h4>
                                    <p className="text-xs text-muted-foreground">Drag the pin to the exact property entrance for better directions.</p>
                                    <Button size="sm" className="w-full" onClick={() => handleChange('pinned', true)}>
                                        Confirm Pin
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Listing Type</Label>
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
                    <Label>Category</Label>
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
                                </>
                            ) : (
                                <>
                                    <SelectItem value="residential_plot">Residential Plot</SelectItem>
                                    <SelectItem value="commercial_land">Commercial Land</SelectItem>
                                    <SelectItem value="agricultural">Agricultural</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Dynamic Specs */}
            {!isLand ? (
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
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Plot Size (Acres/Ha)</Label>
                        <Input placeholder="0.5" value={formData.size} onChange={(e) => handleChange('size', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Zoning</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="res">Residential</SelectItem>
                                <SelectItem value="com">Commercial</SelectItem>
                                <SelectItem value="mix">Mixed Use</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Amenities / Description */}
            <div className="space-y-2">
                <Label>Amenities (comma separated)</Label>
                <Input
                    placeholder={isLand ? "e.g. Water, Electricity, Fenced" : "e.g. Pool, Gym, Parking, Security"}
                    value={formData.amenities}
                    onChange={(e) => handleChange('amenities', e.target.value)}
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
                    placeholder="Describe the property..."
                    className="h-24"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
        </div>
    );
}
