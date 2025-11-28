import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Bed, Bath, Home, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockProperties = [
    {
        id: 1,
        title: "Modern Loft in Westlands",
        location: "Westlands, Nairobi",
        price: 15000,
        status: "Active",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
        beds: 2,
        baths: 2,
        rating: 4.8,
        reviews: 24
    },
    {
        id: 2,
        title: "Cozy Studio near CBD",
        location: "CBD, Nairobi",
        price: 8500,
        status: "Booked",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60",
        beds: 1,
        baths: 1,
        rating: 4.5,
        reviews: 12
    },
    {
        id: 3,
        title: "Luxury Villa in Karen",
        location: "Karen, Nairobi",
        price: 45000,
        status: "Maintenance",
        image: "https://images.unsplash.com/photo-1600596542815-22b8c153bd30?w=800&auto=format&fit=crop&q=60",
        beds: 5,
        baths: 4,
        rating: 5.0,
        reviews: 8
    }
];

export default function Properties() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProperties = mockProperties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-muted-foreground">Manage your listings, pricing, and availability.</p>
                </div>
                <Button asChild>
                    <Link to="new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Property
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search properties..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Add more filters here if needed */}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden group">
                        <div className="aspect-video relative overflow-hidden">
                            <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-2 right-2">
                                <Badge variant={
                                    property.status === "Active" ? "default" :
                                        property.status === "Booked" ? "secondary" : "destructive"
                                }>
                                    {property.status}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="line-clamp-1 text-lg">{property.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                {property.location}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.beds}</span>
                                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.baths}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground">★ {property.rating}</span>
                                    <span>({property.reviews})</span>
                                </div>
                            </div>
                            <div className="text-lg font-bold">
                                KSh {property.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ night</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link to={`edit/${property.id}`}>Manage</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Home className="w-4 h-4 mr-2" /> View Listing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="w-4 h-4 mr-2" /> Deactivate
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
