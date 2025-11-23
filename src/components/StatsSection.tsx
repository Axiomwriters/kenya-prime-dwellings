import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, MapPin, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export function StatsSection() {
  const stats = [
    {
      icon: Home,
      label: "Properties Listed",
      value: "1,200+",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: Users,
      label: "Trusted Agents",
      value: "200+",
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      icon: MapPin,
      label: "Locations",
      value: "50+",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${heroBackground})` }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge className="bg-success/10 text-success border-success/20 backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Kenya's #1 Property Platform
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            Find Your Perfect{" "}
            <span className="text-primary relative inline-block">
              Home
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-hero rounded-full animate-pulse-glow"></div>
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-md mx-auto mb-2 leading-relaxed">
            Where dreams meet reality in Kenya's finest properties
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Discover premium properties across Kenya with our intelligent platform.
            Connect with trusted agents and find your dream home today.
          </p>
        </div>

        {/* Stats Cards with Glassmorphism */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover animate-slide-up shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${stat.bg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                  
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              </Card>
            );
          })}
        </div>

        {/* Market Growth Badge */}
        <div className="text-center mt-8 animate-fade-in">
          <Badge className="bg-success/10 text-success border-success/20 px-4 py-2 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Growing Market - Join thousands of satisfied customers
          </Badge>
        </div>
      </div>
    </section>
  );
}