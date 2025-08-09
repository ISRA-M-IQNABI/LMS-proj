import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => ({
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  });

  const pwdRules = validatePassword(password);

  const validateForm = () => {
    const newErrors = {};
    if (fullName.trim().length < 4)
      newErrors.fullName = "Please enter a valid full name (at least 4 characters).";
    if (userName.trim().length < 3)
      newErrors.userName = "Username must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email address.";
    if (Object.values(pwdRules).includes(false))
      newErrors.password = "Password does not meet all requirements.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!validateForm()) return;

    const newUser = { name: fullName, username: userName, email, password, role };

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setSuccessMsg("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErrorMsg("Error occurred during account creation. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to server. Please try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>Create a New Account</h2>

      {successMsg && <div style={{ color: "green", marginBottom: "15px", textAlign: "center" }}>{successMsg}</div>}
      {errorMsg && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{errorMsg}</div>}

      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: errors.fullName ? "1px solid red" : "1px solid #aaa" }}
          required
        />
        {errors.fullName && <p style={{ color: "red", margin: "0" }}>{errors.fullName}</p>}

        <label>Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: errors.userName ? "1px solid red" : "1px solid #aaa" }}
          required
        />
        {errors.userName && <p style={{ color: "red", margin: "0" }}>{errors.userName}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: errors.email ? "1px solid red" : "1px solid #aaa" }}
          required
        />
        {errors.email && <p style={{ color: "red", margin: "0" }}>{errors.email}</p>}

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: errors.password ? "1px solid red" : "1px solid #aaa" }}
          required
        />
        {errors.password && <p style={{ color: "red", margin: "0" }}>{errors.password}</p>}

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #aaa" }}>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" style={{ padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          Create Account
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
