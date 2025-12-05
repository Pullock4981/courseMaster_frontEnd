import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Users,
    ClipboardList,
    BarChart3,
    Menu,
    X,
} from "lucide-react";

export default function AdminSidebar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const Item = ({ to, label, Icon, end = true, onClick, showLabel = true }) => {
        const linkClass = ({ isActive: navIsActive }) => {
            // Custom active check for routes with children
            let isActive = navIsActive;

            if (to === '/admin/courses' && !end) {
                // For "Manage Courses", only highlight if we're exactly on /admin/courses
                // Not on /admin/courses/create or /admin/courses/edit/:id
                isActive = location.pathname === '/admin/courses' &&
                    !location.pathname.startsWith('/admin/courses/create') &&
                    !location.pathname.startsWith('/admin/courses/edit/');
            }

            const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";
            if (isActive) {
                return `${baseClasses} bg-primary text-primary-content font-semibold shadow-md`;
            }
            return `${baseClasses} text-gray-800 font-medium hover:bg-primary/10 hover:text-primary`;
        };

        return (
            <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className={linkClass}
            >
                <Icon className="w-5 h-5 shrink-0" />
                {showLabel && <span className="text-sm sm:text-base">{label}</span>}
            </NavLink>
        );
    };

    const menuItems = [
        { to: "/admin", label: "Overview", Icon: LayoutDashboard, end: true },
        { to: "/admin/courses", label: "Manage Courses", Icon: BookOpen, end: false },
        { to: "/admin/courses/create", label: "Add Course", Icon: PlusCircle, end: true },
        { to: "/admin/enrollments", label: "Enrollments", Icon: Users, end: true },
        { to: "/admin/assignments", label: "Assignments", Icon: ClipboardList, end: true },
        { to: "/admin/analytics", label: "Analytics", Icon: BarChart3, end: true },
        { to: "/admin/users", label: "Manage Users", Icon: Users, end: true },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-base-200 border-b border-base-300 p-2">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-sm btn-ghost"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    <span className="ml-2">Admin Menu</span>
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/50"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <aside
                        className="bg-base-200 border-r border-base-300 w-64 h-full p-4 space-y-2 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Admin Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn btn-sm btn-ghost"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {menuItems.map((item) => (
                            <Item
                                key={item.to}
                                to={item.to}
                                label={item.label}
                                Icon={item.Icon}
                                end={item.end}
                                onClick={() => setMobileMenuOpen(false)}
                                showLabel={true}
                            />
                        ))}
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:block bg-base-200 border-r border-base-300 min-h-screen w-64 p-4 space-y-2 transition-all duration-200">
                {menuItems.map((item) => (
                    <Item
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        Icon={item.Icon}
                        end={item.end}
                    />
                ))}
            </aside>
        </>
    );
}
