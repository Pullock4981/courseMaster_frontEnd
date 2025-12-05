import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
    return (
        <div className="card bg-base-100 shadow-md border h-full flex flex-col">
            <div className="card-body p-3 sm:p-4 sm:p-6 flex flex-col flex-1">
                <h2 className="card-title text-base sm:text-lg break-words">{course.title}</h2>

                <p className="text-xs sm:text-sm opacity-80 mt-1">
                    Instructor: {course.instructorName}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-2 my-2">
                    {course.tags?.map((t, i) => (
                        <span key={i} className="badge badge-outline badge-xs sm:badge-sm">{t}</span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-base sm:text-lg">৳ {course.price}</span>
                    <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-xs sm:btn-sm btn-primary"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
