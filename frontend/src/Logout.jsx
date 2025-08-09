// src/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // حذف بيانات المستخدم من localStorage
    localStorage.removeItem("user");

    // تأخير بسيط قبل إعادة التوجيه لصفحة تسجيل الدخول
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 800);

    // تنظيف التايمر لو تغير المكون
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Logging out...</h2>
        <p className="text-gray-500">You are being logged out. Please wait a moment.</p>
      </div>
    </div>
  );
}
