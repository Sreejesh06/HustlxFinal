import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import {
  AlertTriangle,
  LayoutDashboard,
  LoaderCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import HomemakerDashboard from "@/components/dashboard/HomemakerDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading, setShowLoginModal } = useAuth();
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  
  // Check authentication status
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setShowLoginModal(true);
        setLocation("/");
      } else {
        setLoadingDashboard(false);
      }
    }
  }, [isAuthenticated, loading, setShowLoginModal, setLocation]);
  
  // Loading state
  if (loading || loadingDashboard) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  // If user role is unknown or invalid
  if (!user?.role || (user.role !== "homemaker" && user.role !== "customer")) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Invalid user role. Please contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Dashboard | EmpowerHer</title>
        <meta name="description" content="Manage your EmpowerHer account, track orders, and view your profile stats." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {user.role === "homemaker" ? (
          <HomemakerDashboard userId={user.id} />
        ) : (
          <CustomerDashboard userId={user.id} />
        )}
      </div>
    </>
  );
}
