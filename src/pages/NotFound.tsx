import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background animate-fade-in">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/20">
            <Home className="w-16 h-16 text-primary" />
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-foreground">404</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4">Oops! Page not found</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button 
            className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
