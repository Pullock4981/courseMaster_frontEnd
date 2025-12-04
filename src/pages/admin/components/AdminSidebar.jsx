import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Users,
    ClipboardList,
    HelpCircle,
} from "lucide-react";

export default function AdminSidebar() {
    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-primary text-black font-semibold rounded-lg"
            : "text-gray-800 font-medium hover:bg-primary/10 hover:text-primary rounded-lg";

    const Item = ({ to, label, Icon, end }) => (
        <NavLink
            to={to}
            end={end}
            className={linkClass + " flex items-center gap-3 px-3 py-2"}
        >
            <Icon className="w-5 h-5 shrink-0" />
            {/* text only on md+ */}
            <span className="hidden md:inline">{label}</span>
        </NavLink>
    );

    return (
        <aside
            className="
        bg-base-200 border-r border-base-300 min-h-screen
        w-16 md:w-64 p-2 md:p-4 space-y-2
        transition-all duration-200
      "
        >
            <Item to="/admin" label="Overview" Icon={LayoutDashboard} end />
            <Item to="/admin/courses" label="Manage Courses" Icon={BookOpen} />
            <Item to="/admin/courses/create" label="Add Course" Icon={PlusCircle} />
            <Item to="/admin/users" label="Manage Users" Icon={Users} />
            <Item to="/admin/assignments" label="Assignments" Icon={ClipboardList} />
            <Item to="/admin/quizzes" label="Quizzes" Icon={HelpCircle} />
        </aside>
    );
}
