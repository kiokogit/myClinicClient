import api from "./axios";
 
export async function getMySchedules() {
  const res = await api.get("/hrm/doctor-schedules");
  return res.data.results;
}
 