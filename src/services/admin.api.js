import api from "./api";

export const createCourse = (payload) => api.post("/admin/courses", payload);
export const updateCourse = (id, payload) => api.patch(`/admin/courses/${id}`, payload);
export const deleteCourse = (id) => api.delete(`/admin/courses/${id}`);
export const getAllEnrollments = (filters = {}) => api.get("/admin/enrollments", { params: filters });
export const getAllAssignments = () => api.get("/admin/assignments");
export const getAnalytics = () => api.get("/admin/analytics");
export const reviewAssignment = (id, payload) => api.patch(`/admin/assignments/${id}/review`, payload);
export const getAllUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role });
export const toggleBanUser = (id) => api.patch(`/users/${id}/ban`);