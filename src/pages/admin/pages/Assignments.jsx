import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignments } from "../../../store/slices/adminSlice";
import { reviewAssignment } from "../../../services/admin.api";

export default function Assignments() {
    const dispatch = useDispatch();
    const { assignments, loading } = useSelector((state) => state.admin);

    const [filterStatus, setFilterStatus] = useState("all"); // all, submitted, reviewed
    const [searchStudent, setSearchStudent] = useState("");
    const [reviewingId, setReviewingId] = useState(null);
    const [reviewNotes, setReviewNotes] = useState("");
    const [reviewGrade, setReviewGrade] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchAssignments());
    }, [dispatch]);

    // start review: open the inline review form for this submission
    const startReview = (id) => {
        setReviewingId(id);
        setReviewNotes("");
        setReviewGrade("");
    };

    const submitReview = async () => {
        if (!reviewingId) return;
        try {
            setActionLoading(true);
            const gradeVal = reviewGrade === "" ? undefined : Number(reviewGrade);
            await reviewAssignment(reviewingId, { status: "reviewed", reviewNotes, grade: gradeVal });
            await dispatch(fetchAssignments());
            // reset
            setReviewingId(null);
            setReviewNotes("");
            setReviewGrade("");
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    // Filter assignments by status and student name
    const filteredAssignments = assignments.filter((assign) => {
        const matchStatus = filterStatus === "all" || assign.status === filterStatus;
        const matchStudent = !searchStudent || assign.student?.name?.toLowerCase().includes(searchStudent.toLowerCase());
        return matchStatus && matchStudent;
    });

    const stats = {
        total: assignments.length,
        submitted: assignments.filter((a) => a.status === "submitted").length,
        reviewed: assignments.filter((a) => a.status === "reviewed").length,
    };

    const activeSubmission = assignments.find((a) => a._id === reviewingId);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Assignment Review</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-primary text-primary-content shadow">
                    <div className="card-body">
                        <h3 className="font-semibold">Total Assignments</h3>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                </div>

                <div className="card bg-warning text-warning-content shadow">
                    <div className="card-body">
                        <h3 className="font-semibold">Pending Review</h3>
                        <p className="text-3xl font-bold">{stats.submitted}</p>
                    </div>
                </div>

                <div className="card bg-success text-success-content shadow">
                    <div className="card-body">
                        <h3 className="font-semibold">Reviewed</h3>
                        <p className="text-3xl font-bold">{stats.reviewed}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Filter by Status</span>
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="all">All Assignments</option>
                                <option value="submitted">Pending Review</option>
                                <option value="reviewed">Reviewed</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Search Student</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Search by student name..."
                                value={searchStudent}
                                onChange={(e) => setSearchStudent(e.target.value)}
                                className="input input-bordered"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline review form (shown when admin clicks Start Review) */}
            {activeSubmission && (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h3 className="font-semibold">Review Submission</h3>
                        <div className="text-sm text-base-content/70">Student: {activeSubmission.student?.name} — Course: {activeSubmission.course?.title}</div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                                type="number"
                                placeholder="Grade (optional)"
                                value={reviewGrade}
                                onChange={(e) => setReviewGrade(e.target.value)}
                                className="input input-bordered"
                            />
                            <input
                                type="text"
                                placeholder="Short notes (optional)"
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="input input-bordered"
                            />
                            <div className="flex gap-2">
                                <button className="btn btn-primary" onClick={submitReview} disabled={actionLoading}>
                                    {actionLoading ? <span className="loading loading-spinner loading-xs"></span> : "Mark Reviewed"}
                                </button>
                                <button className="btn btn-ghost" onClick={() => setReviewingId(null)} disabled={actionLoading}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {loading ? (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="alert">
                    <span>No assignments found</span>
                </div>
            ) : (
                <>
                    {/* Table view for md+ */}
                    <div className="hidden md:block overflow-x-auto border border-base-300 rounded-lg">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Assignment</th>
                                    <th>Submitted Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((assign) => (
                                    <tr key={assign._id} className="hover:bg-base-100">
                                        <td className="font-semibold">{assign.student?.name}</td>
                                        <td>{assign.course?.title}</td>
                                        <td className="max-w-xs truncate">{assign.title}</td>
                                        <td>{new Date(assign.submittedAt || assign.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span
                                                className={`badge ${assign.status === "submitted"
                                                    ? "badge-warning"
                                                    : "badge-success"
                                                    }`}
                                            >
                                                {assign.status === "submitted" ? "Pending" : "Reviewed"}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {assign.status === "submitted" && (
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => startReview(assign._id)}
                                                        disabled={reviewingId === assign._id}
                                                    >
                                                        {reviewingId === assign._id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            "Review"
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card view for small screens */}
                    <div className="md:hidden space-y-3">
                        {filteredAssignments.map((assign) => (
                            <div key={assign._id} className="card bg-base-100 shadow-sm border border-base-200">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold">{assign.student?.name}</div>
                                            <div className="text-sm text-base-content/70">{assign.course?.title}</div>
                                            <div className="text-sm text-base-content/70 mt-2">{assign.title}</div>
                                            <div className="text-xs text-base-content/60 mt-2">
                                                {new Date(assign.submittedAt || assign.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                className={`badge ${assign.status === "submitted"
                                                    ? "badge-warning"
                                                    : "badge-success"
                                                    }`}
                                            >
                                                {assign.status === "submitted" ? "Pending" : "Reviewed"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center text-sm text-base-content/60">
                        Showing {filteredAssignments.length} assignment(s)
                    </div>
                </>
            )}
        </div>
    );
}
