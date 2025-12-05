import api from "./api";
import { getToken } from "../utils/auth";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const submitQuiz = (courseId, lessonId, answers) => {
    return api.post(
        "/quizzes/submit",
        { courseId, lessonId, answers },
        getAuthHeader()
    );
};

export const getMyQuizSubmissions = (courseId = null) => {
    const config = {
        ...getAuthHeader(),
        params: courseId ? { courseId } : {},
    };
    return api.get("/quizzes/my", config);
};

export const getQuizStats = (courseId) => {
    const config = {
        ...getAuthHeader(),
        params: { courseId },
    };
    return api.get("/quizzes/stats", config);
};
