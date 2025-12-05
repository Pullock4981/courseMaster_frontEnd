import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCourseById,
    clearCurrentCourse,
} from "../../store/slices/coursesSlice";
import {
    enrollCourseAsync,
    clearSuccess,
    clearError,
} from "../../store/slices/enrollmentSlice";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = getToken();
    const dispatch = useDispatch();

    const { currentCourse, detailLoading, error: courseError } = useSelector(
        (state) => state.courses
    );
    const { enrolling, error: enrollError, success } = useSelector(
        (state) => state.enrollment
    );

    useEffect(() => {
        dispatch(fetchCourseById(id));
        return () => dispatch(clearCurrentCourse());
    }, [id, dispatch]);

    const handleEnroll = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        dispatch(enrollCourseAsync(id));
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/student");
                dispatch(clearSuccess());
            }, 2000);
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
        <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-md">
                <div className="card-body">
                    <h1 className="text-4xl font-extrabold text-primary">{course.title}</h1>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {course.tags?.map((tag, i) => (
                            <span key={i} className="badge badge-outline border-primary text-primary">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className="mt-4 text-lg text-base-content/70">
                        Instructor: <span className="font-semibold">{course.instructorName}</span>
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                        <p className="text-3xl font-bold text-primary">৳ {course.price}</p>

                        {success ? (
                            <div className="alert alert-success">
                                <span>{success}</span>
                            </div>
                        ) : enrollError ? (
                            <div className="alert alert-error">
                                <span>{enrollError}</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="btn btn-primary gap-2"
                            >
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

            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                    <h2 className="text-xl font-semibold">Course Description</h2>
                    <p className="text-base-content/80 leading-relaxed">
                        {course.description}
                    </p>
                </div>
            </div>

            {course.syllabus && course.syllabus.length > 0 && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold">Course Syllabus</h2>

                        <div className="space-y-3 mt-4">
                            {course.syllabus.map((module, modIdx) => (
                                <div
                                    key={module._id || modIdx}
                                    className="collapse collapse-arrow border border-base-300"
                                >
                                    <input type="checkbox" defaultChecked={modIdx === 0} />
                                    <div className="collapse-title font-semibold bg-base-200 hover:bg-base-300">
                                        📚 {module.title}
                                    </div>
                                    <div className="collapse-content">
                                        <ul className="space-y-2 pt-4 pl-4">
                                            {module.lessons?.map((lesson, lesIdx) => (
                                                <li
                                                    key={lesson._id || lesIdx}
                                                    className="flex items-start gap-3 p-2 rounded hover:bg-base-200"
                                                >
                                                    <span className="badge badge-outline">
                                                        {lesIdx + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{lesson.title}</p>
                                                        {lesson.videoUrl && (
                                                            <a
                                                                href={lesson.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary text-sm hover:underline"
                                                            >
                                                                🎬 Watch Video
                                                            </a>
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

            {course.batches && course.batches.length > 0 && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body">
                        <h2 className="text-xl font-semibold">Available Batches</h2>
                        <div className="space-y-2">
                            {course.batches.map((batch, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-base-200 rounded">
                                    <span className="font-semibold">{batch.name}</span>
                                    <span className="text-sm text-base-content/70">
                                        Start: {new Date(batch.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
