import { useState } from "react";
import { Heart, Phone, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function TopHeaderBar() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <div
      className={cn(
        "w-full bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300 ease-in-out z-[70]",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 text-sm">
          {/* Left side - Phone */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:+254700000000"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+254 700 000 000</span>
            </a>
          </div>

          {/* Right side - Language & Wishlist */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-primary"
                >
                  <span className="mr-1">{selectedLanguage.flag}</span>
                  <span className="hidden sm:inline mr-1">{selectedLanguage.name}</span>
                  <Globe className="w-3 h-3 sm:hidden mr-1" />
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Wishlist</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}