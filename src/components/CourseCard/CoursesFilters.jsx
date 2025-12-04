export default function CoursesFilters({
    search, setSearch,
    sort, setSort,
    category, setCategory,
    tags, setTags,
    onSearchSubmit
}) {
    return (
        <div className="space-y-3">
            {/* Search */}
            <form onSubmit={onSearchSubmit} className="join w-full md:w-auto">
                <input
                    className="input input-bordered join-item w-full md:w-64"
                    placeholder="Search by title / instructor"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn join-item btn-primary">Search</button>
            </form>

            {/* Filters row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Sort */}
                <select
                    className="select select-bordered w-full"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort by price</option>
                    <option value="price_asc">Price Low → High</option>
                    <option value="price_desc">Price High → Low</option>
                </select>

                {/* Category */}
                <input
                    className="input input-bordered w-full"
                    placeholder="Category (e.g. web)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                {/* Tags */}
                <input
                    className="input input-bordered w-full"
                    placeholder="Tags (comma separated e.g. mern,react)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>
        </div>
    );
}
