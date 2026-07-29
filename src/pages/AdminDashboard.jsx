import { useAuth } from "../auth/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Admin / HR Dashboard</h2>
      <p>Logged in as: {user?.email}</p>
      <button onClick={logout}>Logout</button>
      {/* TODO: manage doctors, schedules, all appointments, all users */}
    </div>
  );
}
