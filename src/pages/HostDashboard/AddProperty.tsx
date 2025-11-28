import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Plus, X } from "lucide-react";

export default function AddProperty() {
    const [images, setImages] = useState<string[]>([]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setImages([...images, url]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
                <p className="text-muted-foreground">Create a new listing for your short-stay rental.</p>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & Rules</TabsTrigger>
                </TabsList>

                {/* DETAILS TAB */}
                <TabsContent value="details" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                            <CardDescription>Basic information about your place.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Listing Title</Label>
                                <Input id="title" placeholder="e.g. Modern Loft in Westlands" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Property Type</Label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                        <option>Apartment</option>
                                        <option>House</option>
                                        <option>Villa</option>
                                        <option>Guest House</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests">Max Guests</Label>
                                    <Input id="guests" type="number" min="1" placeholder="2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beds">Bedrooms</Label>
                                    <Input id="beds" type="number" min="0" placeholder="1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="baths">Bathrooms</Label>
                                    <Input id="baths" type="number" min="0" placeholder="1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size">Size (sqm)</Label>
                                    <Input id="size" type="number" min="0" placeholder="50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Describe your property..." className="h-32" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input id="address" placeholder="Street name, Building, Floor..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* AMENITIES TAB */}
                <TabsContent value="amenities" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                            <CardDescription>What does your place offer?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {["WiFi", "Kitchen", "Washer", "Dryer", "Air conditioning", "Heating", "Dedicated workspace", "TV", "Hair dryer", "Iron", "Pool", "Hot tub", "Free parking", "EV charger", "Gym", "BBQ grill", "Breakfast", "Indoor fireplace", "Smoking allowed"].map((amenity) => (
                                    <div key={amenity} className="flex items-center space-x-2">
                                        <Checkbox id={amenity} />
                                        <Label htmlFor={amenity}>{amenity}</Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PHOTOS TAB */}
                <TabsContent value="photos" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Photos</CardTitle>
                            <CardDescription>Add high-quality photos to attract guests.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <img src={img} alt="Upload" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors bg-muted/50 hover:bg-muted">
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Upload Photo</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PRICING & RULES TAB */}
                <TabsContent value="pricing" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                            <CardDescription>Set your rates and fees.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Nightly Price (KSh)</Label>
                                    <Input id="price" type="number" placeholder="5000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weekend">Weekend Price (KSh)</Label>
                                    <Input id="weekend" type="number" placeholder="6000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cleaning">Cleaning Fee</Label>
                                    <Input id="cleaning" type="number" placeholder="1000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deposit">Security Deposit</Label>
                                    <Input id="deposit" type="number" placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="extra">Extra Guest Fee</Label>
                                    <Input id="extra" type="number" placeholder="500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>House Rules & Policies</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="checkin">Check-in Time</Label>
                                    <Input id="checkin" type="time" defaultValue="14:00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkout">Check-out Time</Label>
                                    <Input id="checkout" type="time" defaultValue="11:00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rules">Additional Rules</Label>
                                <Textarea id="rules" placeholder="No parties, no pets, etc." />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline">Save as Draft</Button>
                        <Button>Publish Listing</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
