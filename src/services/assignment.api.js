import api from "./api";
import { getToken } from "../utils/auth";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const getMyAssignments = (courseId = null) => {
    const config = {
        ...getAuthHeader(),
        params: courseId ? { courseId } : {},
    };
    return api.get("/assignments/my", config);
};

export const getAssignmentStats = (courseId) => {
    const config = {
        ...getAuthHeader(),
        params: { courseId },
    };
    return api.get("/assignments/stats", config);
};

