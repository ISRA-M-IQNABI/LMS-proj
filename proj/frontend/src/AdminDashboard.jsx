// src/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Base URL for your JSON Server
const API_URL = "http://localhost:3001";

// Define the tabs and their fields
const TABS = {
  users: {
    label: "Users",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "role", label: "Role", type: "text" },
    ],
  },
  courses: {
    label: "Courses",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "instructorId", label: "Instructor ID", type: "number" },
    ],
  },
  enrollments: {
    label: "Enrollments",
    fields: [
      { name: "courseId", label: "Course ID", type: "number" },
      { name: "studentId", label: "Student ID", type: "number" },
      { name: "progress", label: "Progress (%)", type: "number" },
    ],
  },
  lectures: {
    label: "Lectures",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "type", label: "Type", type: "text" },
      { name: "url", label: "URL", type: "url" },
    ],
  },
  quizzes: {
    label: "Quizzes",
    fields: [
      { name: "courseId", label: "Course ID", type: "number" },
      // we won't edit questions array here; creation via comma-separated
      { name: "questions", label: "Questions (comma-sep)", type: "text" },
    ],
  },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState({
    users: [],
    courses: [],
    enrollments: [],
    lectures: [],
    quizzes: [],
  });
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [formValues, setFormValues] = useState({});

  // Fetch all data on load
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, c, e, l, q] = await Promise.all(
        Object.keys(TABS).map((tab) => axios.get(`${API_URL}/${tab}`))
      );
      setData({
        users: u.data,
        courses: c.data,
        enrollments: e.data,
        lectures: l.data,
        quizzes: q.data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Open modal for add/edit
  const openModal = (mode, item = {}) => {
    setModalMode(mode);
    // Pre-fill form if editing
    if (mode === "edit") {
      // For quizzes convert questions array to comma string
      if (activeTab === "quizzes") {
        setFormValues({
          ...item,
          questions: item.questions.join(", "),
        });
      } else setFormValues(item);
    } else {
      // blank form for add
      const blank = {};
      TABS[activeTab].fields.forEach((f) => (blank[f.name] = ""));
      setFormValues(blank);
    }
    setModalOpen(true);
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormValues((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...formValues };
    if (activeTab === "quizzes") {
      payload.questions = formValues.questions
        .split(",")
        .map((q) => q.trim());
    }
    try {
      if (modalMode === "add") {
        await axios.post(`${API_URL}/${activeTab}`, payload);
      } else {
        await axios.put(
          `${API_URL}/${activeTab}/${formValues.id}`,
          payload
        );
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${activeTab}/${id}`);
      setData((d) => ({
        ...d,
        [activeTab]: d[activeTab].filter((i) => i.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Styling helpers
  const bg = "bg-gray-900";
  const panelBg = "bg-gray-800";
  const text = "text-gray-100";
  const accent = "text-blue-400 hover:text-blue-300";

  return (
    <div className={`${bg} flex h-screen w-screen overflow-hidden`}>
      {/* Sidebar */}
      <aside className={`${panelBg} w-1/5 p-4 flex flex-col`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${text}`}>
          Admin Dashboard
        </h2>
        <nav className="flex-1">
          {Object.entries(TABS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`block w-full text-left py-2 px-4 mb-2 rounded transition ${
                activeTab === key
                  ? "bg-blue-700 " + accent
                  : text + " hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={fetchAll}
          className="mt-auto bg-green-600 hover:bg-green-500 text-gray-100 py-2 rounded transition"
        >
          Refresh
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {loading ? (
          <p className="text-center text-lg text-gray-300">Loading...</p>
        ) : (
          <>
            {/* Header + Add */}
            <div className="flex justify-between items-center mb-4">
              <h1 className={`text-3xl font-semibold ${text}`}>
                {TABS[activeTab].label}
              </h1>
              <button
                onClick={() => openModal("add")}
                className="bg-blue-600 hover:bg-blue-500 text-gray-100 px-4 py-2 rounded"
              >
                ➕ Add
              </button>
            </div>

            {/* Table */}
            <table className="w-full table-auto border-separate border-spacing-y-2">
              <thead className="bg-gray-700">
                <tr>
                  {TABS[activeTab].fields
                    .map((f) => f.label)
                    .concat("Actions")
                    .map((h) => (
                      <th
                        key={h}
                        className="p-3 text-left text-gray-300"
                      >
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data[activeTab].map((item) => (
                  <tr
                    key={item.id}
                    className="bg-gray-800 even:bg-gray-700"
                  >
                    {TABS[activeTab].fields.map((f) => (
                      <td key={f.name} className={`p-3 ${text}`}>
                        {activeTab === "quizzes" && f.name === "questions"
                          ? item.questions.length
                          : item[f.name]}
                      </td>
                    ))}
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => openModal("edit", item)}
                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-500 text-gray-100 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded shadow-lg w-1/3 space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-100">
              {modalMode === "add" ? "Add" : "Edit"} {TABS[activeTab].label}
            </h2>
            {modalMode === "edit" && (
              <input type="hidden" name="id" value={formValues.id} />
            )}
            {TABS[activeTab].fields.map((f) => (
              <div key={f.name}>
                <label className="block text-gray-300 mb-1">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type={f.type}
                  value={formValues[f.name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 focus:outline-none"
                  required
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-gray-100 rounded"
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
