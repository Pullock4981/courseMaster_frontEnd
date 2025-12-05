import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import coursesReducer from "./slices/coursesSlice";
import enrollmentReducer from "./slices/enrollmentSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,
        enrollment: enrollmentReducer,
        admin: adminReducer,
    },
});

export default store;
