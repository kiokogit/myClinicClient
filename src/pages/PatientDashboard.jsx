import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getDoctors } from "../api/doctors";
import { getMyBookings } from "../api/bookings";
import { getMyProfile } from "../api/users";
import DoctorCard from "../components/DoctorCard";
import BookingsTable from "../components/BookingsTable";
import UserInfoCard from "../components/UserInfoCard";

export default function PatientDashboard() {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      try {
        const [doctorsData, bookingsData, profileData] = await Promise.all([
          getDoctors(),
          getMyBookings(),
          getMyProfile(),
        ]);
        setDoctors(doctorsData);
        setBookings(bookingsData);
        setProfile(profileData);
      } catch {
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  async function refreshBookings() {
    try {
      const bookingsData = await getMyBookings();
      setBookings(bookingsData);
    } catch {
      setError("Could not refresh bookings.");
    }
  }

  // Map of doctor id -> doctor object, used to resolve names in the bookings table
  const doctorsById = Object.fromEntries(doctors.map((d) => [d.id, d]));

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Patient Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginTop: "24px" }}>
        <h3>My Info</h3>
        <UserInfoCard profile={profile} />
      </section>


      <section style={{ marginTop: "24px" }}>
        <h3>My Bookings</h3>
        <BookingsTable bookings={bookings} doctorsById={doctorsById} onChanged={refreshBookings} />
      </section>

      <section style={{ marginTop: "24px" }}>
        <h3>Doctors</h3>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </section>

    </div>
  );
}