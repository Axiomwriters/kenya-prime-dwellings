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
import { Phone, MapPin, FileText, Shield, Save, Loader2, CheckCircle, AlertCircle, Clock, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, generateFileName, compressImage } from "@/utils/uploadHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your agent profile and verification status
        </p>
      </div>

      {/* Profile Header */}
      <div className="glass-card rounded-xl p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-primary/30">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-gradient-hero text-white text-3xl font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              <Upload className="w-4 h-4" />
            </Button>
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

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{profile.full_name || user?.email}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
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
                {verification.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                {verification.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {verification.status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
                {verification.status
                  ? verification.status.charAt(0).toUpperCase() + verification.status.slice(1)
                  : 'Not Verified'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="glass-card rounded-xl p-6 space-y-4 border border-primary/20">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" />
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name / Agency Name</Label>
            <Input
              value={profile.full_name}
              onChange={(e) => handleProfileChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="glass-input"
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              placeholder="+254 712 345 678"
              className="glass-input"
            />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input
              type="tel"
              value={profile.whatsapp}
              onChange={(e) => handleProfileChange('whatsapp', e.target.value)}
              placeholder="+254 712 345 678"
              className="glass-input"
            />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="glass-input opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed here. Go to Settings.
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="glass-card rounded-xl p-6 space-y-4 border border-primary/20">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>County</Label>
            <Select value={profile.county} onValueChange={(value) => handleProfileChange('county', value)}>
              <SelectTrigger className="glass-input">
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
              className="glass-input"
            />
          </div>
          <div>
            <Label>Specific Area</Label>
            <Input
              value={profile.town}
              onChange={(e) => handleProfileChange('town', e.target.value)}
              placeholder="e.g., Westlands"
              className="glass-input"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="glass-card rounded-xl p-6 space-y-4 border border-primary/20">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          About Me / Agency
        </h3>

        <Textarea
          value={profile.bio}
          onChange={(e) => handleProfileChange('bio', e.target.value)}
          placeholder="Tell potential clients about yourself and your experience in real estate..."
          rows={6}
          maxLength={500}
          className="glass-input resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
          {profile.bio.length}/500 characters
        </p>
      </div>

      {/* Verification Documents */}
      <div className="glass-card rounded-xl p-6 space-y-4 border border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Identity Verification
          </h3>
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

        {verification.status === 'pending' && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <Clock className="w-4 h-4 text-yellow-500" />
            <AlertTitle>Verification Pending</AlertTitle>
            <AlertDescription>
              Your documents are under review. This usually takes 24-48 hours.
            </AlertDescription>
          </Alert>
        )}

        {verification.status === 'rejected' && (
          <Alert variant="destructive">
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
            className="w-full bg-primary hover:bg-primary/90"
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
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-xl border-t border-primary/20 flex items-center justify-between rounded-xl">
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
