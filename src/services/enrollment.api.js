import api from "./api";

export const enrollInCourse = (courseId, batchId = null) => {
    return api.post(`/enrollments/${courseId}`, batchId ? { batchId } : {});
};

export const getMyEnrollments = () => {
    return api.get("/enrollments/my");
};

export const completeLesson = (enrollmentId, lessonId) => {
    return api.patch(`/enrollments/${enrollmentId}/complete-lesson`, { lessonId });
};
