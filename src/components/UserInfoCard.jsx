export default function UserInfoCard({ profile }) {
  if (!profile) return null;
  const fullName = [profile.first_name, profile.other_names, profile.last_name]
    .filter((n) => n && n !== "None")
    .join(" ");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "12px" }}>
      <p style={{ margin: "2px 0" }}>
        <strong>Name:</strong> {fullName}
      </p>
      <p style={{ margin: "2px 0" }}>
        <strong>Email:</strong> {profile.username}
      </p>
      <p style={{ margin: "2px 0" }}>
        <strong>Gender:</strong> {profile.gender || "—"}
      </p>
    </div>
  );
}
