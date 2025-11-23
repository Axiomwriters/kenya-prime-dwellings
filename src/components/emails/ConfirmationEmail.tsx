import { Home, CheckCircle2, Shield } from "lucide-react";

export default function ConfirmationEmail() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-glow p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">PropertyHub</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Success icon with glow */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <div className="absolute inset-0 rounded-full">
                  <CheckCircle2 className="w-full h-full text-primary p-3" />
                </div>
                <Shield className="w-8 h-8 text-primary relative z-10" />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Password Updated Successfully!
          </h1>
          
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Your password has been changed successfully. You can now log in with your new password.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <a
              href="#"
              className="inline-block bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              Go to Login
            </a>
          </div>

          {/* Security tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Use a unique password that you don't use on other sites</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Never share your password with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>Update your password regularly for better security</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground text-center">
              If you didn't make this change or believe an unauthorized person has accessed your account,
              please <a href="#" className="text-primary hover:underline">contact support</a> immediately.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 border-t border-border p-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            © 2024 PropertyHub. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
