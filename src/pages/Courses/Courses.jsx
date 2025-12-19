import CoursesSection from "../../components/CourseCard/CoursesSection";

export default function Courses() {
    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <h1 className="page-heading mb-4 sm:mb-6">All Courses</h1>
            <CoursesSection />
        </div>
    );
}

