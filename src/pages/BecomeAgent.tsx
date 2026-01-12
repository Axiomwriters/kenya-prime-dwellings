import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Briefcase } from "lucide-react";

export default function BecomeAgent() {
    const { user, refreshRole } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        agency_name: "",
        license_number: "",
        bio: "",
        whatsapp_number: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // 1. Create Agent Profile
            const { error: agentError } = await supabase
                .from("agents")
                .insert({
                    id: user.id,
                    agency_name: formData.agency_name,
                    license_number: formData.license_number,
                    bio: formData.bio,
                    whatsapp_number: formData.whatsapp_number,
                });

            if (agentError) throw agentError;

            // 2. Update User Role
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ role: "agent" })
                .eq("id", user.id);

            if (profileError) throw profileError;

            // 3. Refresh Local State
            await refreshRole();

            toast.success("Congratulations! You are now an agent.");
            navigate("/agent");
        } catch (error: any) {
            console.error("Error becoming agent:", error);
            toast.error(error.message || "Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-muted/30 flex items-center justify-center">
            <Card className="max-w-xl w-full">
                <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">Become a Partner Agent</CardTitle>
                    <CardDescription>
                        Join Kenya Prime Dwellings to list properties and reach millions of buyers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="agency_name">Agency Name</Label>
                            <Input
                                id="agency_name"
                                required
                                placeholder="e.g. Nairobi Homes Ltd"
                                value={formData.agency_name}
                                onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="license_number">License / Registration Number</Label>
                            <Input
                                id="license_number"
                                placeholder="Optional"
                                value={formData.license_number}
                                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <Input
                                id="whatsapp"
                                required
                                placeholder="+254 7..."
                                value={formData.whatsapp_number}
                                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Professional Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about your experience..."
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
