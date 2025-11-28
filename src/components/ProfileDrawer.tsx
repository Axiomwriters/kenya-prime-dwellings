import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Home,
  Heart,
  Settings,
  LogOut,
  X,
  CheckCircle,
  Calendar,
  Mail,
  ChevronRight,
  Camera,
  Upload,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { uploadFile, generateFileName, compressImage } from "@/utils/uploadHelpers";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDrawer({ open, onOpenChange }: ProfileDrawerProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    myListings: 0,
    savedProperties: 0,
    reviews: 0
  });

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "user@example.com";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  // Format joined date
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : user?.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : "January 2024";

  useEffect(() => {
    if (user && open) {
      fetchProfileData();
    }
  }, [user, open]);

  const fetchProfileData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setAvatarUrl(profileData.avatar_url || "");
      }

      // Fetch user stats (saved properties and reviews)
      const { count: savedCount } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      setStats({
        myListings: 0, // Not applicable for regular users
        savedProperties: savedCount || 0,
        reviews: 0 // TODO: Implement reviews
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);

      // Compress image
      const compressedFile = await compressImage(file);

      // Generate unique filename
      const fileName = generateFileName(compressedFile, `avatar-${user?.id}`);

      // Upload to Supabase storage
      const filePath = await uploadFile(compressedFile, 'avatars', fileName);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
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

  const handleLogout = async () => {
    await signOut();
    onOpenChange(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className="h-full w-full sm:w-[420px] ml-auto glass-card border-l border-primary/20 bg-background/95 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 50%, hsl(var(--card)) 100%)',
        }}
      >
        <DrawerHeader className="relative border-b border-primary/10 pb-6">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>

          <div className="flex flex-col items-center pt-4">
            {/* Large Avatar with Upload */}
            <div className="relative mb-4 group">
              <div className="absolute inset-0 bg-gradient-hero rounded-full blur-xl opacity-40 animate-pulse"></div>
              <Avatar className="relative w-24 h-24 border-4 border-primary/30 ring-4 ring-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userName} />
                ) : null}
                <AvatarFallback className="bg-gradient-hero text-white font-bold text-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              {/* Upload Overlay */}
              <div
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => document.getElementById('avatar-upload-drawer')?.click()}
              >
                {uploading ? (
                  <Upload className="w-6 h-6 text-white animate-bounce" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
              <input
                id="avatar-upload-drawer"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
                disabled={uploading}
              />

              {profile?.verification_status === 'approved' && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-lg border-2 border-background">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <DrawerTitle className="text-2xl font-bold text-foreground mb-1">
              {userName}
            </DrawerTitle>
            <DrawerDescription className="flex items-center gap-2 text-muted-foreground mb-2">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-[300px]">{userEmail}</span>
            </DrawerDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined {joinedDate}</span>
            </div>
            {user?.email_confirmed_at && (
              <Badge
                variant="outline"
                className="mt-3 bg-primary/10 text-primary border-primary/30"
              >
                Verified User
              </Badge>
            )}
          </div>
        </DrawerHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-6 border-b border-primary/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.savedProperties}</div>
            <div className="text-xs text-muted-foreground mt-1">Saved Properties</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.reviews}</div>
            <div className="text-xs text-muted-foreground mt-1">Reviews</div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => handleNavigation('/profile/settings')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Edit className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Edit Profile</div>
                <div className="text-xs text-muted-foreground">Update your information</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => handleNavigation('/saved-properties')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Saved Properties</div>
                <div className="text-xs text-muted-foreground">Your favorite homes</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between h-auto py-4 px-4 hover:bg-primary/5 hover:text-primary transition-all group"
            onClick={() => handleNavigation('/account/settings')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Account Settings</div>
                <div className="text-xs text-muted-foreground">Privacy & preferences</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        </div>


      </DrawerContent>
    </Drawer>
  );
}
