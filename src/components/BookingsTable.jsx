import { useState } from "react";
import { Table, Button, Space, Empty } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import StatusBadge from "./StatusBadge";
import RescheduleModal from "./RescheduleModal";
import { cancelBooking } from "../api/bookings";
import moment from "moment";

function formatDoctorName(doctor) {
  if (!doctor) return "Unknown doctor";
  const parts = [doctor.first_name, doctor.other_names, doctor.last_name].filter(
    (n) => n && n !== "None"
  );
  return `Dr. ${parts.join(" ")}`;
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const FINAL_STATUSES = ["CANCELLED", "EXPIRED", "COMPLETED"];

// props: bookings, doctorsById, onChanged (call after cancel/reschedule to refresh data)
export default function BookingsTable({ bookings, doctorsById, onChanged }) {
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("")

  async function handleCancel(booking) {
    const remarks = window.prompt("Reason for cancelling:", "") || "";
    setCancellingId(booking.id);
    try {
      await cancelBooking(booking.id, remarks);
      onChanged();
    } catch (e) {
      setError(e.response.data.details)
    } finally {
      setCancellingId(null);
    }
  }

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (_, booking) => formatDoctorName(doctorsById?.[booking.doctor] ?? booking.doctor),
    },
    {
      title: "Date & Time",
      dataIndex: "start_time",
      key: "start_time",
      render: (startTime) => formatDateTime(startTime),
    },
    {
      title: "Time to",
      dataIndex: "start_time",
      key: "time_to",
      render: (startTime) => moment(startTime).fromNow(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, booking) => {
        if (FINAL_STATUSES.includes(booking.status)) return null;
        return (
          <Space>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => setReschedulingBooking(booking)}
            >
              Reschedule
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              loading={cancellingId === booking.id}
              onClick={() => handleCancel(booking)}
            >
              Cancel
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
      <Table
        rowKey="id"
        dataSource={bookings}
        columns={columns}
        pagination={false}
        locale={{ emptyText: <Empty description="No bookings yet." /> }}
      />

      {reschedulingBooking && (
        <RescheduleModal
          booking={reschedulingBooking}
          onClose={() => setReschedulingBooking(null)}
          onDone={onChanged}
        />
      )}
    </>
  );
}