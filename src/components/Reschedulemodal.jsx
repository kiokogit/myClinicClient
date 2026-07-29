import { useEffect, useState } from "react";
import { getDoctorSlots } from "../api/doctors";
import { rescheduleBooking } from "../api/bookings";
import SlotPicker from "./SlotPicker";

function today() {
  return new Date().toISOString().split("T")[0];
}

// props: booking (the appointment being rescheduled), onClose, onDone (refresh callback)
export default function RescheduleModal({ booking, onClose, onDone }) {
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
    getDoctorSlots(booking.doctor, date)
      .then(setSlots)
      .catch(() => setError("Could not load slots for this date."))
      .finally(() => setLoading(false));
  }, [booking.doctor, date]);

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      await rescheduleBooking(booking.id, { start_time: `${date} ${selected}`, remarks });
      onDone();
      onClose();
    } catch {
      setError("Reschedule failed. That slot may already be taken.");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "400px" }}>
        <h3>Reschedule Appointment</h3>
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

        <textarea
          placeholder="Reason for rescheduling (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={2}
          style={{ width: "100%", marginTop: "12px" }}
        />

        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button onClick={handleConfirm} disabled={!selected || submitting}>
            {submitting ? "Saving..." : "Confirm New Time"}
          </button>
          <button onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}