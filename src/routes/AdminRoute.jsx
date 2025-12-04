import { Navigate } from "react-router-dom";

export default function AdminRoute({ children, me }) {
    if (!me) return null; // me loading থাকলে কিছু রেন্ডার না
    if (me.role !== "admin") return <Navigate to="/student" replace />;
    return children;
}
