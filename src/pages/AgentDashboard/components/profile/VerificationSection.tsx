import { FileUpload } from "@/components/FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Shield, User, MapPin, AlertCircle, Clock, CheckCircle } from "lucide-react";

interface VerificationSectionProps {
    identity: 'individual' | 'agency';
    verification: any;
    onUpload: (file: File, type: string) => Promise<string | null>;
    onSubmit: () => void;
    formState: any;
    onFormChange: (field: string, value: any) => void;
}

export function VerificationSection({
    identity,
    verification,
    onUpload,
    onSubmit,
    formState,
    onFormChange
}: VerificationSectionProps) {
    const isApproved = verification.status === 'approved';
    // Check if all required docs are present based on identity
    const isReadyToSubmit = identity === 'individual'
        ? (verification.id_front_url && verification.id_back_url && verification.selfie_url)
        : (verification.cert_url && verification.kra_pin && formState.agency_name);

    return (
        <Card className="border-t-4 border-t-primary shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {identity === 'agency' ? <Building2 className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
                        {identity === 'agency' ? 'Agency Verification' : 'Identity Verification'}
                    </CardTitle>
                    <Badge variant={isApproved ? "default" : "outline"} className={isApproved ? "bg-green-100 text-green-700" : ""}>
                        {verification.status ? verification.status.toUpperCase() : 'NOT VERIFIED'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Status Alerts */}
                {verification.status === 'pending' && (
                    <Alert className="bg-yellow-500/10 border-yellow-500/50">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <AlertTitle>Under Review</AlertTitle>
                        <AlertDescription>Your documents are being reviewed. Expected time: 24h.</AlertDescription>
                    </Alert>
                )}

                {/* Identity Specific Fields */}
                {identity === 'individual' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FileUpload
                                label="National ID (Front) ✅"
                                accept="image/*"
                                maxSize={5}
                                onUpload={(f) => onUpload(f, 'id_front')}
                                preview={verification.id_front_url}
                                disabled={isApproved}
                            />
                            <FileUpload
                                label="National ID (Back) ✅"
                                accept="image/*"
                                maxSize={5}
                                onUpload={(f) => onUpload(f, 'id_back')}
                                preview={verification.id_back_url}
                                disabled={isApproved}
                            />
                        </div>
                        <div className="md:w-1/2">
                            <FileUpload
                                label="Selfie with ID (Anti-fraud)"
                                accept="image/*"
                                maxSize={5}
                                onUpload={(f) => onUpload(f, 'selfie')}
                                preview={verification.selfie_url}
                                disabled={isApproved}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Registered Agency Name</Label>
                                <Input
                                    placeholder="e.g. Kamau Properties Ltd"
                                    value={formState.agency_name || ''}
                                    onChange={(e) => onFormChange('agency_name', e.target.value)}
                                    disabled={isApproved}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Registration Number / ID</Label>
                                <Input
                                    placeholder="e.g. CPR/2023/..."
                                    value={formState.reg_number || ''}
                                    onChange={(e) => onFormChange('reg_number', e.target.value)}
                                    disabled={isApproved}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>KRA PIN (Agency)</Label>
                                <Input
                                    placeholder="P05..."
                                    value={formState.kra_pin || ''}
                                    onChange={(e) => onFormChange('kra_pin', e.target.value)}
                                    disabled={isApproved}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Office Phone</Label>
                                <Input
                                    placeholder="+254 700 000 000"
                                    value={formState.office_phone || ''}
                                    onChange={(e) => onFormChange('office_phone', e.target.value)}
                                    disabled={isApproved}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FileUpload
                                label="Certificate of Incorporation"
                                accept=".pdf,image/*"
                                maxSize={10}
                                onUpload={(f) => onUpload(f, 'cert_incorp')}
                                preview={verification.cert_url}
                                disabled={isApproved}
                            />
                            <FileUpload
                                label="Agency Logo (Brand Asset)"
                                accept="image/*"
                                maxSize={5}
                                onUpload={(f) => onUpload(f, 'brand_logo')}
                                preview={verification.brand_logo_url}
                                disabled={isApproved}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Physical Office Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="e.g. Westlands Commercial Center, 4th Floor"
                                    value={formState.office_address || ''}
                                    onChange={(e) => onFormChange('office_address', e.target.value)}
                                    disabled={isApproved}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {!isApproved && verification.status !== 'pending' && (
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={onSubmit}
                        disabled={!isReadyToSubmit}
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Submit Verification Documents
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
