function formatDate(d) {
  return new Date(d).toLocaleDateString([], { dateStyle: "medium" });
}

function formatTime(t) {
  // t is "HH:MM:SS"
  return t.slice(0, 5);
}

export default function ScheduleList({ schedules }) {
  if (!schedules.length) return <p>No schedule set.</p>;

  return (
    <ul style={{ paddingLeft: "18px" }}>
      {schedules.map((s) => (
        <li key={s.id}>
          {formatDate(s.start_date)}
          {s.start_date !== s.end_date && ` – ${formatDate(s.end_date)}`}
          {"  "}
          {formatTime(s.day_start_time)}–{formatTime(s.day_end_time)}
          {s.remarks && <span style={{ color: "#666" }}> ({s.remarks})</span>}
        </li>
      ))}
    </ul>
  );
}