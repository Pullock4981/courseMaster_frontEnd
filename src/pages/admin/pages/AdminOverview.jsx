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
            color: "primary",
            icon: "👥",
        },
        {
            title: "Pending Assignments",
            value: assignments.filter((a) => a.status === "submitted").length,
            color: "warning",
            icon: "📝",
        },
        {
            title: "Reviewed Assignments",
            value: assignments.filter((a) => a.status === "reviewed").length,
            color: "success",
            icon: "✅",
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`card bg-linear-to-br from-${stat.color} to-${stat.color}-focus text-${stat.color}-content shadow-lg`}
                    >
                        <div className="card-body">
                            <div className="text-4xl">{stat.icon}</div>
                            <h2 className="card-title text-2xl mt-2">{stat.value}</h2>
                            <p className="opacity-90">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

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
                                    {enrollments.slice(0, 5).map((enroll) => (
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
    );
}
