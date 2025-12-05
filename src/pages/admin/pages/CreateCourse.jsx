import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCourseAsync } from "../../../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { creating, success, error } = useSelector((state) => state.admin);

    const [form, setForm] = useState({
        title: "",
        description: "",
        instructorName: "",
        price: 0,
        category: "",
        tags: "",
        batches: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "price" ? Number(value) : value,
        });
    };

    const addBatch = () => {
        setForm((s) => ({
            ...s,
            batches: [...s.batches, { name: "", startDate: "" }],
        }));
    };

    const removeBatch = (idx) => {
        setForm((s) => ({
            ...s,
            batches: s.batches.filter((_, i) => i !== idx),
        }));
    };

    const updateBatch = (idx, field, value) => {
        setForm((s) => {
            const newBatches = [...s.batches];
            newBatches[idx] = { ...newBatches[idx], [field]: value };
            return { ...s, batches: newBatches };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t),
            batches: form.batches,
        };

        dispatch(createCourseAsync(payload)).then((result) => {
            if (!result.payload?.message && !error) {
                setTimeout(() => navigate("/admin/courses"), 1500);
            }
        });
    };

    if (success) {
        return (
            <div className="alert alert-success">
                <span>{success}</span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Course</h1>

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

                {/* Batches Section */}
                <div className="divider">Batches (Optional)</div>
                <div className="space-y-3">
                    {form.batches.map((batch, idx) => (
                        <div key={idx} className="card bg-base-100 border border-base-300">
                            <div className="card-body">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Batch Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={batch.name}
                                            onChange={(e) => updateBatch(idx, "name", e.target.value)}
                                            placeholder="e.g., Batch 1, Jan 2025"
                                            className="input input-bordered input-sm"
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Start Date</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={batch.startDate}
                                            onChange={(e) => updateBatch(idx, "startDate", e.target.value)}
                                            className="input input-bordered input-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeBatch(idx)}
                                    className="btn btn-sm btn-error mt-2"
                                >
                                    Remove Batch
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addBatch}
                        className="btn btn-outline btn-sm"
                    >
                        + Add Batch
                    </button>
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
                                Creating...
                            </>
                        ) : (
                            "Create Course"
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
