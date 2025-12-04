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
        <div className="max-w-md mx-auto">
            <div className="card bg-base-100 border border-base-300 shadow">
                <div className="card-body">
                    <h1 className="text-2xl font-bold text-primary">Login</h1>

                    {error && (
                        <div className="alert alert-error mt-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
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

                        <button disabled={loading} className="btn btn-primary w-full">
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-sm mt-3 text-center">
                        New here?{" "}
                        <Link className="link link-primary" to="/register">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
