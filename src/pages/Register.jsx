import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  Form,
  Input,
  Button,
  Typography,
  Alert,
  Card,
  Layout,
  Space,
  Divider,
  Row,
  Col,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function onFinish(values) {
    setError("");
    setLoading(true);
    try {
      await register(values);
      navigate("/patient", { replace: true });
    } catch (e){
      setError(e.response.data.details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="borderless"
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(0, 21, 41, 0.12)",
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Space direction="vertical" size={4} style={{ width: "100%", marginBottom: 8 }}>
          <Space align="center">
            <MedicineBoxOutlined style={{ fontSize: 28, color: "#13c2c2" }} />
            <Title level={3} style={{ margin: 0 }}>
              Create account
            </Title>
          </Space>
          <Text type="secondary">Register as a patient to book appointments</Text>
        </Space>

        <Divider style={{ margin: "20px 0" }} />

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        <Form name="register" layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#8c8c8c" }} />}
                  placeholder="First name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Last name" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#8c8c8c" }} />}
              type="email"
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#8c8c8c" }} />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ borderRadius: 8 }}
            >
              Register
            </Button>
          </Form.Item>

          <Text style={{ display: "block", textAlign: "center" }}>
            Already have an account? <Link to="/login">Login</Link>
          </Text>
        </Form>
      </Card>
    </Layout>
  );
}