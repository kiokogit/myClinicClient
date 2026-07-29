import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

const AuthContext = createContext(null);

async function getUserFromToken() {
  try {
    const res2 = await api.get("/acl/users/me")

    return res2.data
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const res = await api.post("/acl/users/login", { username: email, password });
    const accessToken = res.data.access;
    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
    const user = await getUserFromToken()
    setUser(user);
    return user;
  }

  async function register(payload) {
    // payload: { email, password, name, ... } — role defaults to 'public' on backend
    await api.post("/acl/users", payload);
    return login(payload.username, payload.password);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
