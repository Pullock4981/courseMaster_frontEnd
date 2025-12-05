import CourseCard from "./CourseCard";

export default function CoursesGrid({ courses }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {courses.map((c) => (
                <CourseCard key={c._id} course={c} />
            ))}
        </div>
    );
}
