import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // استيراد التنسيقات العامة (Tailwind أو CSS عادي)

// إنشاء الجذر وربط التطبيق به مع تمكين StrictMode للمساعدة في كشف الأخطاء
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
