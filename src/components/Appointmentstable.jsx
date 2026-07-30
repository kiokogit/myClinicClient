import { useState } from "react";
import { Table, Avatar, Space, Typography, Input, Empty } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import moment from "moment";

const { Text } = Typography;

function formatPatientName(patient) {
  if (!patient) return "Unknown patient";
  const parts = [patient.first_name, patient.other_names, patient.last_name].filter(
    (n) => n && n !== "None"
  );
  return parts.join(" ");
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Deterministic pastel-ish color per name, so the same patient always gets the same avatar color
const AVATAR_COLORS = ["#13c2c2", "#1677ff", "#722ed1", "#eb2f96", "#fa8c16", "#52c41a"];
function colorFor(name) {
  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// props: appointments, usersById (patient id -> user object)
export default function AppointmentsTable({ appointments }) {
  const [search, setSearch] = useState("");

  if (!appointments.length) return <Empty description="No appointments yet." />;


  const statuses = [...new Set(appointments.map((a) => a.status))];

  const columns = [
    {
      title: "Patient",
      dataIndex: "patient",
      key: "patient",
      render: (record) => (
        <Space>
          <Avatar style={{ backgroundColor: colorFor(record.first_name) }} icon={!record.first_name.trim() && <UserOutlined />}>
            {record.first_name.trim() ? initials(record.first_name) : null}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong>{record.first_name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.last_name}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "start_time",
      key: "start_time",
      sorter: (a, b) => new Date(a.start_time) - new Date(b.start_time),
      render: (startTime) => formatDateTime(startTime),
    },
    {
      title: "Time to",
      dataIndex: "start_time",
      key: "time_to",
      render: (startTime) => (
        <Text type="secondary">{moment(startTime).fromNow()}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statuses.map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.status === value,
      render: (status) => <StatusBadge status={status} />,
    },
  ];

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      <Input
        placeholder="Search by patient name..."
        prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 280 }}
        allowClear
      />
      <Table rowKey="id" dataSource={appointments} columns={columns} pagination={false} />
    </Space>
  );
}