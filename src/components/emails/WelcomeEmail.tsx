import { Home, TrendingUp, Users, MapPin } from "lucide-react";

export default function WelcomeEmail() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        {/* Header with logo */}
        <div className="bg-gradient-to-r from-primary to-primary-glow p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">PropertyHub</span>
          </div>
        </div>

        {/* Hero image/skyline section */}
        <div className="relative h-64 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="flex gap-2 items-end">
              <div className="w-8 h-24 bg-primary/30 rounded-t-lg" />
              <div className="w-8 h-32 bg-primary/40 rounded-t-lg" />
              <div className="w-12 h-40 bg-primary/50 rounded-t-lg" />
              <div className="w-8 h-28 bg-primary/40 rounded-t-lg" />
              <div className="w-8 h-36 bg-primary/30 rounded-t-lg" />
              <div className="w-10 h-32 bg-primary/40 rounded-t-lg" />
              <div className="w-8 h-20 bg-primary/30 rounded-t-lg" />
            </div>
          </div>
          <div className="absolute top-8 right-8">
            <Home className="w-16 h-16 text-primary/30" />
          </div>
          <div className="absolute bottom-8 left-8">
            <Home className="w-12 h-12 text-primary/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Main heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Welcome to Your New Home Base
          </h1>
          
          <p className="text-center text-muted-foreground mb-8 text-lg leading-relaxed">
            Thank you for joining PropertyHub! We're thrilled to have you on board. 
            Get ready to discover Kenya's finest properties and connect with top real estate professionals.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex justify-center mb-2">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">5,000+</div>
              <div className="text-xs text-muted-foreground">Properties</div>
            </div>
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">500+</div>
              <div className="text-xs text-muted-foreground">Expert Agents</div>
            </div>
            <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex justify-center mb-2">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">50+</div>
              <div className="text-xs text-muted-foreground">Locations</div>
            </div>
          </div>

          {/* What's next section */}
          <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-4 text-lg">Get Started:</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <span>Complete your profile to get personalized property recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <span>Browse our curated collection of premium properties across Kenya</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <span>Connect with verified agents who know the market inside out</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-glow text-white font-semibold px-10 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Explore Properties
            </a>
          </div>

          {/* Support section */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Need help getting started? Our support team is here for you.{" "}
              <a href="#" className="text-primary hover:underline">Contact us anytime</a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 border-t border-border p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            You're receiving this email because you created an account on PropertyHub.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            © 2024 PropertyHub. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Unsubscribe</a>
          </div>
        </div>
      </div>
    </div>
  );
}
