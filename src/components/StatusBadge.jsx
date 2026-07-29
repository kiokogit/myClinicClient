const COLORS = {
  PENDING: "#b58900",
  CONFIRMED: "#2a9d8f",
  CANCELLED: "#c0392b",
  FULFILLED: "#2e7d32",
};

export default function StatusBadge({ status }) {
  const color = COLORS[status] || "#666";
  return (
    <span
      style={{
        color: "#fff",
        backgroundColor: color,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.8em",
      }}
    >
      {status}
    </span>
  );
}
