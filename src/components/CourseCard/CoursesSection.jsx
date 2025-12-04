import { useEffect, useState } from "react";
import { getCourses } from "../../services/courses.api";
import CoursesFilters from "./CoursesFilters";
import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

export default function CoursesSection() {
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // query states
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                search: search || undefined,
                sort: sort || undefined,
                category: category || undefined,
                tags: tags || undefined,
            };

            const res = await getCourses(params);
            setCourses(res.data.courses || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setError("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line
    }, [page, sort, category, tags]);

    const onSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCourses();
    };

    // reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [sort, category, tags]);

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h1 className="text-2xl font-bold">All Courses</h1>
            </div>

            <CoursesFilters
                search={search} setSearch={setSearch}
                sort={sort} setSort={setSort}
                category={category} setCategory={setCategory}
                tags={tags} setTags={setTags}
                onSearchSubmit={onSearchSubmit}
            />

            {/* states */}
            {loading && (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="alert alert-info">
                    <span>No courses found.</span>
                </div>
            )}

            {!loading && !error && courses.length > 0 && (
                <CoursesGrid courses={courses} />
            )}

            <CoursesPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            />
        </div>
    );
}
