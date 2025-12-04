import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <div className="navbar bg-base-100 shadow">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            CourseMaster
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link to="/login" className="btn btn-sm">Login</Link>
          <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
