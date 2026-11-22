function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-1.5 mt-8 mb-4">
      <button
        type="button"
        onClick={() => setPage(1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-md text-xs font-bold bg-white border-2 border-black text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        First
      </button>

      <button
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-md text-xs font-bold bg-white border-2 border-black text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {start > 1 && (
        <span className="px-2 py-1 text-xs font-bold text-neutral-500">...</span>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          className={`w-9 h-9 rounded-md text-xs font-extrabold border-2 transition-colors ${
            p === page
              ? "bg-black text-white border-black"
              : "bg-white text-black border-black hover:bg-neutral-100"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <span className="px-2 py-1 text-xs font-bold text-neutral-500">...</span>
      )}

      <button
        type="button"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-md text-xs font-bold bg-white border-2 border-black text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>

      <button
        type="button"
        onClick={() => setPage(totalPages)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-md text-xs font-bold bg-white border-2 border-black text-black hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Last
      </button>
    </div>
  );
}

export default Pagination;
