import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
    Shield,
    Lock,
    Mail,
    CheckCircle2,
    Loader2,
    Monitor,
    Smartphone,
    Trash2,
    AlertTriangle,
    Download,
    ArrowLeft,
    XCircle,
    Camera,
    Upload
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { uploadFile, generateFileName, compressImage } from "@/utils/uploadHelpers";

interface Session {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
}

export default function AccountSettings() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [profile, setProfile] = useState<any>(null);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
    const userInitials = userName.substring(0, 2).toUpperCase();

    // Mock sessions - in production, fetch from Supabase
    const [sessions] = useState<Session[]>([
        {
            id: "1",
            device: "Chrome on Windows",
            location: "Nairobi, Kenya",
            lastActive: new Date().toISOString(),
            isCurrent: true
        },
        {
            id: "2",
            device: "Safari on iPhone",
            location: "Mombasa, Kenya",
            lastActive: new Date(Date.now() - 86400000).toISOString(),
            isCurrent: false
        }
    ]);

    useEffect(() => {
        if (user) {
            checkMFAStatus();
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setAvatarUrl(profileData.avatar_url || "");
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        try {
            setUploading(true);
            const compressedFile = await compressImage(file);
            const fileName = generateFileName(compressedFile, `avatar-${user?.id}`);
            const filePath = await uploadFile(compressedFile, 'avatars', fileName);

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user?.id);

            if (error) throw error;

            setAvatarUrl(publicUrl);
            toast.success("Profile photo updated successfully!");

        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast.error(error.message || "Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    const checkMFAStatus = async () => {
        try {
            const { data: { factors } } = await supabase.auth.mfa.listFactors();
            setTwoFactorEnabled(factors && factors.length > 0);
        } catch (error) {
            console.error('Error checking MFA status:', error);
        }
    };

    const handle2FAToggle = async (enabled: boolean) => {
        if (enabled) {
            try {
                const { data, error } = await supabase.auth.mfa.enroll({
                    factorType: 'totp',
                    friendlyName: 'PropertyHub Account'
                });

                if (error) throw error;

                toast.success("2FA setup initiated. Please scan the QR code with your authenticator app.");
                setTwoFactorEnabled(true);
            } catch (error: any) {
                console.error('Error enabling 2FA:', error);
                toast.error(error.message || "Failed to enable 2FA");
            }
        } else {
            try {
                const { data: { factors } } = await supabase.auth.mfa.listFactors();
                if (factors && factors.length > 0) {
                    await supabase.auth.mfa.unenroll({ factorId: factors[0].id });
                    setTwoFactorEnabled(false);
                    toast.success("2FA disabled");
                }
            } catch (error: any) {
                console.error('Error disabling 2FA:', error);
                toast.error(error.message || "Failed to disable 2FA");
            }
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            setPasswordData({
                newPassword: "",
                confirmPassword: "",
            });
            toast.success("Password updated successfully!");
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast.error(error.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        toast.success("Session revoked successfully");
    };

    const handleDeactivateAccount = async () => {
        toast.info("Account deactivation feature coming soon");
    };

    const handleDeleteAccount = async () => {
        try {
            toast.error("Please contact support to delete your account");
        } catch (error: any) {
            toast.error("Failed to delete account");
        }
    };

    const handleExportData = async () => {
        toast.info("Preparing your data for export...");
    };

    const emailVerified = user?.email_confirmed_at;

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4 hover:bg-primary/10 group pl-0"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Button>

                    <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your profile, security, and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Identity & Avatar Section - NEW */}
                    <Card className="border-primary/10 bg-gradient-to-br from-card to-background">
                        <CardHeader>
                            <CardTitle>Profile Identity</CardTitle>
                            <CardDescription>How you appear to agents and other users</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Upload Button */}
                                <div
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                                    onClick={() => document.getElementById('settings-avatar-upload')?.click()}
                                >
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <input
                                    id="settings-avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleAvatarUpload(file);
                                    }}
                                    disabled={uploading}
                                />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div>
                                    <h3 className="text-lg font-semibold">{userName}</h3>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    {emailVerified ? (
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                            Pending Verification
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email & Verification */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-primary" />
                                Email & Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!emailVerified && (
                                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-lg p-4 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-orange-800 dark:text-orange-400">Verify your email</h4>
                                        <p className="text-sm text-orange-700 dark:text-orange-500/80 mb-2">
                                            Please verify your email address to access all features.
                                        </p>
                                        <Button size="sm" variant="outline" className="h-8 text-xs border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20">
                                            Resend Verification Email
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label>Email Address</Label>
                                <Input value={user?.email || ''} disabled className="bg-muted/50" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Security
                            </CardTitle>
                            <CardDescription>Protect your account with additional security measures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* 2FA Toggle */}
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">Two-Factor Authentication</div>
                                    <div className="text-xs text-muted-foreground">
                                        Add an extra layer of security to your account
                                    </div>
                                </div>
                                <Switch
                                    checked={twoFactorEnabled}
                                    onCheckedChange={handle2FAToggle}
                                />
                            </div>

                            <Separator />

                            {/* Password Change */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium">Change Password</h3>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">New Password</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            placeholder="Min 8 characters"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                                        <Input
                                            id="confirm_password"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handlePasswordChange}
                                    disabled={!passwordData.newPassword || !passwordData.confirmPassword || loading}
                                    className="w-full sm:w-auto"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Update Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Sessions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="w-5 h-5 text-primary" />
                                Active Sessions
                            </CardTitle>
                            <CardDescription>Manage devices where you're currently logged in</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="border rounded-lg p-4 bg-muted/10 flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            {session.device.includes('iPhone') || session.device.includes('Android') ? (
                                                <Smartphone className="w-5 h-5 text-primary" />
                                            ) : (
                                                <Monitor className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-2 text-sm">
                                                {session.device}
                                                {session.isCurrent && (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] h-5">
                                                        Current
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{session.location}</div>
                                            <div className="text-[10px] text-muted-foreground mt-1">
                                                Active: {new Date(session.lastActive).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {!session.isCurrent && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRevokeSession(session.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Revoke
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/30 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                                Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-background/50">
                                <div>
                                    <h4 className="font-medium text-sm">Deactivate Account</h4>
                                    <p className="text-xs text-muted-foreground">Temporarily disable your account.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">Deactivate</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You can reactive it anytime by logging in.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeactivateAccount}>Deactivate</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-background/50">
                                <div>
                                    <h4 className="font-medium text-sm text-destructive">Delete Account</h4>
                                    <p className="text-xs text-muted-foreground">Permanently remove all your data.</p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">Yes, Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
