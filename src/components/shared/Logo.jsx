import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#78A083] to-[#50727B] text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight gradient-text">
                Course<span className="text-primary font-black">Master</span>
            </span>
        </Link>
    );
}

