import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Heart, MessageCircle, BarChart3, Zap, Sparkles, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListingCommandItemProps {
    listing: any;
}

export function ListingCommandItem({ listing }: ListingCommandItemProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Ensure images array exists and has at least one image
    const images = listing.images && listing.images.length > 0 ? listing.images : ['/placeholder.svg'];

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Mock metrics for command center visualization (or use listing data if available)
    const metrics = {
        views_7d: listing.views || Math.floor(Math.random() * 500) + 50,
        saves: listing.saves || Math.floor(Math.random() * 50),
        inquiries: listing.inquiries || Math.floor(Math.random() * 10),
        health_score: listing.health_score || Math.floor(Math.random() * 100),
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                <img
                    src={images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Carousel Controls */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        {/* Dots Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                                        idx === currentImageIndex ? "bg-white scale-110" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-0 text-xs font-semibold">
                        {listing.status || 'Active'}
                    </Badge>
                </div>

                {/* Overlay Action Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 border-0">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Zap className="w-4 h-4 mr-2 text-yellow-500" /> Boost Listing</DropdownMenuItem>
                            <DropdownMenuItem><Sparkles className="w-4 h-4 mr-2 text-primary" /> AI Optimize</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                            <DropdownMenuItem>View Performance</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1" title={listing.title}>{listing.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                            <BarChart3 className={cn("w-4 h-4", getHealthColor(metrics.health_score))} />
                            <span className={cn("text-xs font-bold", getHealthColor(metrics.health_score))}>
                                {metrics.health_score}
                            </span>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm truncate">{listing.location}</p>

                    {/* Badges/Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                            {listing.category || 'House'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {listing.listing_type || 'Sale'}
                        </Badge>
                        {/* AI Insight Chip */}
                        {metrics.health_score < 60 && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Improve
                            </Badge>
                        )}
                        {metrics.health_score > 85 && (
                            <Badge className="text-xs bg-gradient-to-r from-pink-500 to-violet-500 border-0 text-white">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Top
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Metrics Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{metrics.views_7d}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Saves">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{metrics.saves}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Inquiries">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{metrics.inquiries}</span>
                        </div>
                    </div>
                    <div className="font-semibold text-foreground">
                        {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(listing.price)}
                    </div>
                </div>
            </div>
        </div>
    );
}
