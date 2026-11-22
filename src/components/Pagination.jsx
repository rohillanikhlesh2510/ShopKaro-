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
        className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        First
      </button>

      <button
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {start > 1 && (
        <span className="px-2 py-1 text-xs text-slate-400">...</span>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          className={`w-8 h-8 rounded-md text-xs font-semibold ${
            p === page
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-900 dark:border-white"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <span className="px-2 py-1 text-xs text-slate-400">...</span>
      )}

      <button
        type="button"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>

      <button
        type="button"
        onClick={() => setPage(totalPages)}
        disabled={page === totalPages}
        className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Last
      </button>
    </div>
  );
}

export default Pagination;
