import api from "./api";
import { getToken } from "../utils/auth";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const enrollCourse = (courseId) =>
    api.post(`/enrollments/${courseId}`, {}, getAuthHeader());

export const getMyEnrollments = () =>
    api.get("/enrollments/my", getAuthHeader());

export const completeLesson = (enrollmentId, lessonId) =>
    api.patch(
        `/enrollments/${enrollmentId}/complete-lesson`,
        { lessonId },
        getAuthHeader()
    );

export const submitAssignment = (courseId, lessonId, answer) =>
    api.post(
        "/assignments/submit",
        { courseId, lessonId, answer, answerType: "text" },
        getAuthHeader()
    );
