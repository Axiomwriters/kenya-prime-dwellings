import { Card } from "@/components/ui/card";
import { CheckCircle, Smartphone, Monitor, ArrowRight } from "lucide-react";

export function SidebarTestGuide() {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Responsive Sidebar Test Guide</h2>
        <p className="text-muted-foreground">
          Test the new responsive sidebar functionality across different screen sizes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Desktop Tests */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Desktop (≥ 1024px)</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Sidebar shows full width (260px) by default</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Collapse button toggles to icon-only mode (80px)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Text labels fade out smoothly when collapsed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Main content adjusts automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Submenus work in both modes</span>
            </div>
          </div>
        </div>

        {/* Mobile Tests */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Mobile (< 1024px)</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Hamburger menu appears in header</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Sidebar slides in from left as overlay</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Background dims when sidebar is open</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Click outside closes sidebar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Close button (X) works</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>✓ Navigation works properly</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Key Features Implemented</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Mobile Drawer Pattern</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Desktop Collapsible</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Smooth Transitions</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Layout Integrity</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Touch Targets</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Z-Index Management</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <ArrowRight className="w-4 h-4" />
        <span>Resize your browser window to test responsive behavior</span>
      </div>
    </Card>
  );
}