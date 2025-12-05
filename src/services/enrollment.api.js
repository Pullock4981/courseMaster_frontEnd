import api from "./api";
import { getToken } from "../utils/auth";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const enrollCourse = (courseId, batchId = null) =>
    api.post(`/enrollments/${courseId}`, batchId ? { batchId } : {}, getAuthHeader());

export const getMyEnrollments = () =>
    api.get("/enrollments/my", getAuthHeader());

export const completeLesson = (enrollmentId, lessonId) =>
    api.patch(
        `/enrollments/${enrollmentId}/complete-lesson`,
        { lessonId },
        getAuthHeader()
    );

export const submitAssignment = (courseId, lessonId, answer) => {
    // Detect if answer is a link
    const isLink = answer.trim().startsWith("http://") || answer.trim().startsWith("https://");
    const answerType = isLink ? "link" : "text";

    return api.post(
        "/assignments/submit",
        { courseId, lessonId, answer, answerType },
        getAuthHeader()
    );
};
