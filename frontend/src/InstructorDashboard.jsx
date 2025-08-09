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
  // --- State variables ---
  const [section, setSection] = useState("overview");
  const [profile, setProfile] = useState({});
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
  const [modalEntity, setModalEntity] = useState(""); // "courses", "lectures", "quizzes"
  const [modalData, setModalData] = useState({});

  // --- Initial Data Load ---
  useEffect(() => {
    loadProfile();
    loadCourses();
  }, []);

  // --- API Calls ---
  async function loadProfile() {
    try {
      const { data } = await axios.get(`${API}/users/${INSTRUCTOR_ID}`);
      setProfile(data);
    } catch (error) {
      alert("Failed to load profile.");
    }
  }

  async function loadCourses() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/courses?instructorId=${INSTRUCTOR_ID}`);
      setCourses(data);
      if(data.length > 0) setSelectedCourse(data[0]);
      else {
        setSelectedCourse(null);
        setLectures([]);
        setQuizzes([]);
        setEnrollments([]);
      }
    } catch (error) {
      alert("Failed to load courses.");
    }
    setLoading(false);
  }

  async function loadCourseDetails(courseId) {
    setLoading(true);
    try {
      const [lecturesRes, quizzesRes, enrollmentsRes] = await Promise.all([
        axios.get(`${API}/lectures?courseId=${courseId}`),
        axios.get(`${API}/quizzes?courseId=${courseId}`),
        axios.get(`${API}/enrollments?courseId=${courseId}`),
      ]);
      setLectures(lecturesRes.data);
      setQuizzes(quizzesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      alert("Failed to load course details.");
    }
    setLoading(false);
  }

  // --- Modal Handlers ---
  function openModal(entity, type, data = {}) {
    setModalEntity(entity);
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalData({});
  }

  async function handleModalSubmit(e) {
    e.preventDefault();
    const url = `${API}/${modalEntity}`;
    const payload = { ...modalData };
    if (modalEntity !== "courses") payload.courseId = selectedCourse?.id;
    if (modalEntity === "courses") payload.instructorId = INSTRUCTOR_ID;

    try {
      if (modalType === "add") {
        await axios.post(url, payload);
      } else {
        await axios.put(`${url}/${modalData.id}`, payload);
      }
      closeModal();
      if (modalEntity === "courses") loadCourses();
      else if (modalEntity === "lectures" || modalEntity === "quizzes") loadCourseDetails(selectedCourse.id);
    } catch (error) {
      alert("Failed to save data.");
    }
  }

  async function handleDelete(entity, id) {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await axios.delete(`${API}/${entity}/${id}`);
      if (entity === "courses") loadCourses();
      else loadCourseDetails(selectedCourse.id);
    } catch {
      alert("Delete failed.");
    }
  }

  // --- Profile Update ---
  async function handleProfileUpdate(e) {
    e.preventDefault();
    try {
      await axios.put(`${API}/users/${INSTRUCTOR_ID}`, profile);
      alert("Profile updated!");
    } catch {
      alert("Update failed.");
    }
  }

  // --- JSX Sections ---

  // Overview section
  const renderOverview = () => {
    const totalStudents = enrollments.length;
    const totalCourses = courses.length;
    const totalLectures = lectures.length;
    const totalQuizzes = quizzes.length;

    return (
      <div className="row g-4">
        {[ 
          { label: "Total Courses", value: totalCourses },
          { label: "Total Lectures", value: totalLectures },
          { label: "Total Quizzes", value: totalQuizzes },
          { label: "Total Enrollments", value: totalStudents }
        ].map((card, i) => (
          <div className="col-md-3" key={i}>
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-muted">{card.label}</h5>
                <h2 className="card-text text-primary">{card.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Courses section
  const renderCourses = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Courses</h3>
        <button
          className="btn btn-primary"
          onClick={() => openModal("courses", "add")}
        >
          Add Course
        </button>
      </div>

      {loading && <p>Loading courses...</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}

      <ul className="list-group">
        {courses.map((course) => (
          <li
            key={course.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              selectedCourse?.id === course.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCourse(course);
              loadCourseDetails(course.id);
            }}
            style={{ cursor: "pointer" }}
          >
            {course.title}
            <div>
              <button
                className="btn btn-sm btn-light me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("courses", "edit", course);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete("courses", course.id);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  // Manage Content (Lectures + Quizzes)
  const renderContent = () => {
    if (!selectedCourse) return <p>Please select a course in "My Courses" first.</p>;

    return (
      <>
        <h3>Manage Content for: <em>{selectedCourse.title}</em></h3>

        {/* Lectures */}
        <section className="my-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Lectures</h5>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => openModal("lectures", "add")}
            >
              Add Lecture
            </button>
          </div>
          {lectures.length === 0 && <p>No lectures added yet.</p>}
          <ul className="list-group">
            {lectures.map((lecture) => (
              <li key={lecture.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{lecture.title}</strong> ({lecture.type})
                </div>
                <div>
                  <a
                    href={lecture.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    View
                  </a>
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={() => openModal("lectures", "edit", lecture)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete("lectures", lecture.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Quizzes */}
        <section className="my-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Quizzes</h5>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => openModal("quizzes", "add")}
            >
              Add Quiz
            </button>
          </div>
          {quizzes.length === 0 && <p>No quizzes added yet.</p>}
          <ul className="list-group">
            {quizzes.map((quiz) => (
              <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>Quiz #{quiz.id}</strong> - Questions: {quiz.questions.length}
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={() => openModal("quizzes", "edit", quiz)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete("quizzes", quiz.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </>
    );
  };

  // Student Progress section
  const renderStudents = () => {
    if (!selectedCourse) return <p>Please select a course in "My Courses" first.</p>;

    return (
      <>
        <h3>Student Progress - {selectedCourse.title}</h3>
        {enrollments.length === 0 ? (
          <p>No students enrolled yet.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Progress (%)</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enroll) => (
                <tr key={enroll.id}>
                  <td>{enroll.studentId}</td>
                  <td>{enroll.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  };

  // Profile Section
  const renderProfile = () => (
    <form onSubmit={handleProfileUpdate} className="w-50">
      <h3>Profile</h3>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          required
        />
      </div>
      {/* يمكنك اضافة المزيد من الحقول إذا أردت */}
      <button type="submit" className="btn btn-success">Save Changes</button>
    </form>
  );

  // Modal content depending on entity
  const renderModalContent = () => {
    if (modalEntity === "courses") {
      return (
        <>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={modalData.title || ""}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={modalData.description || ""}
              onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
              className="form-control"
              required
            />
          </div>
        </>
      );
    } else if (modalEntity === "lectures") {
      return (
        <>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={modalData.title || ""}
              onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              name="type"
              value={modalData.type || "video"}
              onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
              className="form-select"
              required
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">URL</label>
            <input
              type="url"
              name="url"
              value={modalData.url || ""}
              onChange={(e) => setModalData({ ...modalData, url: e.target.value })}
              className="form-control"
              required
            />
          </div>
        </>
      );
    } else if (modalEntity === "quizzes") {
      return (
        <>
          <div className="mb-3">
            <label className="form-label">Questions (Comma separated)</label>
            <textarea
              name="questions"
              value={modalData.questions ? modalData.questions.join(", ") : ""}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  questions: e.target.value.split(",").map((q) => q.trim()),
                })
              }
              className="form-control"
              required
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <aside className="bg-primary text-white p-3" style={{ width: 240 }}>
        <h1 className="h4 mb-4">Instructor</h1>
        <nav className="nav flex-column">
          {SECTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSection(key)}
              className={`btn btn-link text-start ${
                section === key ? "fw-bold text-white bg-light bg-opacity-25" : "text-white"
              } mb-1`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column bg-light">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white shadow-sm">
          <h2 className="h5 mb-0">{SECTIONS.find((s) => s.key === section)?.label}</h2>
          <div>
            {section === "courses" && (
              <button
                className="btn btn-success me-3"
                onClick={loadCourses}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            )}
            <span className="fw-semibold">{profile.name || profile.username}</span>
          </div>
        </header>

        {/* Body */}
        <main className="flex-grow-1 overflow-auto p-4">
          {loading && <p>Loading...</p>}
          {!loading && (
            <>
              {section === "overview" && renderOverview()}
              {section === "courses" && renderCourses()}
              {section === "content" && renderContent()}
              {section === "students" && renderStudents()}
              {section === "profile" && renderProfile()}
            </>
          )}
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="position-fixed top-0 start-0 vw-100 vh-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
        >
          <form
            onSubmit={handleModalSubmit}
            className="bg-white p-4 rounded shadow-lg"
            style={{ width: "24rem" }}
          >
            <h3 className="mb-3">
              {modalType === "add" ? "Add" : "Edit"}{" "}
              {modalEntity.charAt(0).toUpperCase() + modalEntity.slice(1)}
            </h3>

            {renderModalContent()}

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}