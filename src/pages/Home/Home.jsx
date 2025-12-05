import HeroSection from "../../components/Home/HeroSection";
import CoursesPreview from "../../components/Home/CoursesPreview";

export default function Home() {
    return (
        <div className="space-y-8 sm:space-y-12">
            <HeroSection />
            <CoursesPreview />
        </div>
    );
}
