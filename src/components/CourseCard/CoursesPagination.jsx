export default function CoursesPagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2">
            <button
                className="btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Prev
            </button>

            <span className="btn btn-sm btn-ghost">
                Page {page} / {totalPages}
            </span>

            <button
                className="btn btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
