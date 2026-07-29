import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMyProfile } from "../api/users";
import { getMySchedules } from "../api/schedules";
import { getDoctorSlots } from "../api/doctors";
import { getMyBookings } from "../api/bookings";
import UserInfoCard from "../components/UserInfoCard";
import ScheduleList from "../components/ScheduleList";
import AvailabilitySlots from "../components/AvailabilitySlots";
import AppointmentsTable from "../components/AppointmentsTable";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function DoctorDashboard() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      try {
        const [profileData, schedulesData, appointmentsData, usersData] = await Promise.all([
          getMyProfile(),
          getMySchedules(),
          getMyBookings(),
        ]);
        setProfile(profileData);
        setSchedules(schedulesData);
        setAppointments(appointmentsData);
      } catch {
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    if(profile) {
        getDoctorSlots(profile?.id, date)
      .then(setSlots)
      .catch(() => setSlots([]));
    }
    
  }, [date, profile]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Doctor Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginTop: "24px" }}>
        <h3>My Profile</h3>
        <UserInfoCard profile={profile} />
      </section>

      <section style={{ marginTop: "24px" }}>
        <h3>My Schedule</h3>
        <ScheduleList schedules={schedules} />
      </section>

      <section style={{ marginTop: "24px" }}>
        <h3>My Available Slots</h3>
        <AvailabilitySlots date={date} onDateChange={setDate} slots={slots} />
      </section>

      <section style={{ marginTop: "24px" }}>
        <h3>Booked Appointments</h3>
        <AppointmentsTable appointments={appointments} usersById={usersById} />
      </section>
    </div>
  );
}