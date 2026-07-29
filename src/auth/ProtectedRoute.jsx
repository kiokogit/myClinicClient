import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Usage: <ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  const { user, token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.user_type !== role) return <Navigate to="/login" replace />;

  return children;
}
