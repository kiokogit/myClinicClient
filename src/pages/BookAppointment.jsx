import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDoctorSlots } from "../api/doctors";
import { createBooking } from "../api/bookings";
import SlotPicker from "../components/SlotPicker";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    setError("");
    getDoctorSlots(doctorId, date)
      .then(setSlots)
      .catch(() => setError("Could not load slots for this date."))
      .finally(() => setLoading(false));
  }, [doctorId, date]);

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      await createBooking({ doctor: doctorId, start_time: `${date} ${selected}`, remarks });
      navigate("/patient");
    } catch {
      setError("Booking failed. That slot may have just been taken — try another.");
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      <h2>Book Appointment</h2>
      <Link to="/patient">← Back to dashboard</Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading slots...</p>
      ) : (
        <SlotPicker
          date={date}
          onDateChange={setDate}
          slots={slots}
          selected={selected}
          onSelect={setSelected}
        />
      )}

      {selected && (
        <div style={{ marginTop: "16px" }}>
          <textarea
            placeholder="Remarks (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
          />
          <button onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}