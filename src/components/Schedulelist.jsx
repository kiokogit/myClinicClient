import { Calendar, Tag, Tooltip, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

function formatTime(t) {
  // t is "HH:MM:SS"
  return t.slice(0, 5);
}

// Returns every schedule block that covers the given calendar date
function schedulesForDate(schedules, date) {
  const dateStr = date.format("YYYY-MM-DD");
  return schedules.filter((s) => dateStr >= s.start_date && dateStr <= s.end_date);
}

export default function ScheduleList({ schedules }) {
  if (!schedules.length) return <Empty description="No schedule set." />;

  function cellRender(current, info) {
    if (info.type !== "date") return info.originNode;

    const dayMatches = schedulesForDate(schedules, current);
    if (!dayMatches.length) return null;

    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {dayMatches.map((s) => (
          <li key={s.id} style={{ marginBottom: 3 }}>
            <Tooltip title={s.remarks || undefined}>
              <Tag
                icon={<ClockCircleOutlined />}
                color="cyan"
                style={{ fontSize: 11, borderRadius: 6, padding: "0 6px" }}
              >
                {formatTime(s.day_start_time)}–{formatTime(s.day_end_time)}
              </Tag>
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  }

  return <Calendar cellRender={cellRender} />;
}