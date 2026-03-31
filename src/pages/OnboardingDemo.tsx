import { AgentOnboardingAnimation } from "@/components/onboarding";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles,
  Moon,
  Sun
} from "lucide-react";
import { useState, useEffect } from "react";

export default function OnboardingDemo() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    return () => observer.disconnect();
  }, []);

  const handleComplete = () => {
    console.log("Animation completed!");
  };

  const handleSkip = () => {
    navigate("/sign-up");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    } py-8 sm:py-12 px-3 sm:px-4 md:px-6`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={`text-primary hover:bg-primary/10 ${isDark ? 'text-green-400' : 'text-green-600'} transition-all`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isDark ? 'bg-slate-800/80' : 'bg-white/80'
          } backdrop-blur-md border border-border/50 shadow-lg`}>
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Agent Onboarding Preview
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              }
            }}
            className={`rounded-full ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Animation Container */}
        <div>
          <AgentOnboardingAnimation
            autoPlay={true}
            loop={false}
            showControls={true}
            onComplete={handleComplete}
            onSkip={handleSkip}
            className="border-0"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate("/sign-up")}
            className="w-full sm:w-auto justify-center bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group"
          >
            <span>Go to Sign Up</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/verification")}
            className={`w-full sm:w-auto justify-center ${
              isDark 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-800' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Verification
          </Button>
        </div>
      </div>
    </div>
  );
}
