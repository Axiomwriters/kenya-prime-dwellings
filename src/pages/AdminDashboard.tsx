import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import AdminOverview from "./AdminDashboard/AdminOverview";
import VerificationManagement from "./AdminDashboard/VerificationManagement";
import ListingModeration from "./AdminDashboard/ListingModeration";
import UserManagement from "./AdminDashboard/UserManagement";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/verifications" element={<VerificationManagement />} />
          <Route path="/listings" element={<ListingModeration />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
}
