import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockProperties } from "@/data/mockListings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { pipeline } from "@xenova/transformers";

export default function HydrateData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addToLog = (msg: string) => setLog(prev => [...prev, msg]);

  const handleHydrate = async () => {
    if (!user) {
      toast.error("You must be logged in to hydrate data");
      return;
    }

    setLoading(true);
    addToLog("Starting hydration...");

    try {
      // 0. Load AI Model
      addToLog("Loading AI Model (this may take a moment)...");
      const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

      // 1. Ensure user is an agent
      addToLog(`Using current user as agent...`);

      const { data: agentData } = await supabase
        .from('agents')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (!agentData) {
        addToLog("User is not an agent. Creating agent profile...");
        const { error: createError } = await supabase
          .from('agents')
          .insert({
            id: user.id,
            agency_name: "Mock Agency",
            whatsapp_number: "+254700000000",
            bio: "System generated agent for mock data."
          });
        if (createError) throw createError;
        addToLog("Agent profile created.");
      }

      // 2. Upload Properties
      let count = 0;
      for (const prop of mockProperties) {
        addToLog(`Processing: ${prop.title}...`);
        
        // Generate Embedding
        const output = await extractor(prop.description, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);

        let dbType = 'For Sale';
        if (prop.listing_type === 'rent') dbType = 'For Rent';
        if (prop.listing_type === 'short_stay') dbType = 'Short Stay';

        const { error } = await supabase.from('properties').insert({
          agent_id: user.id,
          title: prop.title,
          description: prop.description,
          price: prop.price,
          location: prop.location,
          image_url: typeof prop.image === 'string' ? prop.image : 'https://images.unsplash.com/photo-1600596542815-6ad4c727dd2d',
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          sqm: 0,
          land_size: prop.land_size,
          type: dbType,
          property_type: prop.category,
          status: 'available',
          is_high_growth: false,
          embedding: embedding
        });

        if (error) {
            console.error(error);
            addToLog(`Failed to upload ${prop.title}: ${error.message}`);
        } else {
            count++;
        }
      }

      addToLog(`Success! uploaded ${count} properties with AI embeddings.`);
      toast.success(`Hydrated ${count} properties`);

    } catch (e: any) {
      console.error(e);
      addToLog(`Error: ${e.message}`);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Data Hydration Utility</h1>
      <p className="text-muted-foreground">
        Uploads {mockProperties.length} mock listings to Supabase, assigned to YOU.
        <br />
        <span className="text-primary font-medium">Includes Vector Embeddings generation!</span>
      </p>
      
      <div className="bg-black/10 p-4 rounded h-96 overflow-y-auto font-mono text-xs">
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <Button onClick={handleHydrate} disabled={loading}>
        {loading ? "Hydrating (AI Models Loading...)" : "Run Hydration"}
      </Button>
    </div>
  );
}
