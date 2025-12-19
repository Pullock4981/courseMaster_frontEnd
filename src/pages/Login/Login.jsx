import { useState } from "react";
import { loginUser } from "../../services/auth.api";
import { saveToken } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const res = await loginUser(form);
            saveToken(res.data.token);

            navigate("/"); // login হলে home এ পাঠাই
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
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
                            <span className="gradient-text">Welcome Back</span>
                        </h1>
                        <p className="text-base-content/70">Sign in to continue your learning journey</p>
                    </div>

                    {error && (
                        <div className="alert alert-error shadow-lg">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                                placeholder="Enter your password"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                        </div>

                        <button 
                            disabled={loading} 
                            className="btn btn-primary w-full btn-lg shadow-lg hover:shadow-xl mt-6"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <p className="text-sm mt-6 text-center text-base-content/70">
                        New here?{" "}
                        <Link className="link link-primary font-semibold" to="/register">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
