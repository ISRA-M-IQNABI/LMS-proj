import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// استيراد الصفحات
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

        {/* صفحة إنشاء حساب جديد */}
        <Route path="/signup" element={<Signup />} />

        {/* لوحة تحكم الأدمن */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* لوحة تحكم المحاضر */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
