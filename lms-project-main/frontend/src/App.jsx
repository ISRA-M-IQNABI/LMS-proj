import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// الصفحات
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/" element={<Login />} />

        {/* صفحة إنشاء الحساب */}
        <Route path="/signup" element={<Signup />} />

        {/* صفحة لوحة تحكم الأدمن */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

