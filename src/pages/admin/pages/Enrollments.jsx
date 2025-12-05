import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../../../store/slices/adminSlice";
import { fetchCourses } from "../../../store/slices/coursesSlice";

export default function Enrollments() {
    const dispatch = useDispatch();
    const { enrollments, loading } = useSelector((state) => state.admin);
    const { courses } = useSelector((state) => state.courses);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchStudent, setSearchStudent] = useState("");

    useEffect(() => {
        dispatch(fetchEnrollments());
        dispatch(fetchCourses({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Filter enrollments by selected course and student name
    const filteredEnrollments = enrollments.filter((enr) => {
        const matchCourse = !selectedCourse || enr.course?._id === selectedCourse;
        const matchStudent = !searchStudent || enr.student?.name?.toLowerCase().includes(searchStudent.toLowerCase());
        return matchCourse && matchStudent;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Enrollment Management</h2>

            {/* Filters */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Filter by Course</span>
                            </label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="">All Courses</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
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

            {/* Results */}
            {loading ? (
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : filteredEnrollments.length === 0 ? (
                <div className="alert">
                    <span>No enrollments found</span>
                </div>
            ) : (
                <>
                    {/* Table view for md+ */}
                    <div className="hidden md:block overflow-x-auto border border-base-300 rounded-lg">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Enrolled Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnrollments.map((enr) => (
                                    <tr key={enr._id} className="hover:bg-base-100">
                                        <td className="font-semibold">{enr.student?.name}</td>
                                        <td>{enr.student?.email}</td>
                                        <td>{enr.course?.title}</td>
                                        <td>{new Date(enr.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge badge-success">Active</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card view for small screens */}
                    <div className="md:hidden space-y-3">
                        {filteredEnrollments.map((enr) => (
                            <div key={enr._id} className="card bg-base-100 shadow-sm border border-base-200">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-lg">{enr.student?.name}</div>
                                            <div className="text-sm text-base-content/70">{enr.student?.email}</div>
                                            <div className="text-sm text-base-content/70 mt-2">{enr.course?.title}</div>
                                            <div className="text-xs text-base-content/60 mt-2">
                                                Enrolled: {new Date(enr.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="badge badge-success">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center text-sm text-base-content/60">
                        Total: {filteredEnrollments.length} enrollment(s)
                    </div>
                </>
            )}
        </div>
    );
}
