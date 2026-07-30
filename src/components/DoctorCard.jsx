import { useNavigate } from "react-router-dom";
import { Card, Avatar, Typography, Button, Space, Tag } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const fullName = [doctor.first_name, doctor.other_names, doctor.last_name]
    .filter((n) => n && n !== "None")
    .join(" ");

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
      styles={{ body: { padding: 16 } }}
    >
      <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
        <Space align="start">
          <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: "#13c2c2" }} />
          <Space direction="vertical" size={2}>
            <Text strong style={{ fontSize: 16 }}>
              Dr. {fullName}
            </Text>
            <Space size={6}>
              {doctor.gender && <Tag color="cyan">{doctor.gender}</Tag>}
              <Text type="secondary" style={{ fontSize: 13 }}>
                <MailOutlined /> {doctor.username}
              </Text>
            </Space>
          </Space>
        </Space>
      </Space>

      <Button
        type="primary"
        icon={<CalendarOutlined />}
        block
        style={{ marginTop: 16, borderRadius: 8 }}
        onClick={() => navigate(`/patient/book/${doctor.id}`)}
      >
        Book Appointment
      </Button>
    </Card>
  );
}