import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { Maximize2, PlayCircle, Box, MapPin } from "lucide-react";

interface PropertyHeroGalleryProps {
    images: string[];
    title: string;
    location: string;
    labels?: {
        isNew?: boolean;
        isLuxury?: boolean;
        isForSale?: boolean;
    };
}

export function PropertyHeroGallery({ images, title, location, labels }: PropertyHeroGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialSlide, setInitialSlide] = useState(0);

    // Ensure we have at least 5 images for the grid (fill with duplicates if needed)
    const gridImages = [...images];
    while (gridImages.length < 5) {
        gridImages.push(images[0]); // Fallback
    }

    const openLightbox = (index: number) => {
        setInitialSlide(index);
        setIsOpen(true);
    };

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 h-[500px] gap-2">
                {/* Main Hero Image (Span 2 cols, 2 rows -> 50% width effectively, but 60% visually via col-span-2 if we do 5 cols. Let's do 4 cols: Main is 2x2) */}
                <div
                    className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(0)}
                >
                    <img src={gridImages[0]} alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                </div>

                {/* Smaller Images */}
                <div className="relative cursor-pointer overflow-hidden" onClick={() => openLightbox(1)}>
                    <img src={gridImages[1]} alt="Interior" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="relative cursor-pointer overflow-hidden rounded-tr-2xl" onClick={() => openLightbox(2)}>
                    <img src={gridImages[2]} alt="Bedroom" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="relative cursor-pointer overflow-hidden" onClick={() => openLightbox(3)}>
                    <img src={gridImages[3]} alt="Kitchen" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
                <div className="relative cursor-pointer overflow-hidden rounded-br-2xl" onClick={() => openLightbox(4)}>
                    <img src={gridImages[4]} alt="Details" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    {/* View All Overlay */}
                    {images.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg backdrop-blur-[2px] transition-opacity hover:bg-black/60">
                            +{images.length - 5} Photos
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Swipe Layout (Carousel) */}
            <div className="md:hidden h-[400px]">
                <img src={images[0]} alt={title} className="w-full h-full object-cover" />
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4 shadow-lg"
                    onClick={() => openLightbox(0)}
                >
                    View {images.length} Photos
                </Button>
            </div>

            {/* Floating Chips */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 items-start pointer-events-none">
                {labels?.isForSale && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-3 py-1 text-sm shadow-lg backdrop-blur-md">
                        For Sale
                    </Badge>
                )}
                {labels?.isLuxury && (
                    <Badge className="bg-black/70 hover:bg-black/80 text-white border border-white/20 px-3 py-1 text-sm shadow-lg backdrop-blur-md">
                        Luxury Collection
                    </Badge>
                )}
                {labels?.isNew && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-3 py-1 text-sm shadow-lg backdrop-blur-md">
                        New Construction
                    </Badge>
                )}
            </div>

            {/* Location Overlay */}
            <div className="absolute bottom-6 left-6 text-white pointer-events-none hidden md:block">
                <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium tracking-wide">{location}</span>
                </div>
            </div>

            {/* Action Buttons Overlay (Desktop) */}
            {/* Action Buttons Overlay (Responsive) */}
            <div className="absolute bottom-6 right-6 flex flex-col md:flex-row gap-2 z-10">
                <Button variant="secondary" className="bg-white/90 hover:bg-white text-black backdrop-blur shadow-xl border border-white/20 w-full md:w-auto" onClick={() => openLightbox(0)}>
                    <Maximize2 className="w-4 h-4 mr-2" /> View Photos
                </Button>
                <Button variant="secondary" className="bg-white/90 hover:bg-white text-black backdrop-blur shadow-xl border border-white/20 w-full md:w-auto" onClick={() => { }}>
                    <PlayCircle className="w-4 h-4 mr-2" /> Video Tour
                </Button>
                <Button variant="secondary" className="bg-white/90 hover:bg-white text-black backdrop-blur shadow-xl border border-white/20 w-full md:w-auto" onClick={() => { }}>
                    <Box className="w-4 h-4 mr-2" /> 360° View
                </Button>
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-none">
                    <div className="h-full flex items-center justify-center relative">
                        <Carousel
                            opts={{
                                startIndex: initialSlide,
                                loop: true
                            }}
                            className="w-full h-full"
                        >
                            <CarouselContent className="h-full">
                                {images.map((img, idx) => (
                                    <CarouselItem key={idx} className="h-full flex items-center justify-center pt-4 pb-4">
                                        <img src={img} alt={`Slide ${idx}`} className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-0 h-12 w-12" />
                            <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-0 h-12 w-12" />
                        </Carousel>

                        {/* Close/Counter overlay could go here */}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
