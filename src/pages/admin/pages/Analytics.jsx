import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getAnalytics } from "../../../services/admin.api";

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getAnalytics();
                setData(res.data);
            } catch (err) {
                console.error("Failed to load analytics:", err);
                setError(err.response?.data?.message || "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="alert">
                <span>No analytics data available</span>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="card bg-primary text-primary-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-semibold opacity-80">Total Enrollments</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{data.stats.totalEnrollments}</p>
                    </div>
                </div>

                <div className="card bg-secondary text-secondary-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-semibold opacity-80">Total Courses</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{data.stats.totalCourses}</p>
                    </div>
                </div>

                <div className="card bg-accent text-accent-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-semibold opacity-80">Total Students</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{data.stats.totalStudents}</p>
                    </div>
                </div>

                <div className="card bg-info text-info-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="text-xs sm:text-sm font-semibold opacity-80">Last 30 Days</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{data.stats.enrollmentsLast30Days}</p>
                    </div>
                </div>
            </div>

            {/* Enrollments Over Time Chart */}
            <div className="card bg-base-100 shadow">
                <div className="card-body p-4 sm:p-6">
                    <h3 className="card-title text-base sm:text-lg mb-4">Enrollments Over Time (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="enrollments"
                                stroke="#8884d8"
                                strokeWidth={2}
                                name="Enrollments"
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Courses by Enrollments */}
            {data.enrollmentsByCourse && data.enrollmentsByCourse.length > 0 && (
                <div className="card bg-base-100 shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="card-title text-base sm:text-lg mb-4">Top Courses by Enrollments</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.enrollmentsByCourse} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="courseName"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="enrollments" fill="#82ca9d" name="Enrollments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-200 shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold mb-2">Platform Statistics</h3>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                                <span>Total Instructors:</span>
                                <span className="font-bold">{data.stats.totalInstructors}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Average Enrollments per Course:</span>
                                <span className="font-bold">
                                    {data.stats.totalCourses > 0
                                        ? Math.round(data.stats.totalEnrollments / data.stats.totalCourses)
                                        : 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-200 shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="text-sm sm:text-base font-semibold mb-2">Growth Metrics</h3>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex justify-between">
                                <span>Enrollments (Last 30 Days):</span>
                                <span className="font-bold text-primary">{data.stats.enrollmentsLast30Days}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Daily Average:</span>
                                <span className="font-bold">
                                    {Math.round((data.stats.enrollmentsLast30Days / 30) * 10) / 10}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

