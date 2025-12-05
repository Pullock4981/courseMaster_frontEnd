import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCourse, updateCourse, deleteCourse, getEnrollments, getAssignments } from "../../services/admin.api";

export const createCourseAsync = createAsyncThunk(
    "admin/createCourse",
    async (courseData, { rejectWithValue }) => {
        try {
            const res = await createCourse(courseData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create course");
        }
    }
);

export const updateCourseAsync = createAsyncThunk(
    "admin/updateCourse",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await updateCourse(id, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update course");
        }
    }
);

export const deleteCourseAsync = createAsyncThunk(
    "admin/deleteCourse",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCourse(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete course");
        }
    }
);

export const fetchEnrollments = createAsyncThunk(
    "admin/fetchEnrollments",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await getEnrollments(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load enrollments");
        }
    }
);

export const fetchAssignments = createAsyncThunk(
    "admin/fetchAssignments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAssignments();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load assignments");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        enrollments: [],
        assignments: [],
        loading: false,
        creating: false,
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
            .addCase(createCourseAsync.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createCourseAsync.fulfilled, (state) => {
                state.creating = false;
                state.success = "Course created successfully!";
            })
            .addCase(createCourseAsync.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })
            .addCase(updateCourseAsync.fulfilled, (state) => {
                state.success = "Course updated successfully!";
            })
            .addCase(updateCourseAsync.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCourseAsync.fulfilled, (state) => {
                state.success = "Course deleted successfully!";
            })
            .addCase(deleteCourseAsync.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchEnrollments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollments = action.payload;
            })
            .addCase(fetchEnrollments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAssignments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccess } = adminSlice.actions;
export default adminSlice.reducer;
