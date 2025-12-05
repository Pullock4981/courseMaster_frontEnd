import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCourseById,
    clearCurrentCourse,
} from "../../store/slices/coursesSlice";
import { enrollCourseAsync, clearSuccess } from "../../store/slices/enrollmentSlice";
import { getMeAsync } from "../../store/slices/authSlice";

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse, detailLoading, error: courseError } = useSelector((state) => state.courses);
    const { enrolling, error: enrollError, success, enrollments: myEnrollments } = useSelector((state) => state.enrollment);
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [selectedBatchId, setSelectedBatchId] = useState(null);

    useEffect(() => {
        dispatch(fetchCourseById(id));
        return () => dispatch(clearCurrentCourse());
    }, [id, dispatch]);

    // Load user if token exists but user is not loaded
    useEffect(() => {
        if (token && !user) {
            dispatch(getMeAsync());
        }
    }, [token, user, dispatch]);

    const isCreator = user && currentCourse && user._id === currentCourse.instructorId;
    const isAdmin = user && user.role === "admin";
    const cannotEnroll = isAdmin || isCreator;

    const alreadyEnrolled = !!myEnrollments?.find((e) => e.course?._id === id);

    const handleEnroll = async () => {
        // if user object not present but token exists, attempt to fetch profile
        if (!user && token) {
            try {
                await dispatch(getMeAsync()).unwrap();
            } catch (err) {
                // ignore, will redirect to login below
            }
        }

        if (!user && !isAuthenticated) {
            navigate("/login");
            return;
        }

        if (cannotEnroll) return;

        // Note: Since batches don't have _id in the model, we pass null
        // The backend can be updated later to handle batch references properly
        dispatch(enrollCourseAsync({ courseId: id, batchId: selectedBatchId !== null ? selectedBatchId.toString() : null }));
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/student");
                dispatch(clearSuccess());
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate, dispatch]);

    if (detailLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (courseError || !currentCourse) {
        return (
            <div className="alert alert-error">
                <span>{courseError || "Course not found"}</span>
            </div>
        );
    }

    const course = currentCourse;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-md">
                <div className="card-body p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary break-words">{course.title}</h1>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {course.tags?.map((tag, i) => (
                            <span key={i} className="badge badge-outline border-primary text-primary">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-base-content/70">
                        Instructor: <span className="font-semibold">{course.instructorName}</span>
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <p className="text-2xl sm:text-3xl font-bold text-primary">৳ {course.price}</p>

                        <div>
                            {isAdmin ? (
                                <Link
                                    to="/admin/courses"
                                    className="btn btn-warning gap-2"
                                >
                                    📚 Manage Courses
                                </Link>
                            ) : cannotEnroll ? (
                                <div className="mb-2">
                                    <div className="alert alert-info">
                                        <span>Course creators cannot enroll in their own courses.</span>
                                    </div>
                                </div>
                            ) : success ? (
                                <div className="alert alert-success">
                                    <span>{success}</span>
                                </div>
                            ) : enrollError ? (
                                <div className="alert alert-error">
                                    <span>{enrollError}</span>
                                </div>
                            ) : alreadyEnrolled ? (
                                <button onClick={() => navigate('/student')} className="btn btn-outline gap-2">
                                    Go to Dashboard
                                </button>
                            ) : (
                                <button onClick={handleEnroll} disabled={enrolling} className="btn btn-primary gap-2">
                                    {enrolling ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Enrolling...
                                        </>
                                    ) : (
                                        "Enroll Now"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Course Description</h2>
                    <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">{course.description}</p>
                </div>
            </div>

            {/* Show syllabus only if enrolled OR if admin */}
            {(alreadyEnrolled || isAdmin) && course.syllabus && course.syllabus.length > 0 && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold">Course Syllabus</h2>
                            {isAdmin && (
                                <Link
                                    to={`/admin/courses/edit/${id}`}
                                    className="btn btn-sm btn-warning gap-2"
                                >
                                    ✏️ Edit Syllabus
                                </Link>
                            )}
                        </div>

                        <div className="space-y-3 mt-4">
                            {course.syllabus.map((module, modIdx) => (
                                <div key={module._id || modIdx} className="collapse collapse-arrow border border-base-300">
                                    <input type="checkbox" defaultChecked={modIdx === 0} />
                                    <div className="collapse-title font-semibold bg-base-200 hover:bg-base-300">📚 {module.title}</div>
                                    <div className="collapse-content">
                                        <ul className="space-y-2 pt-4 pl-4">
                                            {module.lessons?.map((lesson, lesIdx) => (
                                                <li key={lesson._id || lesIdx} className="flex items-start gap-3 p-2 rounded hover:bg-base-200">
                                                    <span className="badge badge-outline">{lesIdx + 1}</span>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{lesson.title}</p>
                                                        {lesson.videoUrl && (
                                                            <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">🎬 Watch Video</a>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Show message if not enrolled and not admin */}
            {!alreadyEnrolled && !isAdmin && course.syllabus && course.syllabus.length > 0 && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold">Course Syllabus</h2>
                        <div className="alert alert-info mt-4">
                            <span>📚 Enroll in this course to view the complete syllabus and access all lessons.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Show "Add Syllabus" option for admin if no syllabus exists */}
            {isAdmin && (!course.syllabus || course.syllabus.length === 0) && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold">Course Syllabus</h2>
                        <div className="alert alert-warning mt-4">
                            <span>📚 No syllabus added yet. Click below to add syllabus and lessons.</span>
                        </div>
                        <Link
                            to={`/admin/courses/edit/${id}`}
                            className="btn btn-warning mt-4 gap-2"
                        >
                            ➕ Add Syllabus
                        </Link>
                    </div>
                </div>
            )}

            {course.batches && course.batches.length > 0 && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold mb-4">Available Batches</h2>
                        <div className="space-y-2">
                            {course.batches.map((batch, idx) => {
                                // Use index as batch identifier since batches don't have _id
                                const batchIndex = idx;
                                const isSelected = selectedBatchId === batchIndex;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedBatchId(isSelected ? null : batchIndex)}
                                        className={`flex justify-between items-center p-3 rounded cursor-pointer transition ${isSelected
                                            ? "bg-primary text-primary-content border-2 border-primary"
                                            : "bg-base-200 hover:bg-base-300 border-2 border-transparent"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={isSelected}
                                                onChange={() => setSelectedBatchId(isSelected ? null : batchIndex)}
                                                className="radio radio-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="font-semibold">{batch.name}</span>
                                        </div>
                                        <span className="text-sm opacity-80">
                                            {batch.startDate ? `Start: ${new Date(batch.startDate).toLocaleDateString()}` : "No start date"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedBatchId && (
                            <div className="mt-3 text-sm text-primary">
                                ✓ Batch selected for enrollment
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
