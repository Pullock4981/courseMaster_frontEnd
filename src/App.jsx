import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages - keep these loaded immediately
import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import CourseDetails from "./pages/CousrseDetails/CourseDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";

// Lazy load heavy components for code splitting
const CoursePlayer = lazy(() => import("./pages/CoursePlayer/CoursePlayer"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/components/AdminDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/pages/AdminOverview"));
const ManageCourses = lazy(() => import("./pages/admin/pages/ManageCourses"));
const Enrollments = lazy(() => import("./pages/admin/pages/Enrollments"));
const Assignments = lazy(() => import("./pages/admin/pages/Assignments"));
const Analytics = lazy(() => import("./pages/admin/pages/Analytics"));
const CreateCourse = lazy(() => import("./pages/admin/pages/CreateCourse"));
const EditCourse = lazy(() => import("./pages/admin/pages/EditCourse"));
const ManageUsers = lazy(() => import("./pages/admin/pages/ManageUsers"));
const VideoClasses = lazy(() => import("./pages/admin/pages/VideoClasses"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main public layout */}
        <Route element={<MainLayout />}>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* student dashboard (protected) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <StudentDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* course player (protected) */}
          <Route
            path="/courses/:id/player"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <CoursePlayer />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* admin dashboard with nested routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          >
            {/* nested admin pages */}
            <Route index element={<Suspense fallback={<LoadingSpinner />}><AdminOverview /></Suspense>} />
            <Route path="courses" element={<Suspense fallback={<LoadingSpinner />}><ManageCourses /></Suspense>} />
            <Route path="courses/edit/:id" element={<Suspense fallback={<LoadingSpinner />}><EditCourse /></Suspense>} />
            <Route path="courses/create" element={<Suspense fallback={<LoadingSpinner />}><CreateCourse /></Suspense>} />
            <Route path="video-classes" element={<Suspense fallback={<LoadingSpinner />}><VideoClasses /></Suspense>} />
            <Route path="enrollments" element={<Suspense fallback={<LoadingSpinner />}><Enrollments /></Suspense>} />
            <Route path="assignments" element={<Suspense fallback={<LoadingSpinner />}><Assignments /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<LoadingSpinner />}><Analytics /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<LoadingSpinner />}><ManageUsers /></Suspense>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
