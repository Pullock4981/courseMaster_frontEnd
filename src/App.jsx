import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// public pages
import Home from "./pages/Home/Home";
import CourseDetails from "./pages/CousrseDetails/CourseDetails";
import CoursePlayer from "./pages/CoursePlayer/CoursePlayer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/components/AdminDashboard";
import AdminOverview from "./pages/admin/pages/AdminOverview";
import ManageCourses from "./pages/admin/pages/ManageCourses";
import Enrollments from "./pages/admin/pages/Enrollments";
import Assignments from "./pages/admin/pages/Assignments";
import CreateCourse from "./pages/admin/pages/CreateCourse";
import EditCourse from "./pages/admin/pages/EditCourse";
import ManageUsers from "./pages/admin/pages/ManageUsers";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main public layout */}
        <Route element={<MainLayout />}>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* student dashboard (protected) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* course player (protected) */}
          <Route
            path="/courses/:id/player"
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* admin dashboard with nested routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* nested admin pages */}
            <Route index element={<AdminOverview />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="courses/edit/:id" element={<EditCourse />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
