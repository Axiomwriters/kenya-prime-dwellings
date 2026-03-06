// ADD at top of file:
import { useUser } from '@clerk/clerk-react';

// INSIDE DashboardHome():
function DashboardHome() {
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || 'Professional';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Karibu, {displayName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your professional network today.
          </p>
        </div>
      </div>
      {/* rest of the component stays the same */}
      </div>
);
}
export default DashboardHome;
