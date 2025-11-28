import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileUpload } from "@/components/FileUpload";
import { Phone, MapPin, FileText, Shield, Save, Loader2, CheckCircle, AlertCircle, Clock, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, generateFileName, compressImage } from "@/utils/uploadHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COUNTIES = [
  "Nairobi", "Kiambu", "Kajiado", "Machakos", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu",
  "Kakamega", "Bungoma", "Kericho", "Nyeri", "Meru", "Embu", "Kilifi", "Kwale"
];

export default function AgentProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    county: "",
    city: "",
    town: "",
    bio: "",
    avatar_url: "",
  });
  const [verification, setVerification] = useState({
    id_front_url: "",
    id_back_url: "",
    status: null as 'pending' | 'approved' | 'rejected' | null,
    rejection_reason: "",
  });

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
          whatsapp: profileData.whatsapp || "",
          county: profileData.county || "",
          city: profileData.city || "",
          town: profileData.town || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
        });
      }

      const { data: verificationData } = await supabase
        .from('agent_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (verificationData) {
        setVerification({
          id_front_url: verificationData.id_front_url || "",
          id_back_url: verificationData.id_back_url || "",
          status: verificationData.status,
          rejection_reason: verificationData.rejection_reason || "",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file);
      const fileName = generateFileName(file.name);
      const path = `${user?.id}/${fileName}`;

      const { url, error } = await uploadFile('avatars', path, compressed);

      if (error || !url) {
        toast.error("Failed to upload avatar");
        return null;
      }

      setProfile(prev => ({ ...prev, avatar_url: url }));
      setIsDirty(true);
      return url;
    } catch (error) {
      toast.error("Failed to upload avatar");
      return null;
    }
  };

  const handleIdUpload = async (file: File, type: 'front' | 'back') => {
    try {
      const fileName = generateFileName(file.name);
      const path = `${user?.id}/${type}-${fileName}`;

      const { url, error } = await uploadFile('id-documents', path, file);

      if (error || !url) {
        toast.error(`Failed to upload ID ${type}`);
        return null;
      }

      setVerification(prev => ({
        ...prev,
        [`id_${type}_url`]: url,
      }));
      return url;
    } catch (error) {
      toast.error(`Failed to upload ID ${type}`);
      return null;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...profile,
          email: user?.email,
        });

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!verification.id_front_url || !verification.id_back_url) {
      toast.error("Please upload both ID documents");
      return;
    }

    try {
      const { error } = await supabase
        .from('agent_verifications')
        .upsert({
          user_id: user?.id,
          id_front_url: verification.id_front_url,
          id_back_url: verification.id_back_url,
          status: 'pending',
        });

      if (error) throw error;

      setVerification(prev => ({ ...prev, status: 'pending' }));
      toast.success("Verification submitted for review");
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast.error("Failed to submit verification");
    }
  };

  const userInitials = profile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 overflow-x-hidden">
      {/* Header Banner */}
      <div className="relative mb-12">
        <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 w-full rounded-xl" />

        <div className="absolute -bottom-12 left-4 md:left-8 right-4 md:right-auto flex items-end gap-4 md:gap-6">
          <div className="relative group shrink-0">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl md:text-3xl font-bold">
                {userInitials || "A"}
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
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
            />
          </div>

          <div className="mb-2 min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">{profile.full_name || "Agent Profile"}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <Badge
                variant={
                  verification.status === 'approved'
                    ? 'default'
                    : verification.status === 'pending'
                      ? 'secondary'
                      : verification.status === 'rejected'
                        ? 'destructive'
                        : 'outline'
                }
                className={`${verification.status === 'approved' ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : ""} shrink-0 w-fit`}
              >
                {verification.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                {verification.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {verification.status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                {verification.status
                  ? verification.status.charAt(0).toUpperCase() + verification.status.slice(1)
                  : 'Not Verified'}
              </Badge>
              <span className="text-sm text-muted-foreground truncate">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        {/* Left Column - Contact & Location */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name / Agency Name</Label>
                <Input
                  value={profile.full_name}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+254 712 345 678"
                />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input
                  type="tel"
                  value={profile.whatsapp}
                  onChange={(e) => handleProfileChange('whatsapp', e.target.value)}
                  placeholder="+254 712 345 678"
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed here.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>County</Label>
                <Select value={profile.county} onValueChange={(value) => handleProfileChange('county', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>City / Town</Label>
                <Input
                  value={profile.city}
                  onChange={(e) => handleProfileChange('city', e.target.value)}
                  placeholder="e.g., Nairobi"
                />
              </div>
              <div>
                <Label>Specific Area</Label>
                <Input
                  value={profile.town}
                  onChange={(e) => handleProfileChange('town', e.target.value)}
                  placeholder="e.g., Westlands"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Bio & Verification */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                About Me / Agency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                placeholder="Tell potential clients about yourself and your experience in real estate..."
                rows={6}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-2">
                {profile.bio.length}/500 characters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  Identity Verification
                </CardTitle>
                <Badge
                  variant={
                    verification.status === 'approved'
                      ? 'default'
                      : verification.status === 'pending'
                        ? 'secondary'
                        : verification.status === 'rejected'
                          ? 'destructive'
                          : 'outline'
                  }
                >
                  {verification.status
                    ? verification.status.charAt(0).toUpperCase() + verification.status.slice(1)
                    : 'Not Started'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {verification.status === 'pending' && (
                <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-4">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <AlertTitle>Verification Pending</AlertTitle>
                  <AlertDescription>
                    Your documents are under review. This usually takes 24-48 hours.
                  </AlertDescription>
                </Alert>
              )}

              {verification.status === 'rejected' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Verification Rejected</AlertTitle>
                  <AlertDescription>{verification.rejection_reason}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="National ID (Front)"
                  accept="image/*,.pdf"
                  maxSize={10}
                  onUpload={(file) => handleIdUpload(file, 'front')}
                  preview={verification.id_front_url}
                  disabled={verification.status === 'approved'}
                />
                <FileUpload
                  label="National ID (Back)"
                  accept="image/*,.pdf"
                  maxSize={10}
                  onUpload={(file) => handleIdUpload(file, 'back')}
                  preview={verification.id_back_url}
                  disabled={verification.status === 'approved'}
                />
              </div>

              {verification.status !== 'approved' && (
                <Button
                  className="w-full mt-4"
                  onClick={handleSubmitVerification}
                  disabled={
                    !verification.id_front_url ||
                    !verification.id_back_url ||
                    verification.status === 'pending'
                  }
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Submit for Verification
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-xl border-t flex items-center justify-between rounded-xl shadow-lg z-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isDirty ? (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span>You have unsaved changes</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>All changes saved</span>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => fetchProfile()}
            disabled={!isDirty}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? (
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
  );
}
