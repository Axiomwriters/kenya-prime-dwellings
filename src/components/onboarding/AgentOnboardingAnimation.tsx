import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Lock,
  Camera,
  Phone,
  CheckCircle2,
  ArrowRight,
  Building2,
  BarChart3,
  MessageCircle,
  Play,
  Pause,
  RotateCcw,
  X,
  ChevronRight,
  FileText,
  Home,
  Briefcase,
  Clock,
  Fingerprint,
  Rocket,
  Zap,
  Eye,
  Moon,
  Sun,
} from "lucide-react";

interface OnboardingAnimationProps {
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

type Role = "agent" | "host" | "professional";
type Scene = "intro" | "role" | "signup" | "email" | "id" | "selfie" | "phone" | "success" | "outro";

const ROLE_CONFIG = {
  agent: {
    title: "Real Estate Agent",
    icon: Building2,
    color: "from-emerald-500 to-green-500",
    accentColor: "text-emerald-500",
    bgGradient: "bg-gradient-to-br from-emerald-50 to-green-50",
    description: "List & manage properties",
  },
  host: {
    title: "Airbnb Host",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
    accentColor: "text-blue-500",
    bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    description: "Host vacation rentals",
  },
  professional: {
    title: "Professional",
    icon: Briefcase,
    color: "from-amber-500 to-orange-500",
    accentColor: "text-amber-500",
    bgGradient: "bg-gradient-to-br from-amber-50 to-orange-50",
    description: "Offer property services",
  },
};

export function AgentOnboardingAnimation({
  autoPlay = true,
  loop = false,
  showControls = true,
  onComplete,
  onSkip,
  className,
}: OnboardingAnimationProps) {
  const [currentScene, setCurrentScene] = useState<Scene>("intro");
  const [currentRole, setCurrentRole] = useState<Role>("agent");
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [sceneTime, setSceneTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sceneDuration: Record<Scene, number> = {
    intro: 4000,
    role: 6000,
    signup: 5000,
    email: 4500,
    id: 6000,
    selfie: 5000,
    phone: 5000,
    success: 5000,
    outro: 3500,
  };

  const totalDuration = useMemo(() => 
    Object.values(sceneDuration).reduce((a, b) => a + b, 0), 
    [sceneDuration]
  );

  const sceneOrder: Scene[] = [
    "intro", "role", "signup", "email", "id", "selfie", "phone", "success", "outro",
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const duration = sceneDuration[currentScene];
    const interval = setInterval(() => {
      setSceneTime((prev) => {
        if (prev >= duration) {
          const currentIndex = sceneOrder.indexOf(currentScene);
          if (currentIndex < sceneOrder.length - 1) {
            setCurrentScene(sceneOrder[currentIndex + 1]);
            return 0;
          } else {
            setIsPlaying(false);
            onComplete?.();
            return prev;
          }
        }
        return prev + 50;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, sceneDuration, sceneOrder, onComplete]);

  useEffect(() => {
    const currentProgress =
      sceneOrder
        .slice(0, sceneOrder.indexOf(currentScene))
        .reduce((acc, scene) => acc + sceneDuration[scene], 0) + sceneTime;
    setProgress((currentProgress / totalDuration) * 100);
  }, [currentScene, sceneTime, sceneDuration, sceneOrder, totalDuration]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const config = ROLE_CONFIG[currentRole];
  const RoleIcon = config.icon;

  return (
    <div
      className={cn(
        "relative w-full mx-auto bg-gradient-to-br from-background via-background to-primary/5 rounded-3xl overflow-hidden shadow-2xl border border-border/50",
        "min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scene Content */}
      <div className="relative h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center p-6 sm:p-8 md:p-12">
        {currentScene === "intro" && (
          <IntroScene progress={progress} currentRole={currentRole} setCurrentRole={setCurrentRole} roles={Object.keys(ROLE_CONFIG) as Role[]} />
        )}
        {currentScene === "role" && (
          <RoleScene progress={progress} currentRole={currentRole} setCurrentRole={setCurrentRole} />
        )}
        {currentScene === "signup" && (
          <SignupScene progress={progress} />
        )}
        {currentScene === "email" && (
          <EmailScene progress={progress} />
        )}
        {currentScene === "id" && (
          <IdScene progress={progress} />
        )}
        {currentScene === "selfie" && (
          <SelfieScene progress={progress} />
        )}
        {currentScene === "phone" && (
          <PhoneScene progress={progress} />
        )}
        {currentScene === "success" && (
          <SuccessScene progress={progress} />
        )}
        {currentScene === "outro" && (
          <OutroScene progress={progress} />
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className={cn(
            "flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 bg-background/90 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl",
            "transition-all duration-300",
            isHovered ? "scale-100 opacity-100" : "scale-95 opacity-80"
          )}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={() => {
                setCurrentScene("intro");
                setSceneTime(0);
                setIsPlaying(true);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-all hover:scale-105 border border-border"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Restart</span>
            </button>
            <div className="hidden sm:block w-px h-6 bg-border mx-1" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize font-medium">{currentScene}</span>
              <span className="text-primary">{Math.round((sceneTime / sceneDuration[currentScene]) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Role Badge */}
      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10">
        <div className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium shadow-lg border",
          config.bgGradient,
          "border-transparent"
        )}>
          <RoleIcon className={cn("w-3.5 h-3.5", config.accentColor)} />
          <span className="text-foreground/80">{config.title}</span>
        </div>
      </div>
    </div>
  );
}

// ==================== SCENE COMPONENTS ====================

function IntroScene({ progress, currentRole, setCurrentRole, roles }: { 
  progress: number; 
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  roles: Role[];
}) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      {/* Step Label */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ opacity: progress > 0.05 ? (progress - 0.05) * 5 : 0 }}>
        <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
          Step 1 of 9
        </span>
      </div>

      {/* Main Heading */}
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-2"
        style={{ opacity: progress > 0.15 ? (progress - 0.15) * 3 : 0 }}
      >
        How do you want to join?
      </h2>

      {/* Subtitle */}
      <p
        className="text-sm sm:text-base text-muted-foreground text-center mb-6 sm:mb-8"
        style={{ opacity: progress > 0.2 ? (progress - 0.2) * 3 : 0 }}
      >
        Choose your role to continue
      </p>

      {/* Role Selection Cards */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" style={{ opacity: progress > 0.3 ? (progress - 0.3) * 4 : 0 }}>
        {roles.map((role, index) => {
          const cfg = ROLE_CONFIG[role];
          const Icon = cfg.icon;
          const isSelected = role === currentRole;
          
          return (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={cn(
                "flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-4 rounded-xl border-2 transition-all duration-300 text-left min-w-[200px]",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isSelected ? "bg-primary" : "bg-muted"
              )}>
                <Icon className={cn("w-5 h-5", isSelected ? "text-white" : "text-muted-foreground")} />
              </div>
              <div>
                <p className={cn("font-medium text-sm", isSelected ? "text-primary" : "text-foreground")}>
                  {cfg.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cfg.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoleScene({ progress, currentRole, setCurrentRole }: { 
  progress: number; 
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
}) {
  const roles = Object.keys(ROLE_CONFIG) as Role[];

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4" style={{ opacity: progress > 0.1 ? (progress - 0.1) * 5 : 0 }}>
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Step 1 of 9</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ opacity: progress > 0.15 ? (progress - 0.15) * 3 : 0 }}>
          Choose Your Path
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground" style={{ opacity: progress > 0.2 ? (progress - 0.2) * 3 : 0 }}>
          Select your role to get started
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 md:gap-6 max-w-5xl w-full px-4">
        {roles.map((role, index) => {
          const cfg = ROLE_CONFIG[role];
          const Icon = cfg.icon;
          const isSelected = role === currentRole;
          const cardProgress = Math.max(0, progress - 0.25 - index * 0.1);

          return (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={cn(
                "relative p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all duration-500 text-left group",
                isSelected ? `border-transparent shadow-2xl scale-105 ${cfg.bgGradient}` : "border-border bg-card hover:border-primary/50 hover:shadow-xl"
              )}
              style={{
                transform: cardProgress > 0 ? "translateY(0)" : "translateY(20px)",
                opacity: cardProgress > 0 ? Math.min(cardProgress * 4, 1) : 0,
              }}
            >
              {isSelected && (
                <div className={cn("absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse", `bg-gradient-to-r ${cfg.color}`)}>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={cn("w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4", isSelected ? `bg-gradient-to-r ${cfg.color} shadow-lg` : "bg-muted")}>
                <Icon className={cn("w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8", isSelected ? "text-white" : "text-muted-foreground")} />
              </div>
              <h3 className={cn("font-semibold text-sm sm:text-base md:text-lg mb-1", isSelected ? cfg.accentColor : "text-foreground")}>{cfg.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{cfg.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SignupScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4" style={{ opacity: progress > 0.1 ? (progress - 0.1) * 5 : 0 }}>
          <Rocket className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Step 2 of 9</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Create Your Account</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Enter your details to get started</p>
      </div>

      <div className="w-full max-w-sm md:max-w-md space-y-3 sm:space-y-4">
        {[{ label: "First Name", value: "John", icon: User }, { label: "Last Name", value: "Doe", icon: User }, { label: "Email", value: "john@example.com", icon: Mail }, { label: "Password", value: "••••••••••", strength: true, icon: Lock }].map((field, index) => {
          const fieldProgress = Math.max(0, progress - 0.2 - index * 0.1);
          const Icon = field.icon;
          return (
            <div key={field.label} style={{ transform: fieldProgress > 0 ? "translateY(0)" : "translateY(15px)", opacity: fieldProgress > 0 ? Math.min(fieldProgress * 4, 1) : 0 }}>
              <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 block ml-1">{field.label}</label>
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 bg-background hover:border-primary/50">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Icon className="w-4 h-4 text-muted-foreground" /></div>
                <span className="text-foreground text-sm sm:text-base flex-1">{field.value}</span>
                {field.strength && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-primary" /><div className="w-2 h-2 rounded-full bg-primary" /><div className="w-2 h-2 rounded-full bg-primary" /></div>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmailScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Mail className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Step 3 of 9</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Verify Your Email</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Enter the 6-digit code sent to your email</p>
      </div>

      <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
        {[1, 2, 3, 4, 5, 6].map((num, index) => {
          const isFilled = progress > 0.3 + index * 0.05;
          return (
            <div key={num} className={cn("w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold", isFilled ? "border-primary bg-primary/10 text-primary shadow-lg" : "border-border bg-background text-muted-foreground")}>
              {isFilled ? Math.floor(Math.random() * 9) + 1 : ""}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-primary animate-in fade-in">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium text-sm sm:text-base">Email Verified Successfully!</span>
      </div>
    </div>
  );
}

function IdScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Fingerprint className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Step 4 of 9</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Verify Your Identity</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Upload photos of your ID (front and back)</p>
      </div>

      <div className="flex gap-4 sm:gap-6 md:gap-8">
        {["Front", "Back"].map((side, index) => {
          const isVerified = progress > 0.35 + index * 0.25;
          return (
            <div key={side} className={cn("relative w-28 h-36 sm:w-32 sm:h-40 md:w-40 md:h-48 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center", isVerified ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" : "border-dashed border-border bg-background")}>
              <FileText className={cn("w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3", isVerified ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-xs sm:text-sm font-medium", isVerified ? "text-primary" : "text-muted-foreground")}>ID {side}</span>
              {isVerified && <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 flex items-center gap-2 text-primary">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium text-sm sm:text-base">Identity Verified!</span>
      </div>
    </div>
  );
}

function SelfieScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Camera className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Step 5 of 9</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Take a Selfie</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Position your face within the frame</p>
      </div>

      <div className="relative w-40 h-48 sm:w-44 sm:h-52 md:w-52 md:h-60 rounded-2xl border-4 border-dashed border-primary/30 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/5" style={{ transform: progress > 0.3 ? `scale(${Math.min((progress - 0.3) * 2, 1)})` : "scale(0)", opacity: progress > 0.3 ? Math.min((progress - 0.3) * 4, 1) : 0 }} />
        <div className="absolute inset-4 border-2 border-primary/40 rounded-xl" />
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center" style={{ opacity: progress > 0.6 ? (progress - 0.6) * 5 : 0 }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center shadow-xl"><CheckCircle2 className="w-10 h-10 text-white" /></div>
        </div>
      </div>

      <p className="mt-4 sm:mt-6 text-primary font-medium text-sm sm:text-base">Face Captured Successfully ✓</p>
    </div>
  );
}

function PhoneScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Phone className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Step 6 of 9</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Verify Your Phone</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Enter the OTP sent to your phone</p>
      </div>

      <div className="w-full max-w-xs p-4 rounded-xl border-2 border-border bg-background mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded bg-primary/10 flex items-center justify-center"><span className="text-xs">🇰🇪</span></div>
          <span className="text-foreground font-medium">+254 712 345 678</span>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[1, 2, 3, 4, 5, 6].map((num, index) => {
          const isFilled = progress > 0.4 + index * 0.04;
          return <div key={num} className={cn("w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold", isFilled ? "border-primary bg-primary/10 text-primary shadow-lg" : "border-border bg-background text-muted-foreground")}>{isFilled ? Math.floor(Math.random() * 9) + 1 : ""}</div>;
        })}
      </div>

      <div className="flex items-center gap-2 text-primary">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium text-sm sm:text-base">Phone Verified!</span>
      </div>
    </div>
  );
}

function SuccessScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: ["#16a34a", "#22c55e", "#facc15", "#eab308", "#84cc16"][i % 5], left: `${Math.random() * 100}%`, top: progress > 0.1 ? "-10px" : "100%", transform: `translateY(${progress * (100 + i * 3)}px) rotate(${progress * 720}deg)`, opacity: progress > 0.1 ? 1 : 0, transition: "top 0.8s ease-out" }} />
        ))}
      </div>

      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-primary/30" style={{ transform: progress > 0.1 ? "scale(1)" : "scale(0)" }}>
        <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">Verification Complete!</h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 text-center">Welcome to your agent dashboard</p>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-sm sm:max-w-md">
        {[{ icon: Building2, label: "Properties", value: "0" }, { icon: Eye, label: "Views", value: "0" }, { icon: MessageCircle, label: "Messages", value: "0" }].map((stat, index) => (
          <div key={stat.label} className="bg-background rounded-xl p-3 sm:p-4 md:p-5 shadow-lg border border-border text-center" style={{ transform: progress > 0.4 ? "translateY(0)" : "translateY(20px)", opacity: progress > 0.4 ? 1 : 0, transitionDelay: `${index * 100}ms` }}>
            <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutroScene({ progress }: { progress: number }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="w-32 sm:w-40 md:w-48 mb-6 sm:mb-8 md:mb-10" style={{ transform: progress > 0.1 ? "scale(1)" : "scale(0.8)", opacity: progress > 0.1 ? 1 : 0 }}>
        <img src="/savanah.png" alt="Savanah Dwelling" className="w-full h-auto" />
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 text-center">Start Your Journey</h2>
      <p className="text-sm sm:text-base text-muted-foreground text-center mb-6 sm:mb-8 max-w-md">Join thousands of agents on Kenya's #1 real estate platform</p>

      <button className="group relative px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold rounded-full shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40" style={{ opacity: progress > 0.4 ? (progress - 0.4) * 4 : 0 }}>
        <span className="flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></span>
        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
      </button>

      <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-muted-foreground">savanah-dwelling.co.ke</p>
    </div>
  );
}

export default AgentOnboardingAnimation;
