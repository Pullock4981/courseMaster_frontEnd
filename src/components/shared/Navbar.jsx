import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { getToken, clearToken } from "../../utils/auth";
import { getMe } from "../../services/auth.api";

export default function Navbar() {
    const navigate = useNavigate();
    const token = getToken();
    const [me, setMe] = useState(null);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-semibold"
            : "text-base-content/80 hover:text-primary";

    const handleLogout = () => {
        clearToken();
        setMe(null);
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const loadMe = async () => {
            if (!token) return setMe(null);
            try {
                const res = await getMe(token);
                setMe(res.data);
            } catch {
                clearToken();
                setMe(null);
            }
        };
        loadMe();
    }, [token]);

    const initials = me?.name
        ? me.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
            <div className="navbar max-w-6xl mx-auto px-2">

                {/* LEFT: Logo */}
                <div className="navbar-start">
                    <Logo />
                </div>

                {/* CENTER: Desktop menu */}
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal gap-1">
                        <li><NavLink className={navLinkClass} to="/">Home</NavLink></li>
                        <li><NavLink className={navLinkClass} to="/courses">Courses</NavLink></li>
                        <li><NavLink className={navLinkClass} to="/about">About</NavLink></li>

                        {/* ✅ Dashboard only when logged in */}
                        {token && me && (
                            <li>
                                <NavLink
                                    className={navLinkClass}
                                    to={me.role === "admin" ? "/admin" : "/student"}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>

                {/* RIGHT */}
                <div className="navbar-end gap-2">

                    {/* Desktop buttons if NOT logged in */}
                    {!token && (
                        <div className="hidden md:flex gap-2">
                            <Link to="/login" className="btn btn-sm btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-sm btn-primary">Enroll Now</Link>
                        </div>
                    )}

                    {/* Desktop avatar if logged in */}
                    {token && me && (
                        <div className="hidden md:block dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                    {initials}
                                </div>
                            </label>

                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60 border border-base-300"
                            >
                                <div className="px-2 pb-2">
                                    <p className="font-semibold">{me.name}</p>
                                    <p className="text-sm text-base-content/70">{me.email}</p>
                                    <p className="text-xs badge badge-outline mt-2">{me.role}</p>
                                </div>

                                <div className="my-2 border-t border-base-300" />

                                {/* ✅ Dashboard inside dropdown only when logged in */}
                                <li>
                                    <Link to={me.role === "admin" ? "/admin" : "/student"}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li><Link to="/profile">Profile</Link></li>
                                <li>
                                    <button onClick={handleLogout} className="text-red-500">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <div className="dropdown dropdown-end md:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>

                        <ul
                            tabIndex={0}
                            className="
                menu menu-sm dropdown-content mt-3 p-3 shadow
                bg-base-100 rounded-box w-56 border border-base-300
                items-center text-center
              "
                        >
                            <li><NavLink className={navLinkClass} to="/">Home</NavLink></li>
                            <li><NavLink className={navLinkClass} to="/courses">Courses</NavLink></li>
                            <li><NavLink className={navLinkClass} to="/about">About</NavLink></li>

                            {/* ✅ Dashboard only when logged in */}
                            {token && me && (
                                <li>
                                    <NavLink
                                        className={navLinkClass}
                                        to={me.role === "admin" ? "/admin" : "/student"}
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                            )}

                            <div className="my-2 w-full border-t border-base-300" />

                            {!token ? (
                                <>
                                    <li className="w-full">
                                        <Link to="/login" className="btn btn-ghost btn-sm w-full">Login</Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to="/register" className="btn btn-primary btn-sm w-full">Enroll Now</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center gap-2 py-2">
                                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                            {initials}
                                        </div>
                                        <p className="font-semibold">{me?.name}</p>
                                        <p className="text-xs text-base-content/70">{me?.email}</p>
                                    </div>

                                    <div className="my-2 w-full border-t border-base-300" />

                                    {/* ✅ Dashboard only when logged in */}
                                    <li className="w-full">
                                        <Link to={me?.role === "admin" ? "/admin" : "/student"} className="w-full">
                                            Dashboard
                                        </Link>
                                    </li>

                                    <li className="w-full"><Link to="/profile">Profile</Link></li>
                                    <li className="w-full">
                                        <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full text-red-500">
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                </div>
            </div>
        </header>
    );
}
