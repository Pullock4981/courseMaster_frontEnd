import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, setPage } from "../../../store/slices/coursesSlice";
import { deleteCourseAsync, clearSuccess } from "../../../store/slices/adminSlice";
import { Link } from "react-router-dom";

// Helper function to calculate syllabus statistics
const getSyllabusStats = (course) => {
    if (!course.syllabus || course.syllabus.length === 0) {
        return { modules: 0, lessons: 0, quizzes: 0, assignments: 0 };
    }

    let lessons = 0;
    let quizzes = 0;
    let assignments = 0;

    course.syllabus.forEach((module) => {
        if (module.lessons && module.lessons.length > 0) {
            lessons += module.lessons.length;
            module.lessons.forEach((lesson) => {
                if (lesson.quiz && lesson.quiz.length > 0) {
                    quizzes += lesson.quiz.length;
                }
                if (lesson.assignmentPrompt) {
                    assignments += 1;
                }
            });
        }
    });

    return {
        modules: course.syllabus.length,
        lessons,
        quizzes,
        assignments,
    };
};

export default function ManageCourses() {
    const dispatch = useDispatch();
    const { courses, totalPages, page, loading } = useSelector((state) => state.courses);
    const { success, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchCourses({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            dispatch(deleteCourseAsync(id));
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
                dispatch(fetchCourses({ page, limit: 10 }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, dispatch, page]);

    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold">Manage Courses</h1>
                <Link to="/admin/courses/create" className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto">
                    + New Course
                </Link>
            </div>

            {success && (
                <div className="alert alert-success">
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center">
                    <span className="loading loading-spinner"></span>
                </div>
            ) : courses.length === 0 ? (
                <div className="alert">No courses found</div>
            ) : (
                <>
                    {/* Table for md+ */}
                    <div className="hidden md:block overflow-x-auto border border-base-300 rounded-lg">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>Title</th>
                                    <th>Instructor</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Syllabus</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => {
                                    const stats = getSyllabusStats(course);
                                    return (
                                        <tr key={course._id} className="hover:bg-base-100">
                                            <td className="max-w-xs truncate font-semibold">{course.title}</td>
                                            <td>{course.instructorName}</td>
                                            <td>৳{course.price}</td>
                                            <td>{course.category || "-"}</td>
                                            <td>
                                                {stats.modules === 0 ? (
                                                    <span className="text-xs text-base-content/50">No syllabus</span>
                                                ) : (
                                                    <div className="text-xs space-y-1">
                                                        <div>📚 {stats.modules} Module{stats.modules !== 1 ? 's' : ''}</div>
                                                        <div>📖 {stats.lessons} Lesson{stats.lessons !== 1 ? 's' : ''}</div>
                                                        <div className="flex gap-3">
                                                            {stats.quizzes > 0 && (
                                                                <span className="text-primary">❓ {stats.quizzes} Quiz{stats.quizzes !== 1 ? 'zes' : ''}</span>
                                                            )}
                                                            {stats.assignments > 0 && (
                                                                <span className="text-secondary">📝 {stats.assignments} Assignment{stats.assignments !== 1 ? 's' : ''}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="space-x-2">
                                                <Link to={`/admin/courses/edit/${course._id}`} className="btn btn-sm btn-warning">Edit</Link>
                                                <button onClick={() => handleDelete(course._id)} className="btn btn-sm btn-error">Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards for small screens */}
                    <div className="md:hidden space-y-3">
                        {courses.map((course) => {
                            const stats = getSyllabusStats(course);
                            return (
                                <div key={course._id} className="card bg-base-100 shadow-sm border border-base-200">
                                    <div className="card-body p-3 sm:p-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-base sm:text-lg break-words">{course.title}</div>
                                                <div className="text-xs sm:text-sm text-base-content/70 mt-1">{course.instructorName}</div>
                                                <div className="text-xs sm:text-sm text-base-content/70">{course.category || "-"}</div>

                                                {/* Syllabus Stats */}
                                                {stats.modules > 0 && (
                                                    <div className="mt-3 p-2 bg-base-200 rounded text-xs space-y-1">
                                                        <div className="font-semibold">Syllabus:</div>
                                                        <div>📚 {stats.modules} Module{stats.modules !== 1 ? 's' : ''} • 📖 {stats.lessons} Lesson{stats.lessons !== 1 ? 's' : ''}</div>
                                                        {(stats.quizzes > 0 || stats.assignments > 0) && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {stats.quizzes > 0 && (
                                                                    <span className="text-primary">❓ {stats.quizzes} Quiz{stats.quizzes !== 1 ? 'zes' : ''}</span>
                                                                )}
                                                                {stats.assignments > 0 && (
                                                                    <span className="text-secondary">📝 {stats.assignments} Assignment{stats.assignments !== 1 ? 's' : ''}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {stats.modules === 0 && (
                                                    <div className="mt-2 text-xs text-base-content/50">No syllabus added</div>
                                                )}
                                            </div>
                                            <div className="flex sm:flex-col sm:text-right sm:ml-3 justify-between sm:justify-start items-center sm:items-end gap-2">
                                                <div className="text-base sm:text-lg font-bold">৳{course.price}</div>
                                                <div className="flex sm:flex-col gap-2">
                                                    <Link to={`/admin/courses/edit/${course._id}`} className="btn btn-xs btn-warning">Edit</Link>
                                                    <button onClick={() => handleDelete(course._id)} className="btn btn-xs btn-error">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => dispatch(setPage(pageNum))}
                                    className={`btn btn-sm ${page === pageNum ? "btn-primary" : "btn-outline"}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
