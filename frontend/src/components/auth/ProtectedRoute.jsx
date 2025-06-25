// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../customUI/Loader";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Loading your profile..." overlay />;
  }

  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          from: location.pathname,
          message: "You must be logged in first.",
        }}
      />
    );
  }

  return children || <Outlet />;
}
