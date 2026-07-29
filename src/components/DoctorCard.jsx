import { useNavigate } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const fullName = [doctor.first_name, doctor.other_names, doctor.last_name]
    .filter((n) => n && n !== "None")
    .join(" ");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "12px", marginBottom: "10px" }}>
      <strong>Dr. {fullName}</strong>
      <p style={{ margin: "4px 0", fontSize: "0.9em", color: "#555" }}>
        {doctor.gender ? `${doctor.gender} · ` : ""}
        {doctor.username}
      </p>
      <button onClick={() => navigate(`/patient/book/${doctor.id}`)}>
        Book Appointment
      </button>
    </div>
  );
}
