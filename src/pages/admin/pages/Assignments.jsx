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
        const submission = assignments.find(a => a._id === id);
        setReviewingId(id);
        // Pre-fill if already reviewed
        setReviewNotes(submission?.reviewNotes || "");
        setReviewGrade(submission?.grade?.toString() || "");
    };

    const submitReview = async () => {
        if (!reviewingId) return;

        // Validate required fields
        if (!reviewGrade || reviewGrade.trim() === "") {
            alert("Please enter a grade (0-100)");
            return;
        }
        if (!reviewNotes || reviewNotes.trim() === "") {
            alert("Please provide feedback to the student");
            return;
        }

        const gradeNum = Number(reviewGrade);
        if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
            alert("Grade must be a number between 0 and 100");
            return;
        }

        try {
            setActionLoading(true);
            await reviewAssignment(reviewingId, {
                status: "reviewed",
                reviewNotes: reviewNotes.trim(),
                grade: gradeNum
            });
            await dispatch(fetchAssignments());
            // reset
            setReviewingId(null);
            setReviewNotes("");
            setReviewGrade("");
            alert("Review submitted successfully! Student can now see their grade and feedback.");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to submit review. Please try again.");
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
        <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Assignment Review</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="card bg-primary text-primary-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="font-semibold text-sm sm:text-base">Total Assignments</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                    </div>
                </div>

                <div className="card bg-warning text-warning-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="font-semibold text-sm sm:text-base">Pending Review</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{stats.submitted}</p>
                    </div>
                </div>

                <div className="card bg-success text-success-content shadow">
                    <div className="card-body p-4 sm:p-6">
                        <h3 className="font-semibold text-sm sm:text-base">Reviewed</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{stats.reviewed}</p>
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

            {/* Enhanced review form (shown when admin clicks Review) */}
            {activeSubmission && (
                <div className="card bg-base-100 shadow-lg border-2 border-primary">
                    <div className="card-body p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg sm:text-xl">📝 Review Assignment Submission</h3>
                                <div className="text-xs sm:text-sm text-base-content/70 mt-1 space-y-1">
                                    <p><strong>Student:</strong> {activeSubmission.student?.name} ({activeSubmission.student?.email})</p>
                                    <p><strong>Course:</strong> {activeSubmission.course?.title}</p>
                                    {activeSubmission.lessonTitle && (
                                        <p><strong>Lesson:</strong> {activeSubmission.lessonTitle}</p>
                                    )}
                                    <p><strong>Submitted:</strong> {new Date(activeSubmission.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-ghost self-start sm:self-auto"
                                onClick={() => setReviewingId(null)}
                                disabled={actionLoading}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Assignment Prompt */}
                        {activeSubmission.assignmentPrompt && (
                            <div className="alert alert-info mb-4">
                                <div>
                                    <p className="font-semibold mb-1">Assignment Prompt:</p>
                                    <p className="text-sm">{activeSubmission.assignmentPrompt}</p>
                                </div>
                            </div>
                        )}

                        {/* Student Submission */}
                        <div className="card bg-base-200 mb-4">
                            <div className="card-body p-4">
                                <h4 className="font-semibold mb-2">Student's Submission:</h4>
                                {activeSubmission.answerType === "link" ? (
                                    <div>
                                        <p className="text-sm text-base-content/70 mb-2">Submission Type: Link</p>
                                        <a
                                            href={activeSubmission.answer}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline break-all font-semibold"
                                        >
                                            {activeSubmission.answer}
                                        </a>
                                        <p className="text-xs text-base-content/60 mt-2">
                                            Click to open in new tab
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-base-content/70 mb-2">Submission Type: Text</p>
                                        <div className="bg-base-100 p-3 rounded border border-base-300">
                                            <p className="text-sm whitespace-pre-wrap">{activeSubmission.answer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Previous Review (if exists) */}
                        {activeSubmission.status === "reviewed" && (
                            <div className="alert alert-warning mb-4">
                                <div>
                                    <p className="font-semibold mb-1">Previous Review:</p>
                                    {activeSubmission.grade !== null && activeSubmission.grade !== undefined && (
                                        <p className="text-sm"><strong>Grade:</strong> {activeSubmission.grade}%</p>
                                    )}
                                    {activeSubmission.reviewNotes && (
                                        <p className="text-sm mt-1"><strong>Feedback:</strong> {activeSubmission.reviewNotes}</p>
                                    )}
                                    {activeSubmission.reviewer?.name && (
                                        <p className="text-xs mt-1 text-base-content/60">Reviewed by: {activeSubmission.reviewer.name}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Review Form */}
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Grade (0-100) *</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    placeholder="Enter grade (0-100)"
                                    value={reviewGrade}
                                    onChange={(e) => setReviewGrade(e.target.value)}
                                    className="input input-bordered"
                                    required
                                />
                                <label className="label">
                                    <span className="label-text-alt">Percentage score for this assignment</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Feedback / Review Notes *</span>
                                </label>
                                <textarea
                                    placeholder="Provide detailed feedback to the student..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    className="textarea textarea-bordered h-32"
                                    required
                                />
                                <label className="label">
                                    <span className="label-text-alt">Helpful feedback helps students improve</span>
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="btn btn-primary flex-1"
                                    onClick={submitReview}
                                    disabled={actionLoading || !reviewGrade || !reviewNotes.trim()}
                                >
                                    {actionLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        "✓ Submit Review"
                                    )}
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setReviewingId(null);
                                        setReviewNotes("");
                                        setReviewGrade("");
                                    }}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
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
                                    <th>Lesson</th>
                                    <th>Submission</th>
                                    <th>Submitted Date</th>
                                    <th>Status</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((assign) => (
                                    <tr key={assign._id} className="hover:bg-base-100">
                                        <td className="font-semibold">{assign.student?.name}</td>
                                        <td>{assign.course?.title}</td>
                                        <td className="max-w-xs">
                                            <span className="text-sm">{assign.lessonTitle || "Unknown"}</span>
                                        </td>
                                        <td className="max-w-xs">
                                            {assign.answerType === "link" ? (
                                                <a
                                                    href={assign.answer}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-xs truncate block"
                                                    title={assign.answer}
                                                >
                                                    🔗 Link
                                                </a>
                                            ) : (
                                                <span className="text-xs truncate block" title={assign.answer}>
                                                    📄 {assign.answer.substring(0, 30)}...
                                                </span>
                                            )}
                                        </td>
                                        <td>{new Date(assign.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span
                                                className={`badge ${assign.status === "submitted"
                                                    ? "badge-warning"
                                                    : "badge-success"
                                                    }`}
                                            >
                                                {assign.status === "submitted" ? "Pending" : "Reviewed"}
                                            </span>
                                        </td>
                                        <td>
                                            {assign.grade !== null && assign.grade !== undefined ? (
                                                <span className={`font-bold ${assign.grade >= 70 ? 'text-success' : assign.grade >= 50 ? 'text-warning' : 'text-error'}`}>
                                                    {assign.grade}%
                                                </span>
                                            ) : (
                                                <span className="text-base-content/50">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {assign.status === "submitted" ? (
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => startReview(assign._id)}
                                                        disabled={reviewingId === assign._id}
                                                    >
                                                        {reviewingId === assign._id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            "Review"
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => startReview(assign._id)}
                                                        disabled={reviewingId === assign._id}
                                                    >
                                                        {reviewingId === assign._id ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            "Edit Review"
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
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="font-semibold">{assign.student?.name}</div>
                                            <div className="text-sm text-base-content/70">{assign.course?.title}</div>
                                            {assign.lessonTitle && (
                                                <div className="text-xs text-base-content/60 mt-1">Lesson: {assign.lessonTitle}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`badge ${assign.status === "submitted"
                                                    ? "badge-warning"
                                                    : "badge-success"
                                                    }`}
                                            >
                                                {assign.status === "submitted" ? "Pending" : "Reviewed"}
                                            </span>
                                            {assign.grade !== null && assign.grade !== undefined && (
                                                <p className={`text-sm font-bold mt-1 ${assign.grade >= 70 ? 'text-success' : assign.grade >= 50 ? 'text-warning' : 'text-error'}`}>
                                                    {assign.grade}%
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 p-2 bg-base-200 rounded">
                                        <p className="text-xs text-base-content/70 mb-1">Submission:</p>
                                        {assign.answerType === "link" ? (
                                            <a
                                                href={assign.answer}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-xs break-all"
                                            >
                                                🔗 {assign.answer}
                                            </a>
                                        ) : (
                                            <p className="text-xs break-words line-clamp-2">{assign.answer}</p>
                                        )}
                                    </div>

                                    <div className="text-xs text-base-content/60 mt-2">
                                        Submitted: {new Date(assign.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="mt-3">
                                        {assign.status === "submitted" ? (
                                            <button
                                                className="btn btn-sm btn-primary w-full"
                                                onClick={() => startReview(assign._id)}
                                                disabled={reviewingId === assign._id}
                                            >
                                                {reviewingId === assign._id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    "Review"
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-outline w-full"
                                                onClick={() => startReview(assign._id)}
                                                disabled={reviewingId === assign._id}
                                            >
                                                {reviewingId === assign._id ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    "Edit Review"
                                                )}
                                            </button>
                                        )}
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
