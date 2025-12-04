import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../../services/courses.api";

export default function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getCourseById(id);
                setCourse(res.data);
            } catch (e) {
                setError("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="card bg-base-100 border border-base-300 shadow-md">
                <div className="card-body">
                    <h1 className="text-3xl font-extrabold text-primary">
                        {course.title}
                    </h1>
                    <p className="text-base-content/70">
                        Instructor: {course.instructorName}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {course.tags?.map((t, i) => (
                            <span key={i} className="badge badge-outline border-primary text-primary">
                                {t}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">
                            ৳ {course.price}
                        </p>

                        {/* Enroll button (for now UI only) */}
                        <button className="btn btn-primary">
                            Enroll Now
                        </button>
                    </div>
                </div>
            </div>

            {/* description */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                    <h2 className="text-xl font-semibold">Course Description</h2>
                    <p className="text-base-content/80 leading-relaxed">
                        {course.description}
                    </p>
                </div>
            </div>

            {/* syllabus / lessons placeholder */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body">
                    <h2 className="text-xl font-semibold">Syllabus</h2>

                    {course.lessons?.length ? (
                        <ul className="space-y-2 mt-2">
                            {course.lessons.map((l, idx) => (
                                <li key={l._id || idx} className="p-3 rounded-lg bg-base-200">
                                    <p className="font-medium">
                                        {idx + 1}. {l.title}
                                    </p>
                                    {l.duration && (
                                        <p className="text-sm text-base-content/70">
                                            Duration: {l.duration}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-base-content/70 mt-2">
                            Lessons will appear here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
