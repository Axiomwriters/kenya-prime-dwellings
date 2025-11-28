import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Heart,
    Loader2,
    MapPin,
    Bed,
    Bath,
    Square,
    Trash2,
    Search,
    Home,
    ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SavedProperty {
    id: string;
    property_id: string;
    saved_at: string;
    property: {
        id: string;
        title: string;
        price: number;
        location: string;
        bedrooms: number;
        bathrooms: number;
        area: number;
        status: string;
        image_url: string;
        property_type: string;
    };
}

export default function SavedProperties() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("recent");

    useEffect(() => {
        if (user) {
            fetchSavedProperties();
        }
    }, [user]);

    const fetchSavedProperties = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('saved_properties')
                .select(`
          id,
          property_id,
          created_at,
          properties (
            id,
            title,
            price,
            location,
            bedrooms,
            bathrooms,
            area,
            status,
            image_url,
            property_type
          )
        `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData = data?.map(item => ({
                id: item.id,
                property_id: item.property_id,
                saved_at: item.created_at,
                property: item.properties as any
            })) || [];

            setSavedProperties(formattedData);
        } catch (error: any) {
            console.error('Error fetching saved properties:', error);
            toast.error("Failed to load saved properties");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSaved = async (savedPropertyId: string) => {
        try {
            const { error } = await supabase
                .from('saved_properties')
                .delete()
                .eq('id', savedPropertyId);

            if (error) throw error;

            setSavedProperties(prev => prev.filter(sp => sp.id !== savedPropertyId));
            toast.success("Property removed from saved list");
        } catch (error: any) {
            console.error('Error removing saved property:', error);
            toast.error("Failed to remove property");
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getFilteredAndSortedProperties = () => {
        let filtered = [...savedProperties];

        // Filter
        if (filter !== "all") {
            filtered = filtered.filter(sp => sp.property?.status === filter);
        }

        // Sort
        if (sort === "recent") {
            filtered.sort((a, b) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime());
        } else if (sort === "price-low") {
            filtered.sort((a, b) => (a.property?.price || 0) - (b.property?.price || 0));
        } else if (sort === "price-high") {
            filtered.sort((a, b) => (b.property?.price || 0) - (a.property?.price || 0));
        }

        return filtered;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const displayedProperties = getFilteredAndSortedProperties();

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4 hover:bg-primary/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                                <Heart className="w-8 h-8 text-primary fill-primary" />
                                Saved Properties
                            </h1>
                            <p className="text-muted-foreground">
                                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
                            </p>
                        </div>

                        {/* Filters and Sort */}
                        {savedProperties.length > 0 && (
                            <div className="flex gap-3 flex-wrap">
                                <Select value={filter} onValueChange={setFilter}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Properties</SelectItem>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="sold">Sold</SelectItem>
                                        <SelectItem value="rented">Rented</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sort} onValueChange={setSort}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {savedProperties.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <Heart className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">No Saved Properties Yet</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                Start saving properties you're interested in. Click the heart icon on any property to add it to your saved list.
                            </p>
                            <Button onClick={() => navigate('/properties')} size="lg">
                                <Search className="w-4 h-4 mr-2" />
                                Browse Properties
                            </Button>
                        </CardContent>
                    </Card>
                ) : displayedProperties.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Search className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No properties match your filter</h3>
                            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                            <Button variant="outline" onClick={() => setFilter("all")}>
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* Properties Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProperties.map((savedProperty) => {
                            const property = savedProperty.property;
                            if (!property) return null;

                            return (
                                <Card
                                    key={savedProperty.id}
                                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                >
                                    {/* Image */}
                                    <div
                                        className="relative aspect-video overflow-hidden"
                                        onClick={() => navigate(`/properties/${property.id}`)}
                                    >
                                        {property.image_url ? (
                                            <img
                                                src={property.image_url}
                                                alt={property.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Home className="w-16 h-16 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <Badge
                                            className="absolute top-3 left-3"
                                            variant={property.status === 'available' ? 'default' : 'secondary'}
                                        >
                                            {property.status}
                                        </Badge>

                                        {/* Remove Button */}
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveSaved(savedProperty.id);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Content */}
                                    <CardContent
                                        className="p-4 space-y-3"
                                        onClick={() => navigate(`/properties/${property.id}`)}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                                {property.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <MapPin className="w-4 h-4" />
                                                {property.location}
                                            </div>
                                        </div>

                                        <div className="text-2xl font-bold text-primary">
                                            {formatPrice(property.price)}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {property.bedrooms !== undefined && (
                                                <div className="flex items-center gap-1">
                                                    <Bed className="w-4 h-4" />
                                                    {property.bedrooms}
                                                </div>
                                            )}
                                            {property.bathrooms !== undefined && (
                                                <div className="flex items-center gap-1">
                                                    <Bath className="w-4 h-4" />
                                                    {property.bathrooms}
                                                </div>
                                            )}
                                            {property.area && (
                                                <div className="flex items-center gap-1">
                                                    <Square className="w-4 h-4" />
                                                    {property.area} m²
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t">
                                            <p className="text-xs text-muted-foreground">
                                                Saved {new Date(savedProperty.saved_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
