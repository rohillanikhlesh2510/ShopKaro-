import { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { CartContext } from "../context/CartContext";
import { getCategories, getProducts } from "../utils/api";

function Home() {
  const { inventoryVersion } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const limit = 8;

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage("");

    getProducts({
      search: query,
      category: selectedCategory,
      sort: sortOption,
      page,
      limit,
    })
      .then((data) => {
        if (!isMounted) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(Math.max(1, data.totalPages || 1));
        setTotalCount(data.total || 0);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage(err.message || "Failed to load product catalog.");
        setProducts([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, page, sortOption, selectedCategory, inventoryVersion]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchTerm.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setQuery("");
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
    setPage(1);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Header */}
      <div className="border-b-2 border-black pb-5 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Verified inventory database with real-time stock levels and server-side pricing verification.
          </p>
        </div>

        <div className="text-xs font-semibold text-black">
          {!loading && !errorMessage && (
            <span>
              Showing {products.length} of {totalCount} total items
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-black rounded-lg p-4 mb-6 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, brand, or specifications..."
              className="w-full px-3 py-2 text-sm rounded-md border-2 border-neutral-300 bg-white text-black focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm rounded-md border-2 border-neutral-300 bg-white text-black focus:outline-none focus:border-black font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm rounded-md border-2 border-neutral-300 bg-white text-black focus:outline-none focus:border-black font-medium"
            >
              <option value="">Sort: Newest</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-md text-sm font-bold border-2 border-black transition-colors"
            >
              Search
            </button>

            {(query || selectedCategory || sortOption) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-md text-sm font-bold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Presentation */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      ) : !errorMessage && products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No products match the selected criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different category from the filters above.
          </p>
          {(query || selectedCategory) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Clear Active Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !errorMessage && products.length > 0 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
}

export default Home;
