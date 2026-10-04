import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Users, Award, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#78A083]/20 via-[#50727B]/15 to-[#344955]/25 border border-base-300 p-6 sm:p-12 mb-10 shadow-xl">
            {/* Background glowing blurred radial orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                {/* Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-100/80 backdrop-blur border border-primary/30 text-primary text-xs sm:text-sm font-bold shadow-sm">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span>Next-Gen Digital E-Learning Platform</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
                    Master In-Demand Skills with{" "}
                    <span className="gradient-text">CourseMaster</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-xl text-base-content/80 max-w-2xl mx-auto font-medium leading-relaxed">
                    Access expert-led video masterclasses, interactive quizzes, live sessions, and hands-on assignments to supercharge your tech career.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                    <Link
                        to="/courses"
                        className="btn btn-primary btn-lg px-8 shadow-xl hover:shadow-2xl font-extrabold gap-2 group w-full sm:w-auto"
                    >
                        <BookOpen className="w-5 h-5" /> Explore Courses
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {!isAuthenticated && (
                        <Link
                            to="/register"
                            className="btn btn-outline btn-lg px-8 border-2 font-bold w-full sm:w-auto hover:bg-base-200"
                        >
                            Get Started Free
                        </Link>
                    )}
                </div>

                {/* Key Highlights / Features */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-base-300/80 text-left">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-100/60 backdrop-blur border border-base-300/50">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-base-content">Industry-Driven</p>
                            <p className="text-xs text-base-content/60">Updated 2026 Syllabus</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-100/60 backdrop-blur border border-base-300/50">
                        <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-base-content">Active Community</p>
                            <p className="text-xs text-base-content/60">Live Mentorship & Q&A</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-100/60 backdrop-blur border border-base-300/50">
                        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-base-content">Certified Learning</p>
                            <p className="text-xs text-base-content/60">Quizzes & Assignments</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

