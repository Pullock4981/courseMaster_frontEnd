import api from "./api";

// No need for getToken and getAuthHeader anymore - interceptor handles it!

export const getMyAssignments = (courseId = null) => {
    return api.get("/assignments/my", {
        params: courseId ? { courseId } : {},
    });
};

export const getAssignmentStats = (courseId) => {
    return api.get("/assignments/stats", {
        params: { courseId },
    });
};

export const submitAssignment = (payload) => {
    return api.post("/assignments/submit", payload);
};

