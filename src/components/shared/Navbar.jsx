// import { Link, NavLink } from "react-router-dom";
// import Logo from "./Logo";

// // later you can connect auth from redux/context
// // const user = useSelector((state) => state.auth.user);

// export default function Navbar() {
//     const navLinkClass = ({ isActive }) =>
//         isActive
//             ? "text-primary font-semibold"
//             : "text-base-content/80 hover:text-primary";

//     const navItems = (
//         <>
//             <li>
//                 <NavLink className={navLinkClass} to="/">
//                     Home
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink className={navLinkClass} to="/courses">
//                     Courses
//                 </NavLink>
//             </li>
//             <li>
//                 <NavLink className={navLinkClass} to="/about">
//                     About
//                 </NavLink>
//             </li>
//         </>
//     );

//     return (
//         <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
//             <div className="navbar max-w-6xl mx-auto px-2">

//                 {/* LEFT: logo */}
//                 <div className="navbar-start">
//                     <Logo />
//                 </div>

//                 {/* CENTER: desktop menu only */}
//                 <div className="navbar-center hidden md:flex">
//                     <ul className="menu menu-horizontal gap-1">
//                         {navItems}
//                     </ul>
//                 </div>

//                 {/* RIGHT: desktop buttons + mobile 3-dot menu */}
//                 <div className="navbar-end gap-2">

//                     {/* Desktop action buttons */}
//                     <div className="hidden md:flex gap-2">
//                         <Link to="/login" className="btn btn-sm btn-ghost">
//                             Login
//                         </Link>
//                         <Link to="/register" className="btn btn-sm btn-primary">
//                             Enroll Now
//                         </Link>
//                     </div>

//                     {/* Mobile hamburger dropdown */}
//                     <div className="dropdown dropdown-end md:hidden">
//                         <label tabIndex={0} className="btn btn-ghost btn-circle">
//                             {/* Hamburger (3 lines) icon */}
//                             <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-6 w-6"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                             >
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                             </svg>
//                         </label>

//                         <ul
//                             tabIndex={0}
//                             className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56 border border-base-300"
//                         >
//                             {/* Mobile nav links */}
//                             {navItems}

//                             <div className="my-1 border-t border-base-300" />

//                             {/* Mobile actions */}
//                             <li>
//                                 <Link to="/login">Login</Link>
//                             </li>

//                             {/* Enroll Now as proper button */}
//                             <li className="mt-2">
//                                 <Link
//                                     to="/register"
//                                     className="btn btn-primary btn-sm w-full"
//                                 >
//                                     Enroll Now
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                 </div>
//             </div>
//         </header>
//     );
// }

import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

// later you can connect auth from redux/context
// const user = useSelector((state) => state.auth.user);

export default function Navbar() {
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-semibold"
            : "text-base-content/80 hover:text-primary";

    const navItems = (
        <>
            <li>
                <NavLink className={navLinkClass} to="/">
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink className={navLinkClass} to="/courses">
                    Courses
                </NavLink>
            </li>
            <li>
                <NavLink className={navLinkClass} to="/about">
                    About
                </NavLink>
            </li>
        </>
    );

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
            <div className="navbar max-w-6xl mx-auto px-2">

                {/* LEFT: logo */}
                <div className="navbar-start">
                    <Logo />
                </div>

                {/* CENTER: desktop menu only */}
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal gap-1">
                        {navItems}
                    </ul>
                </div>

                {/* RIGHT: desktop buttons + mobile hamburger menu */}
                <div className="navbar-end gap-2">

                    {/* Desktop action buttons */}
                    <div className="hidden md:flex gap-2">
                        <Link to="/login" className="btn btn-sm btn-ghost">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-sm btn-primary">
                            Enroll Now
                        </Link>
                    </div>

                    {/* Mobile hamburger dropdown (centered content) */}
                    <div className="dropdown dropdown-end md:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            {/* Hamburger (3 lines) icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>

                        <ul
                            tabIndex={0}
                            className="
                dropdown-content mt-3 p-3 shadow
                bg-base-100 rounded-box w-56 border border-base-300
                text-center
              "
                        >
                            {/* Centered nav links */}
                            <div className="menu menu-sm flex flex-col items-center gap-1">
                                {navItems}
                            </div>

                            <div className="my-2 border-t border-base-300" />

                            {/* Centered actions */}
                            <div className="flex flex-col items-center gap-2">
                                <Link to="/login" className="btn btn-ghost btn-sm w-full">
                                    Login
                                </Link>

                                <Link to="/register" className="btn btn-primary btn-sm w-full">
                                    Enroll Now
                                </Link>

                                {/* when auth added:
                  {user ? (
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full">
                      Logout
                    </button>
                  ) : (
                    <Link to="/login" className="btn btn-ghost btn-sm w-full">
                      Login
                    </Link>
                  )}
                */}
                            </div>
                        </ul>
                    </div>

                </div>
            </div>
        </header>
    );
}
