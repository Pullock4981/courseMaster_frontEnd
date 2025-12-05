import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { enrollCourse, getMyEnrollments, completeLesson } from "../../services/enrollment.api";

export const enrollCourseAsync = createAsyncThunk(
    "enrollment/enrollCourse",
    async (courseId, { rejectWithValue }) => {
        try {
            const res = await enrollCourse(courseId);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to enroll"
            );
        }
    }
);

export const fetchMyEnrollments = createAsyncThunk(
    "enrollment/fetchMyEnrollments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getMyEnrollments();
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to load enrollments"
            );
        }
    }
);

export const completeLessonAsync = createAsyncThunk(
    "enrollment/completeLesson",
    async ({ enrollmentId, lessonId }, { rejectWithValue }) => {
        try {
            const res = await completeLesson(enrollmentId, lessonId);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to complete lesson"
            );
        }
    }
);

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState: {
        enrollments: [],
        loading: false,
        enrolling: false,
        error: null,
        success: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(enrollCourseAsync.pending, (state) => {
                state.enrolling = true;
                state.error = null;
            })
            .addCase(enrollCourseAsync.fulfilled, (state, action) => {
                state.enrolling = false;
                state.success = "Successfully enrolled!";
                state.enrollments.push(action.payload);
            })
            .addCase(enrollCourseAsync.rejected, (state, action) => {
                state.enrolling = false;
                state.error = action.payload;
            })
            .addCase(fetchMyEnrollments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollments = action.payload;
            })
            .addCase(fetchMyEnrollments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(completeLessonAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(completeLessonAsync.fulfilled, (state) => {
                state.success = "Lesson marked complete!";
            })
            .addCase(completeLessonAsync.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
