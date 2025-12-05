import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, setPage } from "../../../store/slices/coursesSlice";
import { deleteCourseAsync, clearSuccess } from "../../../store/slices/adminSlice";
import { Link } from "react-router-dom";

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
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Courses</h1>
                <Link to="/admin/courses/create" className="btn btn-primary">
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-base-100">
                                        <td className="max-w-xs truncate font-semibold">{course.title}</td>
                                        <td>{course.instructorName}</td>
                                        <td>৳{course.price}</td>
                                        <td>{course.category || "-"}</td>
                                        <td className="space-x-2">
                                            <Link to={`/admin/courses/edit/${course._id}`} className="btn btn-sm btn-warning">Edit</Link>
                                            <button onClick={() => handleDelete(course._id)} className="btn btn-sm btn-error">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards for small screens */}
                    <div className="md:hidden space-y-3">
                        {courses.map((course) => (
                            <div key={course._id} className="card bg-base-100 shadow-sm border border-base-200">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-lg">{course.title}</div>
                                            <div className="text-sm text-base-content/70">{course.instructorName}</div>
                                            <div className="text-sm text-base-content/70">{course.category || "-"}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold">৳{course.price}</div>
                                            <div className="mt-2 space-x-2">
                                                <Link to={`/admin/courses/edit/${course._id}`} className="btn btn-xs btn-warning">Edit</Link>
                                                <button onClick={() => handleDelete(course._id)} className="btn btn-xs btn-error">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
