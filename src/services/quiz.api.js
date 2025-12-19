import api from "./api";

export const submitQuiz = (payload) => {
    return api.post("/quizzes/submit", payload);
};

export const getMyQuizSubmissions = (courseId = null) => {
    return api.get("/quizzes/my", {
        params: courseId ? { courseId } : {},
    });
};

export const getQuizStats = (courseId) => {
    return api.get("/quizzes/stats", {
        params: { courseId },
    });
};
