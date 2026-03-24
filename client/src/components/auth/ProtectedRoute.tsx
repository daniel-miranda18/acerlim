import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CSpinner } from "@coreui/react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.rol?.nombre;
    if (
      !userRole ||
      !allowedRoles.map((r) => r.toLowerCase()).includes(userRole.toLowerCase())
    ) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
