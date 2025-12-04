import api from "./api";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const getMe = (token) =>
    api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
