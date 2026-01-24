import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

// Returns the correct dashboard path based on user role
function getDashboardForRole(role: string | null): string {
  switch (role) {
    case "supplier":
      return "/supplier/dashboard";
    case "internal_ops":
    case "admin":
      return "/admin/dashboard";
    case "client":
    default:
      return "/client/dashboard";
  }
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role doesn't match allowed roles → redirect to their own dashboard
  if (role && !allowedRoles.includes(role)) {
    const correctDashboard = getDashboardForRole(role);
    return <Navigate to={correctDashboard} replace />;
  }

  return <>{children}</>;
}

export { getDashboardForRole };
