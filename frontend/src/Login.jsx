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
    <div className="min-h-screen bg-gradient-to-r from-indigo-700 via-purple-800 to-pink-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 transform transition-transform hover:scale-[1.02] duration-300">
        <div className="flex flex-col items-center mb-10">
          {/* أيقونة تعليم أنيقة */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-purple-700 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l6.16-3.422a12.083 12.083 0 01.84 4.258c0 2.485-2.239 4.5-5 4.5s-5-2.015-5-4.5a12.083 12.083 0 01.84-4.258L12 14z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
          </svg>

          <h2 className="mt-5 text-4xl font-extrabold text-gray-900 tracking-wide">
            Welcome Back
          </h2>
          <p className="mt-3 text-gray-600 text-center max-w-xs font-medium">
            Log in to your PPU E-Class account and continue your learning journey.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-7">
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-400 transition"
            />
            <label
              htmlFor="email"
              className="absolute left-5 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-purple-700 cursor-text"
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-400 transition"
            />
            <label
              htmlFor="password"
              className="absolute left-5 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-purple-700 cursor-text"
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition duration-300 transform ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800 hover:scale-105"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-700 font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-700 font-bold hover:text-purple-900 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login.jsx;
