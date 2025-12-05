import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments, fetchAssignments } from "../../../store/slices/adminSlice";

export default function AdminOverview() {
    const dispatch = useDispatch();
    const { enrollments, assignments } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchEnrollments());
        dispatch(fetchAssignments());
    }, [dispatch]);

    const stats = [
        {
            title: "Total Enrollments",
            value: enrollments.length,
            colorClass: "bg-primary text-primary-content",
            icon: "👥",
        },
        {
            title: "Pending Assignments",
            value: assignments.filter((a) => a.status === "submitted").length,
            colorClass: "bg-warning text-warning-content",
            icon: "📝",
        },
        {
            title: "Reviewed Assignments",
            value: assignments.filter((a) => a.status === "reviewed").length,
            colorClass: "bg-success text-success-content",
            icon: "✅",
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Admin Dashboard Overview</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`card shadow-lg ${stat.colorClass}`}>
                        <div className="card-body p-4 sm:p-6">
                            <div className="text-3xl sm:text-4xl">{stat.icon}</div>
                            <h2 className="card-title text-xl sm:text-2xl mt-2">{stat.value}</h2>
                            <p className="opacity-90 text-sm sm:text-base">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Enrollments: table on md+, cards on small screens */}
            <div>
                <div className="hidden md:block">
                    <div className="card bg-base-100 border border-base-300 shadow">
                        <div className="card-body">
                            <h2 className="card-title">Recent Enrollments</h2>
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
