// src/InstructorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3001";
const INSTRUCTOR_ID = 2;
const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "courses", label: "My Courses" },
  { key: "content", label: "Manage Content" },
  { key: "students", label: "Student Progress" },
  { key: "profile", label: "Profile" },
];

export default function InstructorDashboard() {
  const [section, setSection] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalType, setModalType] = useState("add");
  const [modalEntity, setModalEntity] = useState("");

  useEffect(() => {
    loadProfile();
    loadCourses();
  }, []);

  const loadProfile = async () => {
    const { data } = await axios.get(`${API}/users/${INSTRUCTOR_ID}`);
    setProfile(data);
  };

  const loadCourses = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `${API}/courses?instructorId=${INSTRUCTOR_ID}`
    );
    setCourses(data);
    setLoading(false);
  };

  const loadDetails = async (courseId) => {
    setLoading(true);
    const [l, q, e] = await Promise.all([
      axios.get(`${API}/lectures?courseId=${courseId}`),
      axios.get(`${API}/quizzes?courseId=${courseId}`),
      axios.get(`${API}/enrollments?courseId=${courseId}`),
    ]);
    setLectures(l.data);
    setQuizzes(q.data);
    setEnrollments(e.data);
    setLoading(false);
  };

  const openModal = (entity, type, data = {}) => {
    setModalEntity(entity);
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleDelete = async (entity, id) => {
    if (!confirm("Confirm delete?")) return;
    await axios.delete(`${API}/${entity}/${id}`);
    if (entity === "courses") loadCourses();
    else loadDetails(selected.id);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const url = `${API}/${modalEntity}`;
    const payload = { ...modalData, instructorId: INSTRUCTOR_ID };
    if (modalType === "add") await axios.post(url, payload);
    else await axios.put(`${url}/${modalData.id}`, payload);
    closeModal();
    if (modalEntity === "courses") loadCourses();
    else loadDetails(selected.id);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-gradient-to-b from-blue-700 to-green-600 text-white shadow-lg">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold">Instructor</h1>
        </div>
        <nav className="px-2 mt-4">
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              onClick={() => {
                setSection(sec.key);
                if (sec.key === "content" && selected)
                  loadDetails(selected.id);
              }}
              className={`block w-full text-left px-4 py-2 my-1 rounded transition-all duration-200 ${
                section === sec.key
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-white/20"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            {SECTIONS.find((s) => s.key === section).label}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadCourses}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow"
            >
              Refresh
            </button>
            <span className="text-gray-800 font-medium">
              {profile.name || profile.username}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {section === "overview" && (
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Courses", value: courses.length },
                { label: "Lectures", value: lectures.length },
                { label: "Students", value: enrollments.length },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all"
                >
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* باقي الأقسام نفس الكود السابق بدون تغيير الوظائف */}
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={handleModalSubmit}
            className="bg-white p-6 rounded-xl shadow-2xl w-96 space-y-4 animate-fadeIn"
          >
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {modalType === "add" ? "Add" : "Edit"}{" "}
              {modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)}
            </h2>
            {Object.entries(modalData).map(([k, v]) => {
              if (
                k === "id" ||
                k === "instructorId" ||
                k === "courseId"
              )
                return null;
              return (
                <div key={k}>
                  <label className="block text-sm text-gray-700 mb-1 capitalize">
                    {k}
                  </label>
                  <input
                    name={k}
                    value={v}
                    onChange={(e) =>
                      setModalData((md) => ({
                        ...md,
                        [k]: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              );
            })}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
