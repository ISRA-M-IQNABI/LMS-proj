import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

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
      { name: "questions", label: "Questions (comma-separated)", type: "text" },
    ],
  },
};

const ITEMS_PER_PAGE = 7; // عدد العناصر في الصفحة

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
  const [error, setError] = useState(null);

  // مودال إضافة/تعديل
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add / edit
  const [formValues, setFormValues] = useState({});

  // تأكيد حذف
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // بحث وترتيب وترقيم
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  // تحميل البيانات من السيرفر
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.all(
        Object.keys(TABS).map((tab) => axios.get(`${API_URL}/${tab}`))
      );
      const newData = {};
      Object.keys(TABS).forEach((tab, i) => {
        newData[tab] = responses[i].data;
      });
      setData(newData);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load data. Please try again later.");
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // فتح مودال إضافة أو تعديل
  const openModal = (mode, item = {}) => {
    setModalMode(mode);
    if (mode === "edit") {
      if (activeTab === "quizzes") {
        setFormValues({
          ...item,
          questions: item.questions.join(", "),
        });
      } else {
        setFormValues(item);
      }
    } else {
      // نموذج فارغ للإضافة
      const emptyForm = {};
      TABS[activeTab].fields.forEach((f) => (emptyForm[f.name] = ""));
      setFormValues(emptyForm);
    }
    setModalOpen(true);
  };

  // تحديث قيم الحقول داخل المودال
  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ارسال البيانات (إضافة/تعديل)
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...formValues };
    if (activeTab === "quizzes") {
      payload.questions = formValues.questions.split(",").map((q) => q.trim());
    }

    try {
      if (modalMode === "add") {
        await axios.post(`${API_URL}/${activeTab}`, payload);
      } else {
        await axios.put(`${API_URL}/${activeTab}/${formValues.id}`, payload);
      }
      setModalOpen(false);
      fetchAllData();
    } catch (err) {
      setError("Failed to save data. Please check your inputs.");
      console.error(err);
    }
  };

  // فتح نافذة تأكيد حذف
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  // حذف العنصر بعد التأكيد
  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await axios.delete(`${API_URL}/${activeTab}/${itemToDelete.id}`);
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((i) => i.id !== itemToDelete.id),
      }));
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError("Failed to delete item. Please try again.");
      console.error(err);
    }
  };

  // فلترة البيانات بالبحث
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data[activeTab];
    return data[activeTab].filter((item) =>
      TABS[activeTab].fields.some((field) => {
        const val = item[field.name];
        if (typeof val === "string")
          return val.toLowerCase().includes(searchQuery.toLowerCase());
        if (typeof val === "number")
          return val.toString().includes(searchQuery);
        if (Array.isArray(val))
          return val.join(", ").toLowerCase().includes(searchQuery.toLowerCase());
        return false;
      })
    );
  }, [searchQuery, data, activeTab]);

  // ترتيب البيانات
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // تقسيم الصفحات
  const pageCount = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  // تغير الترتيب عند الضغط على العنوان
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // سهم الترتيب
  const SortArrow = ({ direction }) => (
    direction === "asc" ? <span> ▲</span> : <span> ▼</span>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* الشريط الجانبي */}
      <aside className="w-full md:w-1/5 bg-white shadow-md border-r border-gray-300 flex flex-col">
        <h1 className="text-3xl font-extrabold p-6 text-center border-b border-gray-300">
          Admin Dashboard
        </h1>
        <nav className="flex-1 overflow-auto">
          {Object.entries(TABS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSearchQuery("");
                setSortConfig({ key: null, direction: "asc" });
                setCurrentPage(1);
              }}
              className={`w-full px-6 py-3 text-left font-semibold transition-colors duration-200 ${
                activeTab === key
                  ? "bg-blue-600 text-white shadow-inner"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={fetchAllData}
          className="m-6 py-3 rounded bg-green-600 text-white hover:bg-green-700 transition"
        >
          Refresh Data
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 overflow-auto flex flex-col">
        {/* رسالة الخطأ */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {loading ? (
          <div className="flex-grow flex justify-center items-center text-gray-500 text-xl">
            Loading data...
          </div>
        ) : (
          <>
            {/* رأس الصفحة + أدوات */}
            <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {TABS[activeTab].label}
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                {/* بحث */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-grow sm:flex-grow-0 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* زر إضافة */}
                <button
                  onClick={() => openModal("add")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow transition"
                >
                  + Add New
                </button>
              </div>
            </header>

            {/* جدول البيانات */}
            <div className="overflow-x-auto rounded-lg shadow bg-white flex-grow">
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-blue-600 text-white select-none">
                    {TABS[activeTab].fields.map(({ name, label }) => (
                      <th
                        key={name}
                        className="px-6 py-3 text-left font-semibold cursor-pointer select-none"
                        onClick={() => handleSort(name)}
                        title="Click to sort"
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          {sortConfig.key === name && (
                            <SortArrow direction={sortConfig.direction} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABS[activeTab].fields.length + 1}
                        className="text-center p-8 text-gray-500 italic"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b even:bg-gray-50 hover:bg-blue-50 transition-colors"
                      >
                        {TABS[activeTab].fields.map(({ name }) => (
                          <td key={name} className="px-6 py-4 text-gray-900">
                            {activeTab === "quizzes" && name === "questions"
                              ? item.questions.length
                              : item[name]}
                          </td>
                        ))}
                        <td className="px-6 py-4 flex gap-4">
                          <button
                            onClick={() => openModal("edit", item)}
                            className="text-yellow-600 hover:text-yellow-800 font-semibold"
                            aria-label="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(item)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                            aria-label="Delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ترقيم الصفحات */}
            <div className="flex justify-center mt-6 gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {"<<"}
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {"<"}
              </button>

              {/* صفحات رقمية */}
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-blue-700 text-white font-bold"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                className={`px-3 py-1 rounded ${
                  currentPage === pageCount
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {">"}
              </button>
              <button
                onClick={() => setCurrentPage(pageCount)}
                disabled={currentPage === pageCount}
                className={`px-3 py-1 rounded ${
                  currentPage === pageCount
                    ? "bg-blue-600 text-white cursor-default"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {">>"}
              </button>
            </div>
          </>
        )}

        {/* مودال الإضافة والتعديل */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900">
                {modalMode === "add" ? "Add New" : "Edit"} {TABS[activeTab].label}
              </h3>

              {modalMode === "edit" && (
                <input type="hidden" name="id" value={formValues.id} />
              )}

              {TABS[activeTab].fields.map(({ name, label, type }) => (
                <div key={name} className="flex flex-col">
                  <label
                    htmlFor={name}
                    className="mb-2 font-medium text-gray-700 capitalize"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formValues[name] || ""}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* مودال تأكيد الحذف */}
        
{deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Confirm Delete
              </h3>
              <p className="text-gray-700">
                Are you sure you want to delete this {TABS[activeTab].label.slice(0, -1).toLowerCase()}?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}