import api from "./axios";

export async function getMyProfile() {
  const res = await api.get("/acl/users/me");
  return res.data;
}
