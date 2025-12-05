import api from "./api";
import { getToken } from "../utils/auth";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const createCourse = (payload) =>
    api.post("/admin/courses", payload, getAuthHeader());

export const updateCourse = (id, payload) =>
    api.patch(`/admin/courses/${id}`, payload, getAuthHeader());

export const deleteCourse = (id) =>
    api.delete(`/admin/courses/${id}`, getAuthHeader());

export const getEnrollments = (params) =>
    api.get("/admin/enrollments", {
        ...getAuthHeader(),
        params,
    });

export const getAssignments = () =>
    api.get("/admin/assignments", getAuthHeader());
