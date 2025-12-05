import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEnrollments } from "../../store/slices/enrollmentSlice";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const { enrollments, loading, error } = useSelector((state) => state.enrollment);

    useEffect(() => {
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Courses</h1>
                <Link to="/" className="btn btn-outline">
                    Browse More Courses
                </Link>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {enrollments.length === 0 ? (
                <div className="card bg-base-200">
                    <div className="card-body text-center py-12">
                        <h2 className="card-title justify-center">No courses enrolled yet</h2>
                        <p className="text-base-content/70">
                            Start your learning journey by enrolling in a course
                        </p>
                        <Link to="/" className="btn btn-primary w-fit mx-auto mt-4">
                            Browse Courses
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {enrollments.map((enrollment) => (
                        <div
                            key={enrollment._id}
                            className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition"
                        >
                            <div className="card-body">
                                <h2 className="card-title text-lg line-clamp-2">
                                    {enrollment.course?.title}
                                </h2>

                                <p className="text-sm text-base-content/70">
                                    Instructor: {enrollment.course?.instructorName}
                                </p>

                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-semibold">Progress</p>
                                        <p className="text-sm font-bold text-primary">
                                            {enrollment.progress?.percent || 0}%
                                        </p>
                                    </div>
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={enrollment.progress?.percent || 0}
                                        max="100"
                                    ></progress>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <Link
                                        to={`/courses/${enrollment.course?._id}/player`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Continue Learning
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
