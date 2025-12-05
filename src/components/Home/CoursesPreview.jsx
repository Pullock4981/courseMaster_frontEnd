import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courses.api";
import CoursesGrid from "../CourseCard/CoursesGrid";

export default function CoursesPreview() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch only 6 courses for preview
                const res = await getCourses({ page: 1, limit: 6 });
                setCourses(res.data.courses || []);
            } catch (err) {
                setError("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                        Featured Courses
                    </h2>
                    <p className="text-base-content/70 text-sm sm:text-base">
                        Discover our most popular courses and start your learning journey today
                    </p>
                </div>
                <Link
                    to="/courses"
                    className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                >
                    View All Courses →
                </Link>
            </div>

            {loading && (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="rounded-xl border border-primary/20 bg-base-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-primary">
                        No courses available yet
                    </h3>
                    <p className="mt-1 text-base-content/70">
                        Check back soon for new courses!
                    </p>
                </div>
            )}

            {!loading && !error && courses.length > 0 && (
                <>
                    <CoursesGrid courses={courses} />
                    <div className="flex justify-center pt-4">
                        <Link
                            to="/courses"
                            className="btn btn-outline btn-wide"
                        >
                            View More Courses
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

