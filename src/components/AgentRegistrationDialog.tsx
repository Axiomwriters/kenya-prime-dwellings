import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile, compressImage } from "@/utils/uploadHelpers";
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
  ArrowLeft,
  Shield,
  Send,
  Loader2,
  Upload,
  AlertCircle,
  User,
  Building2,
  Briefcase,
  FileText,
  Camera,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AgentRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type IdentityType = "individual" | "agency";

const TOTAL_STEPS = 6;

export function AgentRegistrationDialog({
  open,
  onOpenChange,
}: AgentRegistrationDialogProps) {
  const { user, refreshRole } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [identityType, setIdentityType] = useState<IdentityType>("individual");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    county: "",
    city: "",
    bio: "",
    licenseNumber: "",
    agencyName: "",
    agencyRegNumber: "",
    kraPin: "",
    agencyPhone: "",
    agencyAddress: "",
  });

  const [documents, setDocuments] = useState({
    avatarFile: null as File | null,
    avatarUrl: "",
    licenseDocFile: null as File | null,
    licenseDocUrl: "",
    idFrontFile: null as File | null,
    idFrontUrl: "",
    idBackFile: null as File | null,
    idBackUrl: "",
    selfieFile: null as File | null,
    selfieUrl: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (file: File, url: string) => {
    try {
      const compressedFile = await compressImage(file, true);
      setDocuments((prev) => ({ ...prev, avatarFile: compressedFile, avatarUrl: url }));
    } catch (error) {
      console.error("Failed to compress avatar:", error);
      setDocuments((prev) => ({ ...prev, avatarFile: file, avatarUrl: url }));
    }
  };

  const handleLicenseDocUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;
    try {
      const compressedFile = await compressImage(file, false);
      const path = `${user.id}/license-${Date.now()}.jpg`;
      const { url } = await uploadFile("agent-documents", path, compressedFile);
      if (url) {
        setDocuments((prev) => ({ ...prev, licenseDocFile: compressedFile, licenseDocUrl: url }));
      }
      return url;
    } catch (error) {
      console.error("Failed to compress license doc:", error);
      const path = `${user.id}/license-${Date.now()}.jpg`;
      const { url } = await uploadFile("agent-documents", path, file);
      if (url) {
        setDocuments((prev) => ({ ...prev, licenseDocFile: file, licenseDocUrl: url }));
      }
      return url;
    }
  };

  const handleIdFrontUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;
    try {
      const compressedFile = await compressImage(file, false);
      const path = `${user.id}/id-front-${Date.now()}.jpg`;
      const { url } = await uploadFile("id-documents", path, compressedFile);
      if (url) {
        setDocuments((prev) => ({ ...prev, idFrontFile: compressedFile, idFrontUrl: url }));
      }
      return url;
    } catch (error) {
      console.error("Failed to compress ID front:", error);
      const path = `${user.id}/id-front-${Date.now()}.jpg`;
      const { url } = await uploadFile("id-documents", path, file);
      if (url) {
        setDocuments((prev) => ({ ...prev, idFrontFile: file, idFrontUrl: url }));
      }
      return url;
    }
  };

  const handleIdBackUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;
    try {
      const compressedFile = await compressImage(file, false);
      const path = `${user.id}/id-back-${Date.now()}.jpg`;
      const { url } = await uploadFile("id-documents", path, compressedFile);
      if (url) {
        setDocuments((prev) => ({ ...prev, idBackFile: compressedFile, idBackUrl: url }));
      }
      return url;
    } catch (error) {
      console.error("Failed to compress ID back:", error);
      const path = `${user.id}/id-back-${Date.now()}.jpg`;
      const { url } = await uploadFile("id-documents", path, file);
      if (url) {
        setDocuments((prev) => ({ ...prev, idBackFile: file, idBackUrl: url }));
      }
      return url;
    }
  };

  const handleSelfieUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;
    try {
      const compressedFile = await compressImage(file, true);
      const path = `${user.id}/selfie-${Date.now()}.jpg`;
      const { url } = await uploadFile("id-documents", path, compressedFile);
      if (url) {
        setDocuments((prev) => ({ ...prev, selfieFile: compressedFile, selfieUrl: url }));
      }
      return url;
    } catch (error) {
      console.error("Failed to compress selfie:", error);
      const path = `${user.id}/selfie-${Date.now()}.jpg`;
      const { url } = await uploadFile("id-documents", path, file);
      if (url) {
        setDocuments((prev) => ({ ...prev, selfieFile: file, selfieUrl: url }));
      }
      return url;
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return !!(
          formData.fullName &&
          formData.phone &&
          formData.whatsapp &&
          formData.county &&
          formData.city &&
          formData.bio.length >= 250 &&
          (identityType === "individual" || formData.agencyName)
        );
      case 4:
        return true; // License step is now optional
      case 5:
        return !!(
          documents.idFrontUrl &&
          documents.idBackUrl &&
          documents.selfieUrl
        );
      case 6:
        return acceptedTerms;
      default:
        return true;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitApplication = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      let finalAvatarUrl = documents.avatarUrl;
      
      if (documents.avatarFile) {
        const avatarPath = `${user.id}/avatar-${Date.now()}.jpg`;
        const { url: uploadedAvatarUrl } = await uploadFile(
          "avatars",
          avatarPath,
          documents.avatarFile
        );
        if (uploadedAvatarUrl) {
          finalAvatarUrl = uploadedAvatarUrl;
        }
      }

      const verificationDocuments = {
        id_front_url: documents.idFrontUrl,
        id_back_url: documents.idBackUrl,
        selfie_url: documents.selfieUrl,
        license_doc_url: documents.licenseDocUrl,
      };

      await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone_number: formData.phone,
          avatar_url: finalAvatarUrl || null,
          bio: formData.bio,
          user_type: identityType,
          verification_status: "pending",
          verification_documents: verificationDocuments,
        })
        .eq("id", user.id);

      const agentData: any = {
        id: user.id,
        agency_name: identityType === "agency" ? formData.agencyName : null,
        license_number: identityType === "individual" ? formData.licenseNumber : null,
        bio: formData.bio,
        whatsapp_number: formData.whatsapp,
        is_verified: false,
      };

      const { error: agentError } = await supabase
        .from("agents")
        .upsert(agentData);

      if (agentError) {
        console.error("Agent insert error:", agentError);
        throw agentError;
      }

      toast.success("Application submitted successfully!");
      onOpenChange(false);
      
      setTimeout(() => {
        navigate("/agent/onboarding-complete");
      }, 500);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setIdentityType("individual");
    setFormData({
      fullName: "",
      phone: "",
      whatsapp: "",
      county: "",
      city: "",
      bio: "",
      licenseNumber: "",
      agencyName: "",
      agencyRegNumber: "",
      kraPin: "",
      agencyPhone: "",
      agencyAddress: "",
    });
    setDocuments({
      avatarFile: null,
      avatarUrl: "",
      licenseDocFile: null,
      licenseDocUrl: "",
      idFrontFile: null,
      idFrontUrl: "",
      idBackFile: null,
      idBackUrl: "",
      selfieFile: null,
      selfieUrl: "",
    });
    setAcceptedTerms(false);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 pt-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((stepNum, index) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`
              w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all
              ${currentStep >= stepNum
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground"
              }
            `}
          >
            {currentStep > stepNum ? (
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              stepNum
            )}
          </div>
          {index < TOTAL_STEPS - 1 && (
            <div
              className={`
                w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 rounded transition-all
                ${currentStep > stepNum ? "bg-primary" : "bg-muted"}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1_Welcome = () => (
    <>
      <DialogHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
        </div>
        <DialogTitle className="text-2xl text-center">Become an Agent Partner</DialogTitle>
        <DialogDescription className="text-center">
          Join Kenya&apos;s premier real estate platform and start listing properties today
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 sm:space-y-4 py-4 sm:py-6 max-h-[45vh] sm:max-h-[50vh] overflow-y-auto pr-2">
        <div className="glass-card p-4 sm:p-5 space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            What you&apos;ll get:
          </h3>
          <ul className="space-y-3">
            {[
              "Unlimited property listings",
              "Access to thousands of buyers",
              "AI-powered lead generation",
              "Secure escrow transactions",
              "Trust badge on verified profiles",
              "Dedicated agent dashboard",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-500 mb-1">
                Application Process
              </p>
              <p className="text-muted-foreground">
                Your application will be reviewed by our team within <strong>24-48 hours</strong>. 
                You&apos;ll receive a notification once approved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={handleNext} className="w-full bg-primary" size="lg">
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  );

  const renderStep2_Identity = () => (
    <>
      <DialogHeader>
        <DialogTitle>Choose Your Identity</DialogTitle>
        <DialogDescription>
          Select how you want to operate on the platform
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 sm:space-y-4 py-4 sm:py-6 max-h-[45vh] sm:max-h-[50vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <button
            onClick={() => setIdentityType("individual")}
            className={`
              relative p-5 rounded-xl border-2 transition-all text-left
              ${identityType === "individual"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/50"
              }
            `}
          >
            {identityType === "individual" && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`
                p-3 rounded-xl
                ${identityType === "individual" ? "bg-primary text-white" : "bg-muted"}
              `}>
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-lg ${identityType === "individual" ? "text-primary" : ""}`}>
                  Individual Agent
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Work independently and manage your own listings
                </p>
                <ul className="mt-3 space-y-1">
                  <li className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Perfect for freelancers
                  </li>
                  <li className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Own profile and reputation
                  </li>
                </ul>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIdentityType("agency")}
            className={`
              relative p-5 rounded-xl border-2 transition-all text-left
              ${identityType === "agency"
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/50"
              }
            `}
          >
            {identityType === "agency" && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`
                p-3 rounded-xl
                ${identityType === "agency" ? "bg-primary text-white" : "bg-muted"}
              `}>
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-lg ${identityType === "agency" ? "text-primary" : ""}`}>
                  Registered Agency
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Operate as a company with a team
                </p>
                <ul className="mt-3 space-y-1">
                  <li className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Company branding
                  </li>
                  <li className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> Manage multiple agents
                  </li>
                </ul>
              </div>
            </div>
          </button>
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} className="w-full sm:w-auto bg-primary">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  );

  const renderStep3_Profile = () => (
    <>
      <DialogHeader>
        <DialogTitle>Profile Information</DialogTitle>
        <DialogDescription>
          {identityType === "individual"
            ? "Tell us about yourself and your experience"
            : "Tell us about your agency"
          }
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto pr-2">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-20 h-20 border-4 border-primary/20">
            <AvatarImage src={documents.avatarUrl} />
            <AvatarFallback className="text-2xl bg-primary/10">
              {formData.fullName?.charAt(0)?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <Input
              type="file"
              id="avatar-upload-wizard"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  handleAvatarUpload(file, url);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("avatar-upload-wizard")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>
            {identityType === "individual" ? "Full Name" : "Agency Name"} *
          </Label>
          <Input
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            placeholder={identityType === "individual" ? "John Kamau" : "Kamau Properties Ltd"}
            className="glass-input"
          />
        </div>

        {identityType === "individual" && (
          <div className="space-y-2">
            <Label>License Number (Optional)</Label>
            <Input
              value={formData.licenseNumber}
              onChange={(e) => updateFormData("licenseNumber", e.target.value)}
              placeholder="e.g., REF/2023/12345"
              className="glass-input"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Phone Number *</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              placeholder="+254 712 345 678"
              className="glass-input"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp *</Label>
            <Input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => updateFormData("whatsapp", e.target.value)}
              placeholder="+254 712 345 678"
              className="glass-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>County *</Label>
            <Select value={formData.county} onValueChange={(v) => updateFormData("county", v)}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {KENYAN_COUNTIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City/Town *</Label>
            <Input
              value={formData.city}
              onChange={(e) => updateFormData("city", e.target.value)}
              placeholder="e.g., Nairobi"
              className="glass-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Bio / Description *
            <span className="text-xs text-muted-foreground ml-2">
              (Minimum 250 characters)
            </span>
          </Label>
          <Textarea
            value={formData.bio}
            onChange={(e) => updateFormData("bio", e.target.value)}
            placeholder={
              identityType === "individual"
                ? "Tell potential clients about your experience in real estate..."
                : "Describe your agency's services and expertise..."
            }
            rows={4}
            maxLength={500}
            className="glass-input resize-none"
          />
          <div className="flex items-center justify-between text-xs">
            <span className={formData.bio.length < 250 ? "text-destructive" : "text-emerald-500"}>
              {formData.bio.length < 250
                ? `${250 - formData.bio.length} more characters needed`
                : "Good to go!"}
            </span>
            <span className="text-muted-foreground">{formData.bio.length}/500</span>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!validateStep(3)}
          className="bg-primary"
        >
          Next: Documents
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  );

  const renderStep4_License = () => (
    <>
      <DialogHeader>
        <DialogTitle>License Verification (Optional)</DialogTitle>
        <DialogDescription>
          Upload your {identityType === "individual" ? "practicing license" : "business registration certificate"}. 
          This step is optional - you can skip if you don't have these documents yet.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <Alert className="border-emerald-500/50 bg-emerald-500/10">
          <Shield className="w-4 h-4 text-emerald-500" />
          <AlertTitle>Secure Document Handling</AlertTitle>
          <AlertDescription>
            Your documents are encrypted and only visible to admin reviewers.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {identityType === "individual" ? (
            <>
              <FileUpload
                label="Practicing License"
                accept="image/*,.pdf"
                maxSize={10}
                onUpload={handleLicenseDocUpload}
                preview={documents.licenseDocUrl}
              />
              <p className="text-xs text-muted-foreground -mt-2">
                Upload your real estate practicing license issued by relevant authority (optional)
              </p>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Agency Registration Number</Label>
                <Input
                  value={formData.agencyRegNumber}
                  onChange={(e) => updateFormData("agencyRegNumber", e.target.value)}
                  placeholder="e.g., CPR/2023/123456"
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label>KRA PIN</Label>
                <Input
                  value={formData.kraPin}
                  onChange={(e) => updateFormData("kraPin", e.target.value)}
                  placeholder="e.g., A123456789B"
                  className="glass-input"
                />
              </div>
              <FileUpload
                label="Certificate of Incorporation"
                accept="image/*,.pdf"
                maxSize={10}
                onUpload={handleLicenseDocUpload}
                preview={documents.licenseDocUrl}
              />
              <div className="space-y-2">
                <Label>Physical Address</Label>
                <Input
                  value={formData.agencyAddress}
                  onChange={(e) => updateFormData("agencyAddress", e.target.value)}
                  placeholder="e.g., Westlands Commercial Center, 4th Floor"
                  className="glass-input"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} className="w-full sm:w-auto bg-primary">
          {documents.licenseDocUrl ? "Continue" : "Skip & Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  );

  const renderStep5_ID = () => (
    <>
      <DialogHeader>
        <DialogTitle>Identity Verification</DialogTitle>
        <DialogDescription>
          Upload clear photos of your national ID and a selfie
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUpload
            label="National ID (Front) *"
            accept="image/*"
            maxSize={5}
            onUpload={handleIdFrontUpload}
            preview={documents.idFrontUrl}
          />
          <FileUpload
            label="National ID (Back) *"
            accept="image/*"
            maxSize={5}
            onUpload={handleIdBackUpload}
            preview={documents.idBackUrl}
          />
        </div>

        <FileUpload
          label="Selfie with ID *"
          accept="image/*"
          maxSize={5}
          onUpload={handleSelfieUpload}
          preview={documents.selfieUrl}
        />

        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <AlertTitle>Photo Guidelines</AlertTitle>
          <AlertDescription className="text-xs">
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Ensure all text on ID is clearly readable</li>
              <li>Good lighting with no glare on ID surface</li>
              <li>Selfie should clearly show your face alongside the ID</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!validateStep(5)}
          className="bg-primary"
        >
          Next: Review
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  );

  const renderStep6_Review = () => (
    <>
      <DialogHeader>
        <DialogTitle>Review & Submit</DialogTitle>
        <DialogDescription>
          Please review your information before submitting
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto pr-2">
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <Avatar className="w-12 h-12">
              <AvatarImage src={documents.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {formData.fullName?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{formData.fullName}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {identityType} Agent
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">WhatsApp</p>
              <p className="font-medium">{formData.whatsapp}</p>
            </div>
            <div>
              <p className="text-muted-foreground">County</p>
              <p className="font-medium">{formData.county}</p>
            </div>
            <div>
              <p className="text-muted-foreground">City</p>
              <p className="font-medium">{formData.city}</p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-muted-foreground text-sm mb-1">Bio</p>
            <p className="text-sm">{formData.bio}</p>
          </div>
        </div>

        <div className="glass-card p-4">
          <h4 className="font-semibold text-sm mb-3">Uploaded Documents</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">License/Registration</span>
              <Check className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">ID Front</span>
              <Check className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">ID Back</span>
              <Check className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Camera className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">Selfie</span>
              <Check className="w-4 h-4 text-emerald-500 ml-auto" />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary"
          />
          <label htmlFor="terms-checkbox" className="text-sm text-muted-foreground cursor-pointer">
            I confirm that all information provided is accurate and I agree to the{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">Agent Partnership Agreement</a>.
          </label>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmitApplication}
          disabled={!acceptedTerms || isSubmitting}
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
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1_Welcome();
      case 2:
        return renderStep2_Identity();
      case 3:
        return renderStep3_Profile();
      case 4:
        return renderStep4_License();
      case 5:
        return renderStep5_ID();
      case 6:
        return renderStep6_Review();
      default:
        return null;
    }
  };

  const stepTitles = [
    "Welcome",
    "Identity",
    "Profile",
    "License",
    "ID Verification",
    "Review",
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="w-[95%] sm:max-w-xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        {currentStep > 1 && currentStep < 6 && (
          <div className="text-center text-sm text-muted-foreground pb-2">
            Step {currentStep}: {stepTitles[currentStep - 1]}
          </div>
        )}
        {renderStepIndicator()}
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
}
