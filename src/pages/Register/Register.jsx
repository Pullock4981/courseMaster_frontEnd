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
        <div className="max-w-md mx-auto px-2 sm:px-4">
            <div className="card bg-base-100 border border-base-300 shadow">
                <div className="card-body p-4 sm:p-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-primary">Create Account</h1>

                    {error && (
                        <div className="alert alert-error mt-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full name"
                            className="input input-bordered w-full"
                            required
                        />
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input input-bordered w-full"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="input input-bordered w-full"
                            required
                        />

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
                            className="btn btn-primary w-full"
                        >
                            {loading ? "Creating..." : "Register"}
                        </button>
                    </form>

                    <p className="text-sm mt-3 text-center">
                        Already have an account?{" "}
                        <Link className="link link-primary" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
