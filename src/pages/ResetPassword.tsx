import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock reset flow
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Reset link sent to your email!");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1e33] to-[#1a2942] dark animate-fade-in">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-glow/20 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
            <Home className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
            <span className="text-2xl font-bold text-white">PropertyHub</span>
          </Link>

          {/* Glass card */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary-glow/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative bg-card/10 backdrop-blur-xl border border-border/20 rounded-2xl p-8 shadow-2xl">
              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Reset Password
                    </h1>
                    <p className="text-muted-foreground">
                      Enter your email and we'll send you a reset link
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/10 backdrop-blur-sm border-border/20 focus:border-primary focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-scale-in">
                      <Mail className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Check Your Email
                    </h2>
                    <p className="text-muted-foreground">
                      We've sent a password reset link to<br />
                      <span className="text-foreground font-medium">{email}</span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder
                  </p>
                </div>
              )}

              {/* Back to login */}
              <div className="mt-6 pt-6 border-t border-border/20">
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
