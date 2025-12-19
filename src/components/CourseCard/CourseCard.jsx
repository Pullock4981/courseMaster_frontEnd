import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
    return (
        <div className="card bg-base-100 shadow-lg border-2 border-base-300 h-full flex flex-col hover:border-primary/30 transition-all duration-300 group">
            <div className="card-body p-4 sm:p-6 flex flex-col flex-1">
                <h2 className="card-title text-lg sm:text-xl break-words group-hover:text-primary transition-colors">
                    {course.title}
                </h2>

                <p className="text-sm text-base-content/70 mt-2 flex items-center gap-2">
                    <span className="font-semibold">Instructor:</span>
                    <span>{course.instructorName}</span>
                </p>

                {course.category && (
                    <div className="badge badge-primary badge-sm mt-2 w-fit">
                        {course.category}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 my-3">
                    {course.tags?.slice(0, 3).map((t, i) => (
                        <span key={i} className="badge badge-outline badge-sm hover:badge-primary transition-colors">
                            {t}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-base-300">
                    <div>
                        <span className="text-xs text-base-content/60">Price</span>
                        <p className="font-bold text-xl text-primary">৳ {course.price}</p>
                    </div>
                    <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-primary btn-sm sm:btn-md shadow-md hover:shadow-lg"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
