function formatTime(iso) {
  return iso;
}

// slots: [{ start_time, available }]
export default function SlotPicker({ date, onDateChange, slots, selected, onSelect }) {
  return (
    <div>
      <label>
        Date:{" "}
        <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
      </label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
        {slots.length === 0 && <p>No slots for this date.</p>}
        {slots.map((slot) => {
          const isSelected = selected === slot;
          return (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              style={{
                padding: "6px 10px",
                border: isSelected ? "2px solid #2a9d8f" : "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: isSelected ? "#e0f7f4" : "#fff",
                color: "#000",
                cursor: "pointer" ,
              }}
            >
              {formatTime(slot)}
            </button>
          );
        })}
      </div>
    </div>
  );
}