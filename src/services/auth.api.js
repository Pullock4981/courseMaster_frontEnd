import api from "./api";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const getMe = () => api.get("/auth/me"); // No need to pass token manually
