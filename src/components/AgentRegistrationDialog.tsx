import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/utils/uploadHelpers";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/FileUpload";
import { KENYAN_COUNTIES } from "@/data/counties";
import {
  CheckCircle,
  Info,
  ArrowRight,
  Shield,
  Send,
  Loader2,
  Upload,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentRegistrationDialog({
  open,
  onOpenChange,
}: AgentRegistrationDialogProps) {
  const { user, refreshRole } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idFrontUrl, setIdFrontUrl] = useState("");
  const [idBackUrl, setIdBackUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleIdFrontUpload = (file: File, url: string) => {
    setIdFrontFile(file);
    setIdFrontUrl(url);
  };

  const handleIdBackUpload = (file: File, url: string) => {
    setIdBackFile(file);
    setIdBackUrl(url);
  };

  const handleSubmitApplication = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // 1. Upload avatar if provided
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        const avatarPath = `${user.id}/avatar-${Date.now()}.jpg`;
        const { url: uploadedAvatarUrl, error: avatarError } = await uploadFile(
          "avatars",
          avatarPath,
          avatarFile
        );
        
        if (uploadedAvatarUrl && !avatarError) {
          finalAvatarUrl = uploadedAvatarUrl;
        }
      }

      // 2. Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          whatsapp,
          county,
          city,
          bio,
          avatar_url: finalAvatarUrl || null,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 3. Upload ID documents
      const idFrontPath = `${user.id}/id-front-${Date.now()}.jpg`;
      const idBackPath = `${user.id}/id-back-${Date.now()}.jpg`;

      const { url: frontUrl, error: frontError } = await uploadFile("id-documents", idFrontPath, idFrontFile!);
      if (frontError || !frontUrl) throw new Error("Failed to upload front ID");

      const { url: backUrl, error: backError } = await uploadFile("id-documents", idBackPath, idBackFile!);
      if (backError || !backUrl) throw new Error("Failed to upload back ID");

      // 4. Create verification record (status: pending, admin will approve)
      const { error: verificationError } = await supabase
        .from("agent_verifications")
        .insert([{
          user_id: user.id,
          id_front_url: frontUrl,
          id_back_url: backUrl,
          status: "pending",
        }]);

      if (verificationError) throw verificationError;

      // Agent role will be assigned by admin upon approval
      await refreshRole();

      toast.success("Application submitted! Awaiting admin approval...");
      onOpenChange(false);

      // Redirect to home
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFullName("");
    setPhone("");
    setWhatsapp("");
    setCounty("");
    setCity("");
    setBio("");
    setIdFrontFile(null);
    setIdBackFile(null);
    setIdFrontUrl("");
    setIdBackUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 pt-2">
          {[1, 2, 3, 4].map((stepNumber, index) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${step >= stepNumber 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {stepNumber}
              </div>
              {index < 3 && (
                <div className={`
                  w-12 h-1 mx-1 rounded transition-all
                  ${step > stepNumber ? 'bg-primary' : 'bg-muted'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        {/* Step 1: Welcome */}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Become an Agent</DialogTitle>
              <DialogDescription>
                Join our network of trusted real estate agents
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-semibold text-lg">Requirements:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Valid National ID</p>
                      <p className="text-sm text-muted-foreground">
                        Upload front and back photos
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Complete Profile</p>
                      <p className="text-sm text-muted-foreground">
                        Provide contact info and location
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Verification Review</p>
                      <p className="text-sm text-muted-foreground">
                        Wait 24-48 hours for approval
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-500 mb-1">
                      Why become an agent?
                    </p>
                    <p className="text-muted-foreground">
                      List unlimited properties, reach thousands of buyers, and
                      grow your real estate business on KenyaHomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setStep(2)} className="bg-primary w-full">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: Profile Information */}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Profile Information</DialogTitle>
              <DialogDescription>
                Tell us about yourself and your experience
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {fullName?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <input
                    type="file"
                    id="avatar-upload-agent"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("avatar-upload-agent")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Profile Picture
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or WEBP. Max 5MB
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <Label>Full Name / Agency Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>County</Label>
                  <Select value={county} onValueChange={setCounty}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {KENYAN_COUNTIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City / Town</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>
                  Bio / Description
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Textarea
                  value={bio}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setBio(newValue);
                    
                    // Auto-proceed when reaching max length (300 chars)
                    if (newValue.length === 300) {
                      // Check if all required fields are filled
                      if (fullName && phone && whatsapp && county && city) {
                        setTimeout(() => setStep(3), 500);
                      }
                    }
                  }}
                  placeholder="Tell us about your experience in real estate..."
                  rows={4}
                  maxLength={300}
                  className={`glass-input resize-none border-2 transition-colors ${
                    bio.length >= 250 
                      ? 'border-green-500/50 focus:border-green-500' 
                      : bio.length > 0 
                        ? 'border-destructive/50 focus:border-destructive' 
                        : ''
                  }`}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    {bio.length < 250 ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <p className="text-sm font-medium text-destructive">
                          Minimum 250 characters required ({250 - bio.length} more)
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <p className="text-sm font-medium text-green-500">
                          Great! ✓
                        </p>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {bio.length}/300
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block">
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!fullName || !phone || !whatsapp || !county || !city || bio.length < 250}
                        className="bg-primary"
                      >
                        Next: Upload Documents
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {(!fullName || !phone || !whatsapp || !county || !city || bio.length < 250) && (
                    <TooltipContent>
                      <p className="font-medium">Please complete all required fields:</p>
                      <ul className="text-xs mt-1 space-y-1">
                        {!fullName && <li>• Full Name</li>}
                        {!phone && <li>• Phone Number</li>}
                        {!whatsapp && <li>• WhatsApp Number</li>}
                        {!county && <li>• County</li>}
                        {!city && <li>• City/Town</li>}
                        {bio.length < 250 && <li>• Bio (need {250 - bio.length} more characters)</li>}
                      </ul>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </DialogFooter>
          </>
        )}

        {/* Step 3: ID Upload */}
        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle>ID Document Upload</DialogTitle>
              <DialogDescription>
                Upload clear photos of your national ID
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <Shield className="w-4 h-4 text-yellow-500" />
                <AlertTitle>Document Security</AlertTitle>
                <AlertDescription>
                  Your documents are encrypted and only visible to admin
                  reviewers. We never share your personal information.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>National ID (Front)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIdFrontFile(file);
                      setIdFrontUrl(URL.createObjectURL(file));
                    }
                  }} />
                </div>

                <div>
                  <Label>National ID (Back)</Label>
                  <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIdBackFile(file);
                      setIdBackUrl(URL.createObjectURL(file));
                    }
                  }} />
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium">Document Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Upload clear, readable photos</li>
                  <li>Ensure all text is visible</li>
                  <li>Supported formats: JPG, PNG, PDF</li>
                  <li>Maximum file size: 10MB per document</li>
                </ul>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!idFrontUrl || !idBackUrl}
                className="bg-primary"
              >
                Review Application
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <DialogHeader>
              <DialogTitle>Review & Submit</DialogTitle>
              <DialogDescription>
                Please review your information before submitting
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-semibold">Application Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-medium">{fullName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{phone}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="font-medium">{whatsapp}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">
                      {city}, {county}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Documents:</span>
                    <div className="text-right">
                      <p className="font-medium">✓ ID Front Uploaded</p>
                      <p className="font-medium">✓ ID Back Uploaded</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <AlertTitle>Ready to Submit</AlertTitle>
                <AlertDescription>
                  Your application will be reviewed within 24-48 hours. You'll
                  receive a notification once approved.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="bg-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
