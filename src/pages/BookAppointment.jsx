import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDoctorSlots } from "../api/doctors";
import { createBooking } from "../api/bookings";
import SlotPicker from "../components/SlotPicker";
import {
  Layout,
  Typography,
  Button,
  Alert,
  Spin,
  Card,
  Space,
  Steps,
  Input,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    setError("");
    getDoctorSlots(doctorId, date)
      .then(setSlots)
      .catch(() => setError("Could not load slots for this date."))
      .finally(() => setLoading(false));
  }, [doctorId, date]);

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      await createBooking({ doctor: doctorId, start_time: `${date} ${selected}`, remarks });
      navigate("/patient");
    } catch (e) {
      setError(e.response.data.details);
      setSubmitting(false);
    }
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Space align="center">
          <Link to="/patient">
            <Button icon={<ArrowLeftOutlined />} type="text">
              Back to dashboard
            </Button>
          </Link>
          <Title level={4} style={{ margin: 0 }}>
            Book Appointment
          </Title>
        </Space>
      </Header>

      <Content style={{ maxWidth: 640, margin: "0 auto", width: "100%", padding: "24px" }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}

        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Steps
            size="small"
            current={selected ? 1 : 0}
            style={{ marginBottom: 24 }}
            items={[
              { title: "Choose a time", icon: <CalendarOutlined /> },
              { title: "Confirm", icon: <CheckCircleOutlined /> },
            ]}
          />

          {loading ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Spin tip="Loading slots..." />
            </div>
          ) : (
            <SlotPicker
              date={date}
              onDateChange={setDate}
              slots={slots}
              selected={selected}
              onSelect={setSelected}
            />
          )}

          {selected && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Space>
                  <Text type="secondary">Selected slot:</Text>
                  <Tag color="cyan" icon={<CalendarOutlined />} style={{ borderRadius: 6 }}>
                    {date} at {selected}
                  </Tag>
                </Space>

                <TextArea
                  placeholder="Remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />

                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CheckCircleOutlined />}
                  loading={submitting}
                  onClick={handleConfirm}
                  style={{ borderRadius: 8 }}
                >
                  Confirm Booking
                </Button>
              </Space>
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}