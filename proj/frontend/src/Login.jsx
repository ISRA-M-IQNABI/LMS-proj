import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const user = data[0];
        localStorage.setItem("user", JSON.stringify(user));

        switch (user.role) {
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "Instructor":
            navigate("/instructor/dashboard");
            break;
          case "Student":
            navigate("/student/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        maxWidth: "400px",
        width: "100%",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Login to Your Account</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px",
              backgroundColor: loading ? "#888" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
