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
    XCircle
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

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
        checkMFAStatus();
    }, []);

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
        // In production, call Supabase API to revoke session
        toast.success("Session revoked successfully");
    };

    const handleDeactivateAccount = async () => {
        toast.info("Account deactivation feature coming soon");
    };

    const handleDeleteAccount = async () => {
        try {
            // In production, implement proper account deletion
            toast.error("Please contact support to delete your account");
        } catch (error: any) {
            toast.error("Failed to delete account");
        }
    };

    const handleExportData = async () => {
        toast.info("Preparing your data for export...");
        // In production, generate data export
    };

    const emailVerified = user?.email_confirmed_at;

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4 hover:bg-primary/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account security and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Email & Verification */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Email & Verification
                            </CardTitle>
                            <CardDescription>Your email address and verification status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium">Email Address</div>
                                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                                </div>
                                {emailVerified ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Not Verified
                                    </Badge>
                                )}
                            </div>

                            {!emailVerified && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <p className="text-sm text-orange-800 mb-3">
                                        Please verify your email address to access all features
                                    </p>
                                    <Button size="sm" variant="outline">
                                        Resend Verification Email
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Security
                            </CardTitle>
                            <CardDescription>Protect your account with additional security measures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* 2FA Toggle */}
                            <div className="flex items-center justify-between">
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
                                    <Lock className="w-4 h-4" />
                                    <h3 className="text-sm font-medium">Change Password</h3>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">New Password</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            placeholder="Enter new password (min 8 characters)"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                                        <Input
                                            id="confirm_password"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <Button
                                        onClick={handlePasswordChange}
                                        disabled={!passwordData.newPassword || !passwordData.confirmPassword || loading}
                                        className="w-full"
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Sessions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="w-5 h-5" />
                                Active Sessions
                            </CardTitle>
                            <CardDescription>Manage devices where you're currently logged in</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                {session.device.includes('iPhone') || session.device.includes('Android') ? (
                                                    <Smartphone className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <Monitor className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    {session.device}
                                                    {session.isCurrent && (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            Current
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{session.location}</div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Last active: {new Date(session.lastActive).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        {!session.isCurrent && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRevokeSession(session.id)}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Revoke
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Data & Privacy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Data & Privacy
                            </CardTitle>
                            <CardDescription>Export or manage your data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" onClick={handleExportData} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Export My Data
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>Irreversible actions for your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Deactivate Account */}
                            <div className="border border-destructive/30 rounded-lg p-4 space-y-3">
                                <div>
                                    <h4 className="font-medium mb-1">Deactivate Account</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Temporarily deactivate your account. You can reactivate it anytime.
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            Deactivate Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Your account will be temporarily deactivated. You can reactivate it by logging in again.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeactivateAccount}>
                                                Deactivate
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>

                            {/* Delete Account */}
                            <div className="border border-destructive rounded-lg p-4 space-y-3">
                                <div>
                                    <h4 className="font-medium mb-1 text-destructive">Delete Account Permanently</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Once you delete your account, there is no going back. All your data will be permanently deleted.
                                    </p>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-destructive">
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove all your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDeleteAccount}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Yes, delete my account
                                            </AlertDialogAction>
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
