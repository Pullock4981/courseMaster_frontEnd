import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { getMeAsync } from "../store/slices/authSlice";
import { fetchMyEnrollments } from "../store/slices/enrollmentSlice";

export default function MainLayout() {
    const dispatch = useDispatch();
    const { token, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !isAuthenticated) {
            dispatch(getMeAsync());
        }
    }, [token, isAuthenticated, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchMyEnrollments());
        }
    }, [isAuthenticated, dispatch]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full p-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
