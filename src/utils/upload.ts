import { supabase } from "@/integrations/supabase/client";

export const uploadPropertyImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
};
