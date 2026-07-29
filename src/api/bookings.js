import api from "./axios";

export async function getMyBookings() {
  const res = await api.get("/bookings/appointments");
  return res.data.results;
}

// payload: { doctor, start_time, remarks? }
export async function createBooking(payload) {
  const res = await api.post("/bookings/appointments", payload);
  return res.data;
}
 
 
export async function cancelBooking(bookingId, remarks = "") {
  const res = await api.patch(`/bookings/appointments/${bookingId}/cancel`, { remarks });
  return res.data;
}
 
// payload: { start_time, remarks? }
export async function rescheduleBooking(bookingId, payload) {
  const res = await api.patch(`/bookings/appointments/${bookingId}/reschedule`, payload);
  return res.data;
}
 
