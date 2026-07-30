import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMyProfile } from "../api/users";
import { getMySchedules } from "../api/schedules";
import { getDoctorSlots } from "../api/doctors";
import { getMyBookings } from "../api/bookings";
import UserInfoCard from "../components/UserInfoCard";
import ScheduleList from "../components/ScheduleList";
import AvailabilitySlots from "../components/AvailabilitySlots";
import AppointmentsTable from "../components/AppointmentsTable";
import { Layout, Typography, Button, Alert, Spin, Row, Col, Card, Space } from "antd";
import { LogoutOutlined, MedicineBoxOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function DoctorDashboard() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      try {
        const [profileData, schedulesData, appointmentsData] = await Promise.all([
          getMyProfile(),
          getMySchedules(),
          getMyBookings(),
        ]);
        setProfile(profileData);
        setSchedules(schedulesData);
        setAppointments(appointmentsData);
      } catch (e){
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    if (profile) {
      getDoctorSlots(profile.id, date)
        .then(setSlots)
        .catch(() => setSlots([]));
    }
  }, [date, profile]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" tip="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Space align="center">
          <MedicineBoxOutlined style={{ fontSize: 22, color: "#13c2c2" }} />
          <Title level={4} style={{ margin: 0 }}>
            Doctor Dashboard
          </Title>
        </Space>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Button>
      </Header>

      <Content style={{ maxWidth: 1000, margin: "0 auto", width: "100%", padding: "24px" }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}

        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <Card title="My Profile" variant="borderless" style={{ borderRadius: 12 }}>
            <UserInfoCard profile={profile} />
          </Card>

          <Row gutter={20}>
            <Col xs={24} md={10}>
              <Card
                title="My Available Slots"
                variant="borderless"
                style={{ borderRadius: 12, height: "100%" }}
              >
                <AvailabilitySlots date={date} onDateChange={setDate} slots={slots} />
              </Card>
            </Col>
            <Col xs={24} md={14}>
              <Card
                title="Booked Appointments"
                variant="borderless"
                style={{ borderRadius: 12, height: "100%" }}
              >
                <AppointmentsTable appointments={appointments} />
              </Card>
            </Col>
          </Row>

          <Card title="My Schedule" variant="borderless" style={{ borderRadius: 12 }}>
            <ScheduleList schedules={schedules} />
          </Card>

        </Space>
      </Content>
    </Layout>
  );
}