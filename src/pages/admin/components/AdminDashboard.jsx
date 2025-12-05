import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getToken } from "../../../utils/auth";
import { getMe } from "../../../services/auth.api";
import AdminRoute from "../../../routes/AdminRoute";
import AdminSidebar from "./AdminSidebar";
// import AdminSidebar from "./components/AdminSidebar";
// import { useEffect, useState } from "react";
// import { getToken } from "../../utils/auth";
// import { getMe } from "../../services/auth.api";
// import AdminRoute from "../../routes/AdminRoute";

export default function AdminDashboard() {
    const [me, setMe] = useState(null);

    useEffect(() => {
        const loadMe = async () => {
            const token = getToken();
            const res = await getMe(token);
            setMe(res.data);
        };
        loadMe();
    }, []);

    return (
        <AdminRoute me={me}>
            {/* full width override */}
            <div className="w-full max-w-none flex flex-col lg:flex-row min-h-[80vh]">

                {/* sidebar - hidden on mobile, shown via drawer */}
                <div className="hidden lg:block shrink-0">
                    <AdminSidebar />
                </div>

                {/* Mobile drawer toggle button */}
                <div className="lg:hidden">
                    <AdminSidebar />
                </div>

                {/* content area */}
                <main className="flex-1 p-2 sm:p-4 lg:p-5 bg-base-100 w-full">
                    <Outlet />
                </main>

            </div>
        </AdminRoute>
    );
}
