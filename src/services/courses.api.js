import api from "./api";

export const getCourses = (params) => {
  return api.get("/courses", { params });
};

export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};
