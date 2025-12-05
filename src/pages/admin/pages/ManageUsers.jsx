import { useEffect, useState } from "react";
import { getToken } from "../../../utils/auth";
import api from "../../../services/api";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get("/users", {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setUsers(res.data || []);
            } catch (err) {
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-bold">Manage Users</h1>

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {users.length === 0 ? (
                <div className="alert">No users found</div>
            ) : (
                <div className="overflow-x-auto border border-base-300 rounded-lg">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-base-100">
                                    <td className="font-semibold">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={`badge badge-lg ${user.role === "admin"
                                                    ? "badge-error"
                                                    : "badge-primary"
                                                }`}
                                        >
                                            {user.role?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}