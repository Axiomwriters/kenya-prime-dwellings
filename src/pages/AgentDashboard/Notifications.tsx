import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Home,
  Shield,
  ArrowRight,
  RefreshCw,
  Loader2,
  X,
  Sparkles,
  FileText,
  User,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "verification_reminder" | "system" | "listing" | "message" | "approval" | "rejection";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
  metadata?: any;
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizardReminder, setShowWizardReminder] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      checkWizardStatus();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWizardStatus = async () => {
    if (!user) return;

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
      const isVerified = status === "verified" || isVerifiedAgent;
      const hasUserType = profile?.user_type === "agent" || profile?.user_type === "agency";
      const hasAgentRecord = !!agent;
      const needsWizard = !hasAgentRecord || status === "pending" || status === "unverified";

      if (hasUserType && needsWizard && !isVerified) {
        setShowWizardReminder(true);
      }
    } catch (error) {
      console.error("Error checking wizard status:", error);
    }
  };

  const dismissWizardReminder = async () => {
    setDismissing(true);
    try {
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: user?.id,
          type: "system",
          title: "Wizard Reminder Dismissed",
          message: "You can complete verification anytime from your profile settings.",
          read: true,
        });

      if (!error) {
        setShowWizardReminder(false);
        toast.success("Reminder dismissed");
      }
    } catch (error) {
      console.error("Error dismissing reminder:", error);
    } finally {
      setDismissing(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "verification_reminder":
        return <Shield className="w-5 h-5 text-amber-500" />;
      case "approval":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "rejection":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "listing":
        return <Home className="w-5 h-5 text-blue-500" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="px-2 py-1">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={fetchNotifications}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {showWizardReminder && (
        <Card className="border-amber-500/50 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      Complete Your Agent Verification
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                        Action Required
                      </Badge>
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      We&apos;ve updated our verification process. As an existing agent, please complete the new verification wizard to continue listing properties and access all agent features.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={dismissWizardReminder}
                    disabled={dismissing}
                    className="shrink-0"
                  >
                    {dismissing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm p-3 bg-background/50 rounded-lg">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Upload license documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-3 bg-background/50 rounded-lg">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Verify your identity</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-3 bg-background/50 rounded-lg">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>Update your profile</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={() => navigate("/agent/profile")}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    Complete Verification
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={dismissWizardReminder}>
                    Remind Me Later
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No notifications yet</h3>
              <p className="text-muted-foreground max-w-sm">
                You&apos;ll see notifications here when you receive messages, have listing updates, or verification status changes.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    flex items-start gap-4 p-4 cursor-pointer transition-colors
                    ${notification.read ? "bg-background hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"}
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${notification.read ? "bg-muted" : "bg-primary/10"}
                    `}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${notification.read ? "" : "text-primary"}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {notifications.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {notifications.length} notifications</p>
          <p>All notifications are sorted by most recent</p>
        </div>
      )}
    </div>
  );
}
