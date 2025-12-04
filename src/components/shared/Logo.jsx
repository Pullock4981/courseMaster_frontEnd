import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2">
            {/* smaller on mobile, bigger on md+ */}
            <span className="font-extrabold text-primary text-lg md:text-2xl">
                CourseMaster
            </span>
        </Link>
    );
}

