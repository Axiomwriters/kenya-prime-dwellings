import { Home, Lock } from "lucide-react";

export default function ResetPasswordEmail() {
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
          {/* Lock icon with glow */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <Lock className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Let's get you back in
          </h1>
          
          <p className="text-center text-muted-foreground mb-8 text-lg">
            We received a request to reset your password. Click the button below to create a new one.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <a
              href="#"
              className="inline-block bg-primary hover:bg-primary-glow text-white font-semibold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Reset Password
            </a>
          </div>

          {/* Alternative link */}
          <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              Or copy and paste this link into your browser:
            </p>
            <p className="text-sm text-primary break-all font-mono">
              https://propertyhub.com/reset-password?token=abc123xyz
            </p>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground text-center">
              If you didn't request a password reset, you can safely ignore this email.
              Your password will remain unchanged.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 border-t border-border p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            This link will expire in 24 hours for security reasons.
          </p>
          <p className="text-xs text-muted-foreground">
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
