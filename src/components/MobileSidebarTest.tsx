import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Smartphone, Monitor, Eye, EyeOff } from "lucide-react";

export function MobileSidebarTest() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
    console.log('MobileSidebarTest: Manual toggle called, new state:', !isMobileOpen);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Mobile Sidebar Test</h2>
        <p className="text-muted-foreground">
          Use this test to verify mobile sidebar functionality when the hamburger menu isn't working.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Manual Test</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              1. Resize your browser to mobile width (< 1024px)
            </p>
            <p className="text-sm text-muted-foreground">
              2. Click the button below to toggle sidebar
            </p>
            <p className="text-sm text-muted-foreground">
              3. Check if sidebar appears from left
            </p>
            <p className="text-sm text-muted-foreground">
              4. Verify backdrop dimming effect
            </p>
          </div>

          <Button 
            onClick={toggleSidebar}
            className="w-full"
          >
            {isMobileOpen ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Sidebar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Sidebar
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Debug Info</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Current State:</span>
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isMobileOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isMobileOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Instructions:</span>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Open browser dev tools</li>
                <li>• Check Console tab for debug logs</li>
                <li>• Look for "AppSidebar: isMobileOpen =" messages</li>
                <li>• Verify state changes when clicking buttons</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Expected Behavior</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Menu className="w-4 h-4 text-primary" />
            <span>Hamburger menu visible on mobile</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Eye className="w-4 h-4 text-primary" />
            <span>Sidebar slides in from left</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <EyeOff className="w-4 h-4 text-primary" />
            <span>Backdrop dims background</span>
          </div>
        </div>
      </div>
    </div>
  );
}