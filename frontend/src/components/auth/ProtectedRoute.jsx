// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) {
    // Redirect to /auth, but remember where we came from
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
