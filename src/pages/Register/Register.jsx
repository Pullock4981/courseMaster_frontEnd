import { useState } from "react";
import { registerUser } from "../../services/auth.api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", adminKey: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAdminKey, setShowAdminKey] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            // Only send adminKey if it's provided
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
            };
            if (form.adminKey.trim()) {
                payload.adminKey = form.adminKey.trim();
            }

            await registerUser(payload);

            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-2 sm:px-4 py-8">
            <div className="card bg-base-100 border-2 border-base-300 shadow-2xl">
                <div className="card-body p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                            <span className="gradient-text">Create Account</span>
                        </h1>
                        <p className="text-base-content/70">Start your learning journey today</p>
                    </div>

                    {error && (
                        <div className="alert alert-error shadow-lg">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>

                        {/* Admin Registration Key (Optional) */}
                        <div className="form-control">
                            <div className="flex items-center justify-between mb-2">
                                <label className="label py-0">
                                    <span className="label-text text-xs sm:text-sm">Admin Registration (Optional)</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowAdminKey(!showAdminKey)}
                                    className="btn btn-xs btn-ghost"
                                >
                                    {showAdminKey ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showAdminKey && (
                                <input
                                    name="adminKey"
                                    type="password"
                                    value={form.adminKey}
                                    onChange={handleChange}
                                    placeholder="Enter admin registration key"
                                    className="input input-bordered w-full input-sm"
                                />
                            )}
                            {showAdminKey && (
                                <label className="label py-0">
                                    <span className="label-text-alt text-xs opacity-70">
                                        Only required for admin account creation
                                    </span>
                                </label>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-xl mt-6"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="text-sm mt-6 text-center text-base-content/70">
                        Already have an account?{" "}
                        <Link className="link link-primary font-semibold" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
