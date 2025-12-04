import axios from "axios";

const api = axios.create({
  baseURL: "https://course-master-backend-ochre.vercel.app/api",
});

export default api;
