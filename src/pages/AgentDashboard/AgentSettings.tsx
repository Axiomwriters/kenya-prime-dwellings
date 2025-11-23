import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Save, Loader2, Upload, AlertTriangle } from "lucide-react";
import { uploadFile, compressImage } from "@/utils/uploadHelpers";

export default function AgentSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailListings, setEmailListings] = useState(true);
  const [emailMessages, setEmailMessages] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, notification_preferences")
        .eq("id", user?.id)
        .maybeSingle();

      if (profile) {
        setAvatarUrl(profile.avatar_url || "");
        setFullName(profile.full_name || "");
        const prefs = (profile.notification_preferences as any) || {};
        setEmailListings(prefs.email_listings ?? true);
        setEmailMessages(prefs.email_messages ?? true);
        setEmailMarketing(prefs.email_marketing ?? false);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      const path = `${user?.id}/avatar-${Date.now()}.jpg`;
      const { url, error } = await uploadFile("avatars", path, compressed);
      
      if (error || !url) {
        toast.error("Failed to upload avatar");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(url);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to update profile picture");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          notification_preferences: {
            email_listings: emailListings,
            email_messages: emailMessages,
            email_marketing: emailMarketing,
          },
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Preferences saved!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-2xl bg-primary/10">
                {fullName?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button variant="outline" onClick={() => document.getElementById("avatar-upload")?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New Picture
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or WEBP. Max 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="glass-input" />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="glass-input" />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="glass-input" />
          </div>
          <Button onClick={handlePasswordChange} disabled={!newPassword || !confirmPassword || saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : <><Save className="w-4 h-4 mr-2" />Update Password</>}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Choose what emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Listing Updates</p>
              <p className="text-sm text-muted-foreground">Get notified when your listings are approved or rejected</p>
            </div>
            <Switch checked={emailListings} onCheckedChange={setEmailListings} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Messages</p>
              <p className="text-sm text-muted-foreground">When potential buyers contact you</p>
            </div>
            <Switch checked={emailMessages} onCheckedChange={setEmailMessages} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Updates</p>
              <p className="text-sm text-muted-foreground">Tips, updates, and news about the platform</p>
            </div>
            <Switch checked={emailMarketing} onCheckedChange={setEmailMarketing} />
          </div>
          <Button onClick={handleSavePreferences} disabled={saving}>
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Preferences</>}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data including listings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast.info("Account deletion requires admin approval. Please contact support.")} className="bg-destructive">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
