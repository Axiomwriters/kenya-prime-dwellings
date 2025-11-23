import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MyListings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Link to="/agent/listings/new">
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Button>
        </Link>
      </div>
      <div className="glass-card rounded-xl p-12 text-center">
        <p className="text-muted-foreground">No listings yet. Create your first listing to get started.</p>
      </div>
    </div>
  );
}
