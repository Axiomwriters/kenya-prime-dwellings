import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Clock,
  Upload,
  Camera,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  X,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resolveDashboard } from "@/utils/roleRedirect";
import { validatePhoneNumber, formatPhoneNumber } from "@/utils/validation";
import { isValidRole, VERIFICATION_ROLES, ROLE_LABELS, AppRole } from "@/types/auth";

type Step = "welcome" | "id-upload" | "selfie" | "phone" | "otp" | "complete" | "expired";

interface VerificationSession {
  id: string;
  token: string;
  status: string;
  expires_at: string;
  id_front_url: string | null;
  id_back_url: string | null;
  selfie_url: string | null;
  phone_number: string | null;
  phone_verified: boolean | null;
  otp_hash: string | null;
  otp_expires_at: string | null;
  otp_attempts: number | null;
}

const TOTAL_STEPS = 3;
const STEP_LABELS = ["Identity", "Selfie", "Phone"];
const MAX_OTP_ATTEMPTS = 5;
const OTP_EXPIRY_MINUTES = 5;

async function hashOtp(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = 'savanah-verification-salt-v1';
  const data = encoder.encode(otp + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyOtpHash(inputOtp: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashOtp(inputOtp);
  return inputHash === storedHash;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function VerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoaded: userLoaded } = useUser();

  const roleParam = searchParams.get("role");
  const token = searchParams.get("token");

  // Get actual role from Clerk metadata and validate against URL param
  const clerkRole = (user?.unsafeMetadata?.role as AppRole) || null;
  const validRoleParam = (roleParam && VERIFICATION_ROLES.includes(roleParam as AppRole)) 
    ? roleParam 
    : (clerkRole && VERIFICATION_ROLES.includes(clerkRole) ? clerkRole : 'agent');
  const role = validRoleParam as AppRole;

  const [step, setStep] = useState<Step>("welcome");
  const [session, setSession] = useState<VerificationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverTimeRemaining, setServerTimeRemaining] = useState<number>(0);

  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpLocalAttempts, setOtpLocalAttempts] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const currentStepIndex = useMemo(() => {
    switch (step) {
      case "welcome":
      case "id-upload":
        return 0;
      case "selfie":
        return 1;
      case "phone":
      case "otp":
        return 2;
      case "complete":
        return 3;
      default:
        return 0;
    }
  }, [step]);

  const currentStepLabel = useMemo(() => {
    if (step === "welcome" || step === "id-upload") return "Identity";
    if (step === "selfie") return "Selfie";
    if (step === "phone" || step === "otp") return "Phone";
    return "Verify";
  }, [step]);

  const cleanupObjectUrl = useCallback((url: string | null) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupObjectUrl(idFrontPreview);
      cleanupObjectUrl(idBackPreview);
      cleanupObjectUrl(selfiePreview);
    };
  }, []);

  useEffect(() => {
    if (!userLoaded) return;
    
    if (!user) {
      navigate("/sign-in?redirect_url=/verification");
      return;
    }

    // Validate user has a role that requires verification
    const userClerkRole = user.unsafeMetadata?.role as string;
    if (userClerkRole && !VERIFICATION_ROLES.includes(userClerkRole as AppRole)) {
      // User doesn't need verification - redirect to their dashboard
      const destination = resolveDashboard(userClerkRole);
      navigate(destination, { replace: true });
      return;
    }

    initializeSession();
  }, [userLoaded, user, token, navigate]);

  useEffect(() => {
    if (serverTimeRemaining > 0) {
      const timer = setInterval(async () => {
        setServerTimeRemaining(prev => {
          if (prev <= 1) {
            setStep("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [serverTimeRemaining]);

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpTimer]);

  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const initializeSession = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      if (token) {
        const { data, error } = await supabase
          .from("verification_sessions")
          .select("*")
          .eq("token", token)
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          toast.error("Invalid verification link");
          navigate("/sign-up?role=" + role);
          return;
        }

        if (data.status === "completed") {
          const destination = resolveDashboard(data.role || role);
          navigate(destination);
          return;
        }

        if (data.status === "expired" || new Date(data.expires_at) < new Date()) {
          setStep("expired");
          setServerTimeRemaining(0);
          return;
        }

        setSession(data);
        calculateTimeRemaining(data.expires_at);

        if (data.id_front_url && data.id_back_url && data.selfie_url) {
          if (data.phone_verified) {
            setStep("complete");
          } else {
            setStep("phone");
          }
        } else if (data.id_front_url && data.id_back_url) {
          setStep("selfie");
        }
      } else {
        const { data: existingSession } = await supabase
          .from("verification_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", role)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (existingSession) {
          if (new Date(existingSession.expires_at) < new Date()) {
            await supabase
              .from("verification_sessions")
              .update({ status: "expired" })
              .eq("id", existingSession.id);
            setStep("expired");
            setServerTimeRemaining(0);
            return;
          }
          setSession(existingSession);
          calculateTimeRemaining(existingSession.expires_at);
          
          if (existingSession.id_front_url && existingSession.id_back_url && existingSession.selfie_url) {
            if (existingSession.phone_verified) {
              setStep("complete");
            } else {
              setStep("phone");
            }
          } else if (existingSession.id_front_url && existingSession.id_back_url) {
            setStep("selfie");
          }
        } else {
          const newToken = crypto.randomUUID();
          const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
          
          const { data: newSession, error } = await supabase
            .from("verification_sessions")
            .insert({
              user_id: user.id,
              role: role,
              token: newToken,
              status: "pending",
              expires_at: expiresAt,
            })
            .select()
            .single();

          if (error || !newSession) {
            toast.error("Failed to create verification session");
            return;
          }

          setSession(newSession);
          setServerTimeRemaining(48 * 60 * 60);
          navigate(`/verification?role=${role}&token=${newToken}`, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error initializing session:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (expiresAt: string) => {
    const expiresAtDate = new Date(expiresAt).getTime();
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiresAtDate - now) / 1000));
    setServerTimeRemaining(remaining);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user || !session) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${session.id}/${folder}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("verification-docs")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${folder}`);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("verification-docs")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${folder}`);
      return null;
    }
  };

  const handleIdFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      cleanupObjectUrl(idFrontPreview);
      setIdFrontFile(file);
      setIdFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleIdBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      cleanupObjectUrl(idBackPreview);
      setIdBackFile(file);
      setIdBackPreview(URL.createObjectURL(file));
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (JPG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      cleanupObjectUrl(selfiePreview);
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleIdSubmit = async () => {
    if (!idFrontFile || !idBackFile || !session) {
      toast.error("Please upload both front and back of your ID");
      return;
    }

    setSubmitting(true);
    try {
      const frontUrl = await uploadFile(idFrontFile, "id-front");
      const backUrl = await uploadFile(idBackFile, "id-back");

      if (!frontUrl || !backUrl) {
        return;
      }

      const { error } = await supabase
        .from("verification_sessions")
        .update({
          id_front_url: frontUrl,
          id_back_url: backUrl,
        })
        .eq("id", session.id);

      if (error) throw error;

      setSession({ ...session, id_front_url: frontUrl, id_back_url: backUrl });
      setStep("selfie");
      toast.success("ID uploaded successfully");
    } catch (error) {
      console.error("Error submitting ID:", error);
      toast.error("Failed to submit ID");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelfieSubmit = async () => {
    if (!selfieFile || !session) {
      toast.error("Please take a selfie");
      return;
    }

    setSubmitting(true);
    try {
      const selfieUrl = await uploadFile(selfieFile, "selfie");

      if (!selfieUrl) {
        return;
      }

      const { error } = await supabase
        .from("verification_sessions")
        .update({
          selfie_url: selfieUrl,
        })
        .eq("id", session.id);

      if (error) throw error;

      setSession({ ...session, selfie_url: selfieUrl });
      setStep("phone");
      toast.success("Selfie uploaded successfully");
    } catch (error) {
      console.error("Error submitting selfie:", error);
      toast.error("Failed to submit selfie");
    } finally {
      setSubmitting(false);
    }
  };

  const sendOtp = async () => {
    if (!session) return;
    
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      toast.error("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      return;
    }

    setSubmitting(true);
    try {
      const otp = generateOtp();
      const otpHash = await hashOtp(otp);
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

      const { error: updateError } = await supabase
        .from("verification_sessions")
        .update({
          phone_number: validation.formatted,
          otp_hash: otpHash,
          otp_expires_at: expiresAt,
          otp_attempts: 0,
          otp_sent_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      if (updateError) throw updateError;

      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        'send-verification-otp',
        {
          body: {
            phone_number: validation.formatted,
            otp_code: otp,
            purpose: 'verification',
          },
        }
      );

      if (fnError) {
        console.error('SMS function error:', fnError);
        toast.error("Failed to send verification code. Please try again.");
        return;
      }

      if (fnData?.success) {
        setSession({ 
          ...session, 
          phone_number: validation.formatted,
          otp_hash: otpHash,
          otp_expires_at: expiresAt,
        });
        setOtpSent(true);
        setOtpTimer(OTP_EXPIRY_MINUTES * 60);
        setOtpLocalAttempts(0);
        setStep("otp");
        toast.success(`Verification code sent to ${formatPhoneNumber(validation.formatted.replace('+254', '0'))}`);
      } else if (fnData?.demo_mode) {
        setSession({ 
          ...session, 
          phone_number: validation.formatted,
          otp_hash: otpHash,
          otp_expires_at: expiresAt,
        });
        setOtpSent(true);
        setOtpTimer(OTP_EXPIRY_MINUTES * 60);
        setOtpLocalAttempts(0);
        setStep("otp");
        toast.info("Demo mode: Check the UI for the OTP code");
      } else {
        toast.error(fnData?.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send verification code");
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!session || !otpCode || otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    if (otpLocalAttempts >= MAX_OTP_ATTEMPTS) {
      toast.error("Too many attempts. Please request a new code.");
      return;
    }

    setSubmitting(true);
    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from("verification_sessions")
        .select("*")
        .eq("id", session.id)
        .single();

      if (fetchError || !sessionData) {
        toast.error("Session not found");
        setSubmitting(false);
        return;
      }

      if (!sessionData.otp_hash || !sessionData.otp_expires_at) {
        toast.error("No verification code found. Please request a new one.");
        setSubmitting(false);
        return;
      }

      if (new Date(sessionData.otp_expires_at) < new Date()) {
        toast.error("Verification code has expired. Please request a new one.");
        setOtpCode("");
        setOtpLocalAttempts(prev => prev + 1);
        setSubmitting(false);
        return;
      }

      const isValid = await verifyOtpHash(otpCode, sessionData.otp_hash);
      
      if (!isValid) {
        const newAttempts = (sessionData.otp_attempts || 0) + 1;
        await supabase
          .from("verification_sessions")
          .update({ otp_attempts: newAttempts })
          .eq("id", session.id);
        
        const remaining = MAX_OTP_ATTEMPTS - newAttempts;
        setOtpLocalAttempts(newAttempts);
        
        if (remaining <= 0) {
          toast.error("Too many incorrect attempts. Please request a new code.");
        } else {
          toast.error(`Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);
        }
        setOtpCode("");
        setSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("verification_sessions")
        .update({
          phone_verified: true,
          status: "completed",
          completed_at: new Date().toISOString(),
          otp_hash: null,
          otp_expires_at: null,
        })
        .eq("id", session.id);

      if (updateError) throw updateError;

      setOtpVerified(true);
      setStep("complete");
      toast.success("Phone number verified successfully!");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!session || !session.phone_number) {
      setStep("phone");
      return;
    }

    setOtpCode("");
    await sendOtp();
  };

  const handleComplete = () => {
    const destination = resolveDashboard(role);
    navigate(destination);
  };

  const handleCancelVerification = async () => {
    if (session) {
      await supabase
        .from("verification_sessions")
        .update({ status: "cancelled" })
        .eq("id", session.id);
    }
    navigate("/sign-up?role=" + role);
  };

  if (loading || !userLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (step === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Verification Expired</CardTitle>
            <CardDescription>
              Your 48-hour verification window has closed. Please start a new verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleCancelVerification}>
              Start New Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = step === "welcome" ? 0 : step === "complete" ? 100 : ((currentStepIndex) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg">Savanah Dwelling</span>
            </div>
            {serverTimeRemaining > 0 && step !== "complete" && (
              <Badge variant="outline" className="gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(serverTimeRemaining)}
              </Badge>
            )}
          </div>
          {step !== "welcome" && step !== "complete" && (
            <>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span className="capitalize">{ROLE_LABELS[role]} Verification</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex justify-between mt-4">
                {STEP_LABELS.map((label, index) => (
                  <div
                    key={label}
                    className={cn(
                      "flex flex-col items-center text-xs",
                      index < currentStepIndex ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[10px]",
                        index < currentStepIndex
                          ? "bg-primary text-primary-foreground"
                          : index === currentStepIndex
                            ? "bg-primary/20 text-primary border-2 border-primary"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="hidden sm:block">{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {step === "welcome" && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Complete Your Verification</CardTitle>
              <CardDescription className="text-base">
                To become a verified {ROLE_LABELS[role].toLowerCase()}, you need to complete identity verification within 48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-lg border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Upload ID Documents</h4>
                    <p className="text-sm text-muted-foreground">
                      Front and back of your Kenyan National ID or Passport
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Take a Selfie</h4>
                    <p className="text-sm text-muted-foreground">
                      A clear photo of yourself matching your ID
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg border">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Verify Phone Number</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive and enter a one-time code via SMS
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  You have <strong>48 hours</strong> to complete verification. After this period, you will need to start over.
                </AlertDescription>
              </Alert>

              <Button
                className="w-full h-12 text-base"
                onClick={() => setStep("id-upload")}
              >
                Begin Verification
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "id-upload" && (
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit px-0 hover:bg-transparent"
                onClick={() => setStep("welcome")}
                disabled={submitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <CardTitle>Upload ID Document</CardTitle>
              <CardDescription>
                Upload both sides of your Kenyan National ID or Passport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Front of ID</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                      idFrontPreview
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                    onClick={() => idFrontInputRef.current?.click()}
                  >
                    <input
                      ref={idFrontInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      capture="environment"
                      className="hidden"
                      onChange={handleIdFrontChange}
                      disabled={submitting}
                    />
                    {idFrontPreview ? (
                      <div className="relative">
                        <img
                          src={idFrontPreview}
                          alt="ID Front"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            cleanupObjectUrl(idFrontPreview);
                            setIdFrontFile(null);
                            setIdFrontPreview(null);
                          }}
                          disabled={submitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tap to upload</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Back of ID</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                      idBackPreview
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                    onClick={() => idBackInputRef.current?.click()}
                  >
                    <input
                      ref={idBackInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      capture="environment"
                      className="hidden"
                      onChange={handleIdBackChange}
                      disabled={submitting}
                    />
                    {idBackPreview ? (
                      <div className="relative">
                        <img
                          src={idBackPreview}
                          alt="ID Back"
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            cleanupObjectUrl(idBackPreview);
                            setIdBackFile(null);
                            setIdBackPreview(null);
                          }}
                          disabled={submitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tap to upload</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Make sure all text on your ID is clearly visible and not obscured. Accepted formats: JPG, PNG (max 5MB).
                </AlertDescription>
              </Alert>

              <Button
                className="w-full"
                disabled={!idFrontFile || !idBackFile || submitting}
                onClick={handleIdSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "selfie" && (
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit px-0 hover:bg-transparent"
                onClick={() => setStep("id-upload")}
                disabled={submitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <CardTitle>Take a Selfie</CardTitle>
              <CardDescription>
                Take a clear photo of yourself for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  selfiePreview
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                )}
                onClick={() => selfieInputRef.current?.click()}
              >
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  capture="user"
                  className="hidden"
                  onChange={handleSelfieChange}
                  disabled={submitting}
                />
                {selfiePreview ? (
                  <div className="relative">
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="w-48 h-48 mx-auto object-cover rounded-full"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-1/2 translate-x-20 -translate-y-2 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        cleanupObjectUrl(selfiePreview);
                        setSelfieFile(null);
                        setSelfiePreview(null);
                      }}
                      disabled={submitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Tap to take selfie</p>
                  </>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Ensure your face is clearly visible and well-lit. Remove glasses or hats if possible.
                </AlertDescription>
              </Alert>

              <Button
                className="w-full"
                disabled={!selfieFile || submitting}
                onClick={handleSelfieSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "phone" && (
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit px-0 hover:bg-transparent"
                onClick={() => setStep("selfie")}
                disabled={submitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <CardTitle>Verify Phone Number</CardTitle>
              <CardDescription>
                Enter your Kenyan phone number to receive a verification code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="w-24 h-10 border rounded-md flex items-center justify-center bg-muted text-sm font-medium">
                    +254
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                    className="flex-1 h-10"
                    disabled={submitting}
                  />
                </div>
              </div>

              <Alert>
                <Phone className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  We&apos;ll send a 6-digit code via SMS. Standard rates may apply.
                </AlertDescription>
              </Alert>

              <Button
                className="w-full"
                disabled={phoneNumber.length !== 9 || submitting}
                onClick={sendOtp}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "otp" && (
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit px-0 hover:bg-transparent"
                onClick={() => {
                  if (otpVerified) {
                    setStep("phone");
                  }
                }}
                disabled={submitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <CardTitle>Enter Verification Code</CardTitle>
              <CardDescription>
                We sent a 6-digit code to <strong>{session?.phone_number ? formatPhoneNumber(session.phone_number.replace('+254', '0')) : 'your phone'}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  ref={otpInputRef}
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-12 text-center text-2xl tracking-widest font-mono"
                  disabled={submitting}
                  autoComplete="one-time-code"
                />
              </div>

              <div className="flex justify-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend code in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, "0")}
                  </p>
                ) : (
                  <Button 
                    variant="link" 
                    onClick={resendOtp} 
                    disabled={submitting}
                  >
                    Resend Code
                  </Button>
                )}
              </div>

              {otpLocalAttempts > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {MAX_OTP_ATTEMPTS - otpLocalAttempts} attempt{Math.abs(otpLocalAttempts) === 1 ? '' : 's'} remaining
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                disabled={otpCode.length !== 6 || submitting}
                onClick={verifyOtp}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "complete" && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Verification Complete!</CardTitle>
              <CardDescription>
                Your {ROLE_LABELS[role].toLowerCase()} account has been verified. You can now access all features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your documents have been submitted for review. You can start using your dashboard while we verify your information.
                </p>
              </div>
              <Button className="w-full" onClick={handleComplete}>
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
