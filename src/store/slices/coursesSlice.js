import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCourses, getCourseById } from "../../services/courses.api";

export const fetchCourses = createAsyncThunk(
    "courses/fetchCourses",
    async (params, { rejectWithValue }) => {
        try {
            const res = await getCourses(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load courses");
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    "courses/fetchCourseById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getCourseById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Course not found");
        }
    }
);

const coursesSlice = createSlice({
    name: "courses",
    initialState: {
        courses: [],
        currentCourse: null,
        total: 0,
        totalPages: 1,
        page: 1,
        loading: false,
        detailLoading: false,
        error: null,
        filters: {
            search: "",
            sort: "",
            category: "",
            tags: "",
        },
    },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.page = 1;
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses || [];
                state.total = action.payload.total || 0;
                state.totalPages = action.payload.totalPages || 1;
                state.page = action.payload.page || 1;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCourseById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setPage, setFilters, clearCurrentCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
