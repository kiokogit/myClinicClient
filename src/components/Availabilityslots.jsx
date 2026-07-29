export default function AvailabilitySlots({ date, onDateChange, slots }) {
  return (
    <div>
      <label>
        Date:{" "}
        <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
      </label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
        {slots.length === 0 && <p>No available slots for this date.</p>}
        {slots.map((time) => (
          <span
            key={time}
            style={{
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "0.9em",
            }}
          >
            {time}
          </span>
        ))}
      </div>
    </div>
  );
}