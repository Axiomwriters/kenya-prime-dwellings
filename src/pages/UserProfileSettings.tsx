import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Upload,
  Save,
  Loader2,
  Shield,
  User,
  Lock,
  Calendar,
  Mail,
  Phone,
  FileText,
  MapPin,
  Bell,
  Eye,
  CheckCircle2,
  Home,
  DollarSign,
  Bed
} from "lucide-react";
import { toast } from "sonner";
import { uploadFile, generateFileName, compressImage } from "@/utils/uploadHelpers";
import { useNavigate } from "react-router-dom";
import { DocumentVerification } from "@/components/agents/DocumentVerification";

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Studio",
  "Townhouse",
  "Penthouse"
];

const KENYAN_CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Malindi",
  "Kitale"
];

export default function UserProfileSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    bio: "",
    avatar_url: "",
    // Location & Preferences
    preferred_location: "",
    preferred_property_types: [] as string[],
    min_price: "",
    max_price: "",
    min_bedrooms: "",
    max_bedrooms: "",
    // Notifications
    email_notifications: true,
    push_notifications: true,
    property_alerts: true,
    price_drop_alerts: true,
    saved_property_updates: true,
    newsletter_subscription: true,
    // Privacy
    profile_visibility: "public",
    show_email: false,
    show_phone: false,
    show_activity: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const userInitials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || "U";

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "January 1, 2024";

  const lastLogin = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "Never";

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
          preferred_location: profileData.preferred_location || "",
          preferred_property_types: profileData.preferred_property_types || [],
          min_price: profileData.min_price || "",
          max_price: profileData.max_price || "",
          min_bedrooms: profileData.min_bedrooms || "",
          max_bedrooms: profileData.max_bedrooms || "",
          email_notifications: profileData.email_notifications ?? true,
          push_notifications: profileData.push_notifications ?? true,
          property_alerts: profileData.property_alerts ?? true,
          price_drop_alerts: profileData.price_drop_alerts ?? true,
          saved_property_updates: profileData.saved_property_updates ?? true,
          newsletter_subscription: profileData.newsletter_subscription ?? true,
          profile_visibility: profileData.profile_visibility || "public",
          show_email: profileData.show_email ?? false,
          show_phone: profileData.show_phone ?? false,
          show_activity: profileData.show_activity ?? true,
        });
      }

      // Check 2FA status
      const { data: { factors } } = await supabase.auth.mfa.listFactors();
      setTwoFactorEnabled(factors && factors.length > 0);

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
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

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Profile photo updated!");

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          bio: profile.bio,
          preferred_location: profile.preferred_location,
          preferred_property_types: profile.preferred_property_types,
          min_price: profile.min_price,
          max_price: profile.max_price,
          min_bedrooms: profile.min_bedrooms,
          max_bedrooms: profile.max_bedrooms,
          email_notifications: profile.email_notifications,
          push_notifications: profile.push_notifications,
          property_alerts: profile.property_alerts,
          price_drop_alerts: profile.price_drop_alerts,
          saved_property_updates: profile.saved_property_updates,
          newsletter_subscription: profile.newsletter_subscription,
          profile_visibility: profile.profile_visibility,
          show_email: profile.show_email,
          show_phone: profile.show_phone,
          show_activity: profile.show_activity,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setIsDirty(false);
      toast.success("Profile updated successfully!");

    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
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
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully!");

    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || "Failed to change password");
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

  const togglePropertyType = (type: string) => {
    setProfile(prev => {
      const types = prev.preferred_property_types.includes(type)
        ? prev.preferred_property_types.filter(t => t !== type)
        : [...prev.preferred_property_types, type];
      return { ...prev, preferred_property_types: types };
    });
    setIsDirty(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Photo
              </CardTitle>
              <CardDescription>Upload your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    {uploading ? (
                      <Upload className="w-6 h-6 text-white animate-bounce" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <input
                    id="avatar-upload"
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
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Click on the avatar to upload a new photo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or WEBP. Max size 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => handleProfileChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    placeholder="+254 712 345 678"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {joinedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location & Property Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Location & Property Preferences
              </CardTitle>
              <CardDescription>Set your property search preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_location">Preferred Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground z-10" />
                  <Select
                    value={profile.preferred_location}
                    onValueChange={(value) => handleProfileChange('preferred_location', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your preferred city" />
                    </SelectTrigger>
                    <SelectContent>
                      {KENYAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Property Types</Label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={profile.preferred_property_types.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => togglePropertyType(type)}
                      className="transition-all"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_price">Min Price (KES)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="min_price"
                      type="number"
                      value={profile.min_price}
                      onChange={(e) => handleProfileChange('min_price', e.target.value)}
                      placeholder="e.g., 5000000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_price">Max Price (KES)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="max_price"
                      type="number"
                      value={profile.max_price}
                      onChange={(e) => handleProfileChange('max_price', e.target.value)}
                      placeholder="e.g., 15000000"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_bedrooms">Min Bedrooms</Label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="min_bedrooms"
                      type="number"
                      value={profile.min_bedrooms}
                      onChange={(e) => handleProfileChange('min_bedrooms', e.target.value)}
                      placeholder="e.g., 2"
                      className="pl-10"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_bedrooms">Max Bedrooms</Label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="max_bedrooms"
                      type="number"
                      value={profile.max_bedrooms}
                      onChange={(e) => handleProfileChange('max_bedrooms', e.target.value)}
                      placeholder="e.g., 5"
                      className="pl-10"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Receive notifications via email
                  </div>
                </div>
                <Switch
                  checked={profile.email_notifications}
                  onCheckedChange={(checked) => handleProfileChange('email_notifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Push Notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Receive push notifications on your device
                  </div>
                </div>
                <Switch
                  checked={profile.push_notifications}
                  onCheckedChange={(checked) => handleProfileChange('push_notifications', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Property Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Get notified about new listings matching your preferences
                  </div>
                </div>
                <Switch
                  checked={profile.property_alerts}
                  onCheckedChange={(checked) => handleProfileChange('property_alerts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Price Drop Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Get notified when properties reduce their price
                  </div>
                </div>
                <Switch
                  checked={profile.price_drop_alerts}
                  onCheckedChange={(checked) => handleProfileChange('price_drop_alerts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Saved Property Updates</div>
                  <div className="text-xs text-muted-foreground">
                    Updates about your saved properties
                  </div>
                </div>
                <Switch
                  checked={profile.saved_property_updates}
                  onCheckedChange={(checked) => handleProfileChange('saved_property_updates', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Newsletter Subscription</div>
                  <div className="text-xs text-muted-foreground">
                    Receive our monthly newsletter with market insights
                  </div>
                </div>
                <Switch
                  checked={profile.newsletter_subscription}
                  onCheckedChange={(checked) => handleProfileChange('newsletter_subscription', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your privacy and visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile_visibility">Profile Visibility</Label>
                <Select
                  value={profile.profile_visibility}
                  onValueChange={(value) => handleProfileChange('profile_visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="private">Private - Only you can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Show Email in Profile</div>
                  <div className="text-xs text-muted-foreground">
                    Allow others to see your email address
                  </div>
                </div>
                <Switch
                  checked={profile.show_email}
                  onCheckedChange={(checked) => handleProfileChange('show_email', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Show Phone in Profile</div>
                  <div className="text-xs text-muted-foreground">
                    Allow others to see your phone number
                  </div>
                </div>
                <Switch
                  checked={profile.show_phone}
                  onCheckedChange={(checked) => handleProfileChange('show_phone', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Show Activity</div>
                  <div className="text-xs text-muted-foreground">
                    Display your activity on the platform
                  </div>
                </div>
                <Switch
                  checked={profile.show_activity}
                  onCheckedChange={(checked) => handleProfileChange('show_activity', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Email Status</div>
                  <div className="flex items-center gap-2">
                    {user?.email_confirmed_at ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-orange-500">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Account Type</div>
                  <div className="text-sm font-medium capitalize">Buyer</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Member Since</div>
                  <div className="text-sm font-medium">{joinedDate}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Last Login</div>
                  <div className="text-sm font-medium">{lastLogin}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification Agent */}
          {user && <DocumentVerification userId={user.id} />}

          {/* Security Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
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
                      placeholder="Enter new password"
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
                    variant="outline"
                    className="w-full"
                    disabled={!passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={!isDirty || saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
