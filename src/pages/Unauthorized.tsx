import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <ShieldAlert className="w-20 h-20 mx-auto text-destructive" />
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page. Please contact support if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
