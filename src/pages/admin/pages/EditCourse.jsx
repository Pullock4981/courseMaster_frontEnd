import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById } from "../../../store/slices/coursesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { updateCourseAsync } from "../../../store/slices/adminSlice";

export default function EditCourse() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentCourse, detailLoading } = useSelector((state) => state.courses);
    const { creating, error } = useSelector((state) => state.admin);

    const [form, setForm] = useState({
        title: "",
        description: "",
        instructorName: "",
        price: 0,
        category: "",
        tags: "",
        batches: [],
        syllabus: [],
    });

    useEffect(() => {
        if (!currentCourse || currentCourse._id !== id) {
            dispatch(fetchCourseById(id));
        }
    }, [dispatch, id, currentCourse]);

    useEffect(() => {
        if (currentCourse) {
            setForm({
                title: currentCourse.title || "",
                description: currentCourse.description || "",
                instructorName: currentCourse.instructorName || "",
                price: currentCourse.price || 0,
                category: currentCourse.category || "",
                tags: (currentCourse.tags || []).join(", "),
                batches: currentCourse.batches || [],
                syllabus: currentCourse.syllabus || [],
            });
        }
    }, [currentCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: name === "price" ? Number(value) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            title: form.title,
            description: form.description,
            instructorName: form.instructorName,
            price: form.price,
            category: form.category,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t),
            batches: form.batches,
            syllabus: form.syllabus,
        };

        dispatch(updateCourseAsync({ id, data: payload })).then((res) => {
            if (!res.error) {
                navigate("/admin/courses");
            }
        });
    };

    if (detailLoading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Edit Course</h1>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Course Title *</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter course title"
                        className="input input-bordered"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Description *</span>
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Course description"
                        className="textarea textarea-bordered h-28"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Instructor Name *</span>
                        </label>
                        <input
                            type="text"
                            name="instructorName"
                            value={form.instructorName}
                            onChange={handleChange}
                            placeholder="Instructor name"
                            className="input input-bordered"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Price (৳) *</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price in taka"
                            className="input input-bordered"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Category</span>
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g., Web Development"
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Tags (comma separated)</span>
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, web"
                            className="input input-bordered"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        disabled={creating}
                        className="btn btn-primary flex-1"
                    >
                        {creating ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Updating...
                            </>
                        ) : (
                            "Update Course"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/courses")}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
