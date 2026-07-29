import { useState } from "react";
import StatusBadge from "./StatusBadge";
import RescheduleModal from "./RescheduleModal";
import { cancelBooking } from "../api/bookings";
import moment from 'moment'

function formatDoctorName(doctor) {
  if (!doctor) return "Unknown doctor";
  const parts = [doctor.first_name, doctor.other_names, doctor.last_name].filter(
    (n) => n && n !== "None"
  );
  return `Dr. ${parts.join(" ")}`;
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const FINAL_STATUSES = ["CANCELLED", "EXPIRED", "COMPLETED"];

// props: bookings, doctorsById, onChanged (call after cancel/reschedule to refresh data)
export default function BookingsTable({ bookings, doctorsById, onChanged }) {
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  async function handleCancel(booking) {
    const remarks = window.prompt("Reason for cancelling (optional):", "") || "";
    setCancellingId(booking.id);
    try {
      await cancelBooking(booking.id, remarks);
      onChanged();
    } catch {
      window.alert("Could not cancel this appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  }

  if (!bookings.length) return <p>No bookings yet.</p>;

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Time to</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const isFinal = FINAL_STATUSES.includes(b.status);
            return (
              <tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{formatDoctorName(b.doctor)}</td>
                <td>{formatDateTime(b.start_time)}</td>
                <td>{moment(b.start_time).fromNow()}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>
                  {!isFinal && (
                    <>
                      <button
                        onClick={() => setReschedulingBooking(b)}
                        style={{ marginRight: "6px" }}
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(b)}
                        disabled={cancellingId === b.id}
                      >
                        {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {reschedulingBooking && (
        <RescheduleModal
          booking={reschedulingBooking}
          onClose={() => setReschedulingBooking(null)}
          onDone={onChanged}
        />
      )}
    </>
  );
}