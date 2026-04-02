import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AgentRegistrationDialog } from "@/components/AgentRegistrationDialog";
import TodaysFocus from "./components/TodaysFocus";
import PerformanceRadar from "./components/PerformanceRadar";
import MarketIntelligence from "./components/MarketIntelligence";
import CRMHub from "./components/CRMHub";
import { EmptyListingState } from "./components/command-center/EmptyListingState";
import { AddListingModal } from "./components/add-listing-modal/AddListingModal";
import { Loader2 } from "lucide-react";

export default function NewAgentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<"unverified" | "pending" | "approved" | "rejected">("unverified");

  useEffect(() => {
    if (user) {
      checkVerificationStatus();
    }
  }, [user]);

  const checkVerificationStatus = async () => {
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
        setVerificationStatus("approved");
      } else if (status === "rejected") {
        setVerificationStatus("rejected");
      } else if (status === "pending" || profile?.user_type === "agent" || profile?.user_type === "agency") {
        setVerificationStatus("pending");
        setIsRegistrationOpen(true);
      } else {
        setVerificationStatus("unverified");
        setIsRegistrationOpen(true);
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      setVerificationStatus("unverified");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <>
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Application Under Review</h2>
                <p className="text-muted-foreground mt-1">
                  Your agent application is being reviewed. You&apos;ll be notified once approved.
                </p>
              </div>
              <button
                onClick={() => navigate("/agent/onboarding-complete")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View Status
              </button>
            </div>
          </div>
        </div>

        <AgentRegistrationDialog
          open={isRegistrationOpen}
          onOpenChange={setIsRegistrationOpen}
        />
      </>
    );
  }

  if (verificationStatus === "rejected") {
    return (
      <>
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-xl">!</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Application Not Approved</h2>
                <p className="text-muted-foreground mt-1">
                  Your application was not approved. Please update your documents and reapply.
                </p>
              </div>
              <button
                onClick={() => setIsRegistrationOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Reapply
              </button>
            </div>
          </div>
        </div>

        <AgentRegistrationDialog
          open={isRegistrationOpen}
          onOpenChange={setIsRegistrationOpen}
        />
      </>
    );
  }

  if (verificationStatus === "unverified") {
    return (
      <>
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-xl border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Complete Your Agent Registration</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You&apos;re almost there! Complete the verification process to start listing properties and accessing all agent features.
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Verification
            </button>
          </div>
        </div>

        <AgentRegistrationDialog
          open={isRegistrationOpen}
          onOpenChange={setIsRegistrationOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <section>
          <TodaysFocus />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:h-[400px]">
          <PerformanceRadar />
          <MarketIntelligence />
        </div>

        <section>
          <CRMHub />
        </section>
        
        <section>
          <EmptyListingState
            onAddListing={() => setIsAddListingOpen(true)}
          />
        </section>
      </div>

      <AddListingModal
        open={isAddListingOpen}
        onOpenChange={setIsAddListingOpen}
      />
    </>
  );
}
