import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const RequireAuth = ({ children, role }) => {
    if (!user) return <Navigate to="/" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth role="Admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/instructor/dashboard"
          element={
            <RequireAuth role="Instructor">
              <InstructorDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
