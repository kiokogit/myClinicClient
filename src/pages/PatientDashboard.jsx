import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getDoctors } from "../api/doctors";
import { getMyBookings } from "../api/bookings";
import { getMyProfile } from "../api/users";
import DoctorCard from "../components/DoctorCard";
import BookingsTable from "../components/BookingsTable";
import UserInfoCard from "../components/UserInfoCard";
import {
  Layout,
  Typography,
  Button,
  Alert,
  Spin,
  Row,
  Col,
  Divider,
  Space,
} from "antd";
import { LogoutOutlined, MedicineBoxOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function PatientDashboard() {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAll() {
      try {
        const [doctorsData, bookingsData, profileData] = await Promise.all([
          getDoctors(),
          getMyBookings(),
          getMyProfile(),
        ]);
        setDoctors(doctorsData);
        setBookings(bookingsData);
        setProfile(profileData);
      } catch {
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  async function refreshBookings() {
    try {
      const bookingsData = await getMyBookings();
      setBookings(bookingsData);
    } catch {
      setError("Could not refresh bookings.");
    }
  }

  // Map of doctor id -> doctor object, used to resolve names in the bookings table
  const doctorsById = Object.fromEntries(doctors.map((d) => [d.id, d]));

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
            Patient Dashboard
          </Title>
        </Space>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Logout
        </Button>
      </Header>

      <Content style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "24px" }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}

        <section>
          <Title level={5}>My Info</Title>
          <UserInfoCard profile={profile} />
        </section>
        <Divider />


        <section>
          <Title level={5}>Doctors</Title>
          <Row gutter={[16, 16]}>
            {doctors.map((doctor) => (
              <Col key={doctor.id} xs={24} sm={12}>
                <DoctorCard doctor={doctor} />
              </Col>
            ))}
          </Row>
        </section>

        <Divider />

        <section>
          <Title level={5}>My Bookings</Title>
          <BookingsTable bookings={bookings} doctorsById={doctorsById} onChanged={refreshBookings} />
        </section>


        
      </Content>
    </Layout>
  );
}