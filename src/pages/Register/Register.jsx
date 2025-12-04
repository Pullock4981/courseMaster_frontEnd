import { useState } from "react";
import { registerUser } from "../../services/auth.api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            await registerUser(form);

            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="card bg-base-100 border border-base-300 shadow">
                <div className="card-body">
                    <h1 className="text-2xl font-bold text-primary">Create Account</h1>

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
