import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/patient");
    } catch {
      setError("Registration failed. Try a different email.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register (Patient)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="first_name" placeholder="First Name" onChange={handleChange} required /> <br />
      <input name="last_name" placeholder="Last Name" onChange={handleChange} required /><br />
      <input name="username" type="email" placeholder="Email" onChange={handleChange} required /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
      <button type="submit">Register</button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
