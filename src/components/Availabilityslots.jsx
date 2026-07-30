import { DatePicker, Tag, Empty, Space, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export default function AvailabilitySlots({ date, onDateChange, slots }) {
  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Space align="center">
        <Text strong>Date:</Text>
        <DatePicker
          value={date ? dayjs(date) : null}
          onChange={(_, dateString) => onDateChange(dateString)}
          format="YYYY-MM-DD"
          allowClear={false}
        />
      </Space>

      {slots.length === 0 ? (
        <Empty description="No available slots for this date." />
      ) : (
        <Space size={[8, 8]} wrap>
          {slots.map((time) => (
            <Tag
              key={time}
              icon={<ClockCircleOutlined />}
              color="cyan"
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              {time}
            </Tag>
          ))}
        </Space>
      )}
    </Space>
  );
}