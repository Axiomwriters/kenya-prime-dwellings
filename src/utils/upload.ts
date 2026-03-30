import { supabase } from "@/integrations/supabase/client";

export const uploadPropertyImage = async (file: File): Promise<string> => {
    // Generate unique filename with timestamp to avoid collisions
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${randomId}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    // For Supabase Storage, we upload as-is to preserve quality
    // The storage handles serving optimized images via transformation URLs
    const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: getContentType(fileExt)
        });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

    // Return the public URL - Supabase can serve optimized versions via URL transformations
    // Format: https://xxx.supabase.co/storage/v1/object/public/property-images/xxx?width=xxx&quality=80
    return data.publicUrl;
};

function getContentType(ext: string): string {
    const types: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'gif': 'image/gif'
    };
    return types[ext] || 'image/jpeg';
}

// Helper function to get optimized image URL with transformations
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
    if (!url) return '/placeholder.svg';
    
    // Supabase Storage transformation URL format
    const params: string[] = [];
    
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);
    // Use high quality (90) for crisp photos
    params.push('quality=90');
    
    if (params.length === 0) return url;
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.join('&')}`;
};
