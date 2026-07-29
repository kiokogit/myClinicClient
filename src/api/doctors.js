import api from "./axios";

export async function getDoctors() {
  const res = await api.get("/acl/users?search=doctor");
  return res.data.results;
}


export async function getDoctorSlots(doctorId, date) {
  const res = await api.get(`/hrm/doctor-schedules/${doctorId}/availability`, { params: { date } });
  return res.data.available_slots;
}
 
