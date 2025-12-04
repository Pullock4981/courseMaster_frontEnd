import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
    return (
        <div className="card bg-base-100 shadow-md border">
            <div className="card-body">
                <h2 className="card-title">{course.title}</h2>

                <p className="text-sm opacity-80">
                    Instructor: {course.instructorName}
                </p>

                <div className="flex flex-wrap gap-2 my-2">
                    {course.tags?.map((t, i) => (
                        <span key={i} className="badge badge-outline">{t}</span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg">৳ {course.price}</span>
                    <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-sm btn-primary"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
