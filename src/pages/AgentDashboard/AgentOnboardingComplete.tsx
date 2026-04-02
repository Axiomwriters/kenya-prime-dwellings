import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, ArrowRight, Home, Building2, Loader2, Bell } from "lucide-react";

export default function AgentOnboardingComplete() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    checkApplicationStatus();
  }, [user]);

  const checkApplicationStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type, verification_status")
        .eq("id", user.id)
        .single();

      const { data: agent } = await supabase
        .from("agents")
        .select("is_verified")
        .eq("id", user.id)
        .single();

      const status = profile?.verification_status;
      const isVerifiedAgent = agent?.is_verified;

      if (status === "verified" || isVerifiedAgent) {
        setApplicationStatus("approved");
        setShowConfetti(true);
      } else if (status === "rejected") {
        setApplicationStatus("rejected");
      } else {
        setApplicationStatus("pending");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your status...</p>
        </div>
      </div>
    );
  }

  if (applicationStatus === "approved") {
    return <ApprovedState navigate={navigate} showConfetti={showConfetti} />;
  }

  if (applicationStatus === "rejected") {
    return <RejectedState navigate={navigate} />;
  }

  return <PendingState navigate={navigate} user={user} />;
}

function PendingState({ navigate, user }: { navigate: any; user: any }) {
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="max-w-lg w-full relative z-10 shadow-2xl border-primary/10">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <div className="relative inline-flex">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/20 animate-pulse">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 px-4 py-1">
                <Clock className="w-3 h-3 mr-1" />
                Awaiting Review
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold">Application Submitted!</h1>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Thank you for applying to become an agent partner. Our team will review your application shortly.
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-3">
              <h3 className="font-semibold text-sm text-left">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p className="text-sm">Our team reviews your documents (24-48 hours)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p className="text-sm">You&apos;ll receive an email notification when approved</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p className="text-sm">Access your agent dashboard and start listing!</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-600">Your documents are secure</p>
                  <p className="text-muted-foreground">
                    All documents are encrypted and only accessible to verified admin reviewers.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Estimated review time: 24-48 hours</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-primary"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
            <Button
              onClick={() => navigate("/agent")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Check Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function ApprovedState({ navigate, showConfetti }: { navigate: any; showConfetti: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-emerald-50/30 to-background p-4">
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ["#10b981", "#22c55e", "#facc15", "#84cc16", "#06b6d4"][i % 5],
                left: `${Math.random() * 100}%`,
                top: "-20px",
                animation: `confetti ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="max-w-lg w-full relative z-10 shadow-2xl border-emerald-500/20">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <div className="relative inline-flex">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-4 py-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Agent
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold">Congratulations!</h1>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Your agent application has been approved. You now have full access to the agent dashboard.
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-3">
              <h3 className="font-semibold text-sm text-left">Your next steps:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-sm">Complete your profile with more details</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600">2</span>
                  </div>
                  <p className="text-sm">Add your first property listing</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600">3</span>
                  </div>
                  <p className="text-sm">Start receiving inquiries from buyers</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-emerald-600">Trust Badge Earned</p>
                  <p className="text-muted-foreground">
                    Your profile now displays a verified badge, building trust with potential clients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => navigate("/agent")}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              size="lg"
            >
              Go to Agent Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function RejectedState({ navigate }: { navigate: any }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-red-50/30 to-background p-4">
      <Card className="max-w-lg w-full relative z-10 shadow-2xl border-red-500/20">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-xl shadow-red-500/20">
              <Shield className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 px-4 py-1">
                Application Not Approved
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold">Review Completed</h1>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Unfortunately, your application could not be approved at this time. Please review the feedback below.
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-red-600 mb-2">Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Please ensure all documents are clear and readable. If you believe this was a mistake, please contact support.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <h3 className="font-semibold text-sm">What you can do:</h3>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-600">1</span>
                </div>
                <p className="text-sm">Contact support for more details</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-600">2</span>
                </div>
                <p className="text-sm">Update your documents with clearer photos</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-600">3</span>
                </div>
                <p className="text-sm">Reapply after addressing the feedback</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-primary"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
