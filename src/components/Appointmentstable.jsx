import StatusBadge from "./StatusBadge";
import moment from 'moment'

function formatPatientName(patient) {
  if (!patient) return "Unknown patient";
  const parts = [patient.first_name, patient.other_names, patient.last_name].filter(
    (n) => n && n !== "None"
  );
  return parts.join(" ");
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

// props: appointments, usersById (patient id -> user object)
export default function AppointmentsTable({ appointments, usersById }) {
  if (!appointments.length) return <p>No appointments yet.</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
          <th>Patient</th>
          <th>Date & Time</th>
          <th>Time to</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a) => (
          <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
            <td>{formatPatientName(a.patient)}</td>
            <td>{formatDateTime(a.start_time)}</td>
            <td>{moment(a.start_time).fromNow()}</td>
            <td>
              <StatusBadge status={a.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}