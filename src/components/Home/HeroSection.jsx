import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HeroSection() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="hero min-h-[40vh] sm:min-h-[50vh] bg-base-200 rounded-xl mb-6 sm:mb-8">
            <div className="hero-content text-center py-8 sm:py-12">
                <div className="max-w-2xl">
                    <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold">
                        Welcome to{" "}
                        <span className="text-primary">CourseMaster</span>
                    </h1>
                    <p className="mb-6 text-sm sm:text-base text-base-content/70">
                        Learn from expert instructors and advance your career
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/courses" className="btn btn-primary">
                            Explore Courses
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn btn-outline">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

