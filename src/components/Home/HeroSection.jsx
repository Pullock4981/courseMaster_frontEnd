import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HeroSection() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="hero min-h-[35vh] sm:min-h-[40vh] relative overflow-hidden rounded-2xl mb-6 sm:mb-8">
            {/* Gradient Background - Using custom colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#78A083]/15 via-[#50727B]/10 to-[#344955]/15"></div>
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#78A083] rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#50727B] rounded-full blur-3xl"></div>
            </div>

            <div className="hero-content text-center py-6 sm:py-8 relative z-10">
                <div className="max-w-3xl">
                    <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                        <span className="text-base-content">Welcome to </span>
                        <span className="gradient-text">CourseMaster</span>
                    </h1>
                    <p className="mb-6 text-base sm:text-lg font-semibold text-base-content">
                        Learn from expert instructors and advance your career with our comprehensive courses
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/courses" className="btn btn-primary btn-md sm:btn-lg px-6 sm:px-8 shadow-sm hover:shadow-md font-bold">
                            Explore Courses
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn btn-outline btn-md sm:btn-lg px-6 sm:px-8 border-2 border-primary hover:bg-primary hover:text-primary-content font-bold">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

