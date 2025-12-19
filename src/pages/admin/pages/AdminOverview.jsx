import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEnrollments, fetchAssignments } from "../../../store/slices/adminSlice";
import { getAnalytics } from "../../../services/admin.api";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import {
    Plus,
    BookOpen,
    FileText,
    Users,
    BarChart3,
    Video,
    Settings,
    TrendingUp,
} from "lucide-react";

export default function AdminOverview() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enrollments, assignments } = useSelector((state) => state.admin);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchEnrollments());
        dispatch(fetchAssignments());
        loadAnalytics();
    }, [dispatch]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const res = await getAnalytics();
            setAnalytics(res.data);
        } catch (err) {
            console.error("Failed to load analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: "Total Enrollments",
            value: enrollments.length,
            colorClass: "bg-gradient-to-br from-primary to-primary/80 text-primary-content",
            icon: <Users className="w-8 h-8" />,
            trend: "+12%",
        },
        {
            title: "Pending Assignments",
            value: assignments.filter((a) => a.status === "submitted").length,
            colorClass: "bg-gradient-to-br from-warning to-warning/80 text-warning-content",
            icon: <FileText className="w-8 h-8" />,
            trend: null,
        },
        {
            title: "Reviewed Assignments",
            value: assignments.filter((a) => a.status === "reviewed").length,
            colorClass: "bg-gradient-to-br from-success to-success/80 text-success-content",
            icon: <FileText className="w-8 h-8" />,
            trend: null,
        },
    ];

    const quickActions = [
        {
            label: "Add Course",
            icon: <Plus className="w-5 h-5" />,
            path: "/admin/courses/create",
            color: "btn-primary",
        },
        {
            label: "Manage Courses",
            icon: <BookOpen className="w-5 h-5" />,
            path: "/admin/courses",
            color: "btn-secondary",
        },
        {
            label: "Review Assignments",
            icon: <FileText className="w-5 h-5" />,
            path: "/admin/assignments",
            color: "btn-warning",
        },
        {
            label: "Video Classes",
            icon: <Video className="w-5 h-5" />,
            path: "/admin/video-classes",
            color: "btn-accent",
        },
        {
            label: "Manage Users",
            icon: <Users className="w-5 h-5" />,
            path: "/admin/users",
            color: "btn-info",
        },
        {
            label: "Analytics",
            icon: <BarChart3 className="w-5 h-5" />,
            path: "/admin/analytics",
            color: "btn-success",
        },
    ];

    // Prepare chart data
    const enrollmentChartData = analytics?.chartData || [];
    
    const assignmentStatusData = [
        {
            name: "Reviewed",
            value: assignments.filter((a) => a.status === "reviewed").length,
            color: "#78A083",
        },
        {
            name: "Pending",
            value: assignments.filter((a) => a.status === "submitted").length,
            color: "#F59E0B",
        },
    ];

    // Enrollment by course (top 5)
    const courseEnrollmentData = analytics?.topCourses?.slice(0, 5).map((course) => ({
        name: course.courseTitle?.substring(0, 15) || "Unknown",
        enrollments: course.count,
    })) || [];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="page-heading">Admin Dashboard Overview</h1>
                <div className="badge badge-primary badge-lg gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Live Dashboard
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="page-heading-h2 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigate(action.path)}
                                className={`btn ${action.color} btn-sm sm:btn-md flex-col gap-2 h-auto py-4`}
                            >
                                {action.icon}
                                <span className="text-xs sm:text-sm">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`card shadow-lg ${stat.colorClass} hover:scale-105 transition-transform`}>
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="opacity-90 text-sm sm:text-base mb-2">{stat.title}</p>
                                    <h2 className="text-3xl sm:text-4xl font-bold">{stat.value}</h2>
                                    {stat.trend && (
                                        <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
                                            <TrendingUp className="w-4 h-4" />
                                            {stat.trend}
                                        </div>
                                    )}
                                </div>
                                <div className="opacity-80">{stat.icon}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Enrollment Trend Chart */}
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-4 sm:p-6">
                        <h2 className="page-heading-h2 mb-4">Enrollment Trends (Last 30 Days)</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : enrollmentChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={enrollmentChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                    <XAxis
                                        dataKey="displayDate"
                                        tick={{ fontSize: 11 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--color-base-100)",
                                            border: "1px solid var(--color-base-300)",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Bar dataKey="enrollments" fill="#78A083" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-64 text-base-content/60">
                                No enrollment data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignment Status Pie Chart */}
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-4 sm:p-6">
                        <h2 className="page-heading-h2 mb-4">Assignment Status</h2>
                        {assignmentStatusData.some((d) => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={assignmentStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {assignmentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--color-base-100)",
                                            border: "1px solid var(--color-base-300)",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-64 text-base-content/60">
                                No assignment data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Courses Chart */}
            {courseEnrollmentData.length > 0 && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-4 sm:p-6">
                        <h2 className="page-heading-h2 mb-4">Top Courses by Enrollments</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={courseEnrollmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--color-base-100)",
                                        border: "1px solid var(--color-base-300)",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Bar dataKey="enrollments" fill="#50727B" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Analytics Summary Section */}
            {analytics && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <h2 className="page-heading-h2">Analytics Summary</h2>
                            <Link to="/admin/analytics" className="btn btn-primary btn-sm">
                                View Full Analytics →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="stat bg-primary/10 rounded-lg p-3 sm:p-4">
                                <div className="stat-title text-xs">Total Courses</div>
                                <div className="stat-value text-lg sm:text-2xl text-primary">{analytics.stats?.totalCourses || 0}</div>
                            </div>
                            <div className="stat bg-secondary/10 rounded-lg p-3 sm:p-4">
                                <div className="stat-title text-xs">Total Students</div>
                                <div className="stat-value text-lg sm:text-2xl text-secondary">{analytics.stats?.totalStudents || 0}</div>
                            </div>
                            <div className="stat bg-accent/10 rounded-lg p-3 sm:p-4">
                                <div className="stat-title text-xs">Total Enrollments</div>
                                <div className="stat-value text-lg sm:text-2xl text-accent">{analytics.stats?.totalEnrollments || 0}</div>
                            </div>
                            <div className="stat bg-info/10 rounded-lg p-3 sm:p-4">
                                <div className="stat-title text-xs">Last 30 Days</div>
                                <div className="stat-value text-lg sm:text-2xl text-info">{analytics.stats?.enrollmentsLast30Days || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Enrollments: table on md+, cards on small screens */}
            <div>
                <div className="hidden md:block">
                    <div className="card bg-base-100 border border-base-300 shadow">
                        <div className="card-body">
                            <h2 className="page-heading-h2">Recent Enrollments</h2>
                            {enrollments.length === 0 ? (
                                <p className="text-base-content/70">No enrollments yet</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Course</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {enrollments.slice(0, 10).map((enroll) => (
                                                <tr key={enroll._id}>
                                                    <td>{enroll.student?.name}</td>
                                                    <td>{enroll.course?.title}</td>
                                                    <td>{new Date(enroll.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:hidden space-y-3">
                    {enrollments.length === 0 ? (
                        <p className="text-base-content/70">No enrollments yet</p>
                    ) : (
                        enrollments.slice(0, 10).map((enroll) => (
                            <div key={enroll._id} className="card bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold">{enroll.student?.name}</div>
                                            <div className="text-sm text-base-content/70">{enroll.course?.title}</div>
                                        </div>
                                        <div className="text-xs text-base-content/60">{new Date(enroll.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
